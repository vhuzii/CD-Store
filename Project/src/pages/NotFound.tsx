import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-2">Ой! Сторінку не знайдено.</p>
      <code className="bg-muted p-2 rounded text-sm mb-6">
        {window.location.origin}{import.meta.env.BASE_URL.replace(/\/$/, '')}{location.pathname}
      </code>
      <Button asChild>
        <Link to="/">Повернутися в магазин</Link>
      </Button>
    </div>
  );
};

export default NotFound;