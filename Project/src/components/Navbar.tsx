import { Link, useLocation } from "react-router-dom";
import { Disc3, ShoppingCart, MessageSquare, User, LogIn, Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { cart, currentUser } = useAppStore();
  const { profile, loading, signOut } = useAuth();
  const location = useLocation();

  // While Supabase auth is loading, fall back to persisted currentUser
  const isAuthenticated = !!profile || (loading && !!currentUser);
  const displayName = profile?.name ?? currentUser?.name ?? "";
  const userId = profile?.id ?? currentUser?.id ?? "";

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      location.pathname === path
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Disc3 className="h-7 w-7 text-primary animate-spin" style={{ animationDuration: '3s' }} aria-hidden="true" />
          <span className="text-xl font-bold font-heading text-gradient-gold" >
            CD Маркет
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/" className={linkClass("/")}>
            <Disc3 className="h-4 w-4" />
            <span className="hidden sm:inline">Каталог</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/sell" className={linkClass("/sell")}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Продати</span>
              </Link>
              <Link to="/messages" className={linkClass("/messages")}>
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Чат</span>
              </Link>
              <Link to="/cart" className={linkClass("/cart")}>
                <ShoppingCart className="h-4 w-4" />
                {cart.length > 0 && (
                  <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground" aria-label={`${cart.length} товарів у корзині`}>
                    {cart.length}
                  </Badge>
                )}
              </Link>
              <Link to={`/seller/${userId}`} className={linkClass(`/seller/${userId}`)}>
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{displayName}</span>
              </Link>
              <button onClick={signOut} aria-label="Вийти з акаунту" className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                Вийти
              </button>
            </>
          )}

          {!isAuthenticated && (
            <Link to="/auth" className={linkClass("/auth")}>
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Увійти</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
