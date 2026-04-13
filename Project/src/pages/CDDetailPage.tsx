import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { ShoppingCart, MessageSquare, ArrowLeft, User, Calendar, Disc, Tag } from "lucide-react";

const CDDetailPage = () => {
  const { cdId } = useParams<{ cdId: string }>();
  const { cds, currentUser, addToCart, cart } = useAppStore();
  const navigate = useNavigate();

  const cd = cds.find(p => p.id === cdId);
  if (!cd) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Диск не знайдено</h1>
          <Link to="/" className="text-primary hover:underline">Повернутися до каталогу</Link>
        </div>
      </div>
    );
  }

  const inCart = cart.some(i => i.cd.id === cd.id);

  return (
    <div className="min-h-screen pt-20 px-4 pb-12 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Назад
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-xl overflow-hidden border border-border shadow-card">
          <img src={cd.coverUrl} alt={`${cd.title} - ${cd.artist}`} className="w-full aspect-square object-cover" />
        </div>

        <div className="space-y-6">
          <div>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">{cd.genre}</span>
            <h1 className="text-3xl font-bold font-heading text-foreground mt-3">{cd.title}</h1>
            <p className="text-lg text-muted-foreground mt-1">{cd.artist}</p>
          </div>

          <p className="text-3xl font-bold text-primary">{cd.price} ₴</p>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" /> <span>Рік: {cd.year}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Disc className="h-4 w-4" /> <span>Стан: {cd.condition}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-4 w-4" /> <span>Жанр: {cd.genre}</span>
            </div>
            <Link to={`/seller/${cd.sellerId}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <User className="h-4 w-4" /> <span>Продавець: {cd.sellerName}</span>
            </Link>
          </div>

          <div className="border-t border-border pt-4">
            <h2 className="font-semibold text-foreground mb-2">Опис</h2>
            <p className="text-muted-foreground">{cd.description}</p>
          </div>

          {currentUser && currentUser.id !== cd.sellerId && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => inCart ? navigate('/cart') : addToCart(cd)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                {inCart ? "Перейти до корзини" : "Додати до корзини"}
              </button>
              <Link
                to={`/messages?to=${cd.sellerId}&cd=${cd.id}`}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <MessageSquare className="h-4 w-4" /> Написати
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CDDetailPage;
