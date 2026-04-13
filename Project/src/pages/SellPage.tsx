import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import { GENRES, Genre } from "@/lib/mockData";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const SellPage = () => {
  const { currentUser, addCD, cds, toggleCDActive } = useAppStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState<Genre>("Rock");
  const [price, setPrice] = useState("");
  const [year, setYear] = useState("");
  const [condition, setCondition] = useState<"Новий" | "Б/У відмінний" | "Б/У хороший">("Новий");
  const [description, setDescription] = useState("");

  if (!currentUser) {
    navigate("/auth");
    return null;
  }

  const myCDs = cds.filter(cd => cd.sellerId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedArtist = artist.trim();
    const numPrice = Number(price);

    if (!trimmedTitle || !trimmedArtist) {
      toast.error("Заповніть назву та виконавця");
      return;
    }
    if (!price || numPrice <= 0) {
      toast.error("Вкажіть коректну ціну (більше 0)");
      return;
    }

    addCD({
      title: trimmedTitle, artist: trimmedArtist, genre, price: numPrice,
      year: Number(year) || new Date().getFullYear(),
      condition, description: description.trim(),
      coverUrl: `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop`,
    });
    toast.success("Диск додано!");
    setTitle(""); setArtist(""); setPrice(""); setYear(""); setDescription("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold font-heading mb-6">
        <Plus className="inline h-8 w-8 text-primary mr-2" />
        Продати диск
      </h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-2xl p-6 space-y-4 mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Назва альбому *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required maxLength={100} placeholder="Nevermind"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Виконавець *</label>
            <input value={artist} onChange={e => setArtist(e.target.value)} required maxLength={100} placeholder="Nirvana"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Жанр</label>
            <select value={genre} onChange={e => setGenre(e.target.value as Genre)}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Стан</label>
            <select value={condition} onChange={e => setCondition(e.target.value as typeof condition)}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="Новий">Новий</option>
              <option value="Б/У відмінний">Б/У відмінний</option>
              <option value="Б/У хороший">Б/У хороший</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Ціна (₴) *</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min={1} placeholder="350"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Рік</label>
            <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="1991"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Опис</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} maxLength={500} placeholder="Опишіть стан диску..."
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
        </div>
        <button type="submit"
          className="px-6 py-2.5 rounded-lg font-medium text-sm bg-gradient-gold text-primary-foreground hover:opacity-90 transition-opacity">
          Додати диск
        </button>
      </motion.form>

      {myCDs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold font-heading mb-4">Мої диски</h2>
          <div className="space-y-3">
            {myCDs.map(cd => (
              <div key={cd.id} className={`flex items-center gap-4 bg-card border rounded-xl p-4 transition-opacity ${!cd.active ? 'opacity-50 border-border' : 'border-border'}`}>
                <img src={cd.coverUrl} alt={cd.title} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{cd.title}</h3>
                  <p className="text-sm text-muted-foreground">{cd.artist} · {cd.price} ₴</p>
                </div>
                <button
                  onClick={() => toggleCDActive(cd.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    cd.active
                      ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {cd.active ? "Деактивувати" : "Активувати"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellPage;
