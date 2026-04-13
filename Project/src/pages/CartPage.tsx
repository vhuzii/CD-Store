import { useAppStore } from "@/lib/store";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CartPage = () => {
  const { cart, removeFromCart, currentUser } = useAppStore();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Увійдіть, щоб переглянути корзину</p>
          <Link to="/auth" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            Увійти
          </Link>
        </div>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.cd.price, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold font-heading mb-6">
        <ShoppingBag className="inline h-8 w-8 text-primary mr-2" />
        Корзина
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">Корзина порожня</p>
          <Link to="/" className="text-primary hover:underline text-sm mt-2 inline-block">
            Перейти до каталогу
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <motion.div
              key={item.cd.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-4 bg-card border border-border rounded-xl p-4"
            >
              <img src={item.cd.coverUrl} alt={item.cd.title} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{item.cd.title}</h3>
                <p className="text-sm text-muted-foreground">{item.cd.artist}</p>
              </div>
              <span className="text-primary font-bold whitespace-nowrap">{item.cd.price} ₴</span>
              <button
                onClick={() => { removeFromCart(item.cd.id); toast.success(`${item.cd.title} видалено з корзини`); }}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}

          <div className="border-t border-border pt-4 mt-4 flex items-center justify-between">
            <span className="text-lg font-bold">Всього: <span className="text-primary">{total} ₴</span></span>
            <button
              onClick={() => navigate("/checkout")}
              className="px-6 py-2.5 rounded-lg font-medium text-sm bg-gradient-gold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Оформити замовлення
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
