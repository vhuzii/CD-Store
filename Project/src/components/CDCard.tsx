import { CDProduct } from "@/lib/mockData";
import { useAppStore } from "@/lib/store";
import { ShoppingCart, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface CDCardProps {
  cd: CDProduct;
  showSeller?: boolean;
}

const CDCard = ({ cd, showSeller = true }: CDCardProps) => {
  const { currentUser, addToCart, cart } = useAppStore();
  const navigate = useNavigate();
  const inCart = cart.some(i => i.cd.id === cd.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 shadow-card hover:shadow-glow cursor-pointer"
    >
      <Link to={`/cd/${cd.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={cd.coverUrl}
            alt={`${cd.title} - ${cd.artist}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
              {cd.genre}
            </span>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground truncate">
            {cd.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{cd.artist} · {cd.year}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">{cd.price} ₴</span>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              {cd.condition}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 space-y-2">
        {showSeller && (
          <Link
            to={`/seller/${cd.sellerId}`}
            className="block text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Продавець: {cd.sellerName}
          </Link>
        )}

        <div className="flex gap-2 pt-2">
          {currentUser && currentUser.id !== cd.sellerId && (
            <>
              <button
                onClick={() => { if (inCart) { navigate('/cart'); } else { addToCart(cd); toast.success(`${cd.title} додано до корзини`); } }}
                aria-label={inCart ? `${cd.title} — перейти до корзини` : `Купити ${cd.title}`}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {inCart ? "В корзині" : "Купити"}
              </button>
              <Link
                to={`/messages?to=${cd.sellerId}&cd=${cd.id}`}
                aria-label={`Написати продавцю про ${cd.title}`}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CDCard;
