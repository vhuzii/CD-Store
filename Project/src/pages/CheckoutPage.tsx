import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const CheckoutPage = () => {
  const { currentUser, cart, clearCart, sendMessage } = useAppStore();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [novaPoshtaAddress, setNovaPoshtaAddress] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!currentUser) {
    navigate("/auth");
    return null;
  }

  if (cart.length === 0 && !submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Корзина порожня</p>
          <Link to="/" className="text-primary hover:underline text-sm mt-2 inline-block">До каталогу</Link>
        </div>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.cd.price, 0);

  // Group by seller
  const bySeller = new Map<string, typeof cart>();
  cart.forEach(item => {
    const existing = bySeller.get(item.cd.sellerId) || [];
    existing.push(item);
    bySeller.set(item.cd.sellerId, existing);
  });

  const sellerEntries = [...bySeller.entries()];
  const multipleSellers = bySeller.size > 1;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !novaPoshtaAddress.trim()) return;

    bySeller.forEach((items, sellerId) => {
      const itemsList = items.map(i => `• ${i.cd.title} — ${i.cd.artist} (${i.cd.price} ₴)`).join("\n");
      const msg = `🛒 Нове замовлення!\n\nДиски:\n${itemsList}\n\nПокупець: ${fullName}\nТелефон: ${phone}\nДоставка (Нова Пошта): ${novaPoshtaAddress}${comment.trim() ? `\nКоментар: ${comment.trim()}` : ""}`;
      sendMessage(sellerId, msg);
    });

    clearCart();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Замовлення оформлено!</h2>
          <p className="text-muted-foreground mb-4">Повідомлення надіслано продавцям</p>
          <Link to="/messages" className="text-primary hover:underline">Перейти до повідомлень</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Оформлення</h1>

      {multipleSellers && (
        <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-accent/10 border border-accent/30">
          <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div className="text-sm text-foreground">
            <p className="font-medium mb-1">Увага: у замовленні товари від {bySeller.size} продавців</p>
            <p className="text-muted-foreground">Кожен продавець відправлятиме свою посилку окремо.</p>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="font-semibold mb-1 text-foreground">Ваше замовлення</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Дані замовлення будуть надіслані продавцям: {sellerEntries.map(([, items]) => items[0].cd.sellerName).join(", ")}
        </p>

        {sellerEntries.map(([sellerId, items]) => (
          <div key={sellerId} className="mb-4 last:mb-0">
            <Link to={`/seller/${sellerId}`} className="text-xs font-medium text-primary hover:underline mb-2 block">
              🏪 {items[0].cd.sellerName}
            </Link>
            {items.map(item => (
              <div key={item.cd.id} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0 ml-4">
                <span className="text-foreground">{item.cd.title} — {item.cd.artist}</span>
                <span className="text-primary font-medium">{item.cd.price} ₴</span>
              </div>
            ))}
          </div>
        ))}

        <div className="flex justify-between font-bold mt-3 pt-3 border-t border-border">
          <span>Всього</span>
          <span className="text-primary">{total} ₴</span>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleCheckout}
        className="bg-card border border-border rounded-2xl p-6 space-y-4"
      >
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">ПІБ *</label>
          <input value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Іваненко Іван Іванович"
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Номер телефону *</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} required placeholder="+380 XX XXX XX XX"
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Адреса Нової Пошти *</label>
          <input value={novaPoshtaAddress} onChange={e => setNovaPoshtaAddress(e.target.value)} required placeholder="м. Київ, відділення №25"
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Коментар</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Побажання до замовлення..." rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
        </div>
        <button type="submit"
          className="w-full py-2.5 rounded-lg font-medium text-sm bg-gradient-gold text-primary-foreground hover:opacity-90 transition-opacity">
          Оформити замовлення
        </button>
      </motion.form>
    </div>
  );
};

export default CheckoutPage;
