import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { GENRES, Genre } from "@/lib/mockData";
import CDCard from "@/components/CDCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface CatalogFiltersProps {
  sellerId?: string;
}

const CatalogPage = ({ sellerId }: CatalogFiltersProps) => {
  const { cds, users } = useAppStore();
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [artistQuery, setArtistQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(true);

  const seller = sellerId ? users.find(u => u.id === sellerId) : null;

  const filteredCDs = useMemo(() => {
    return cds.filter(cd => {
      if (!cd.active) return false;
      if (sellerId && cd.sellerId !== sellerId) return false;
      if (selectedGenres.length > 0 && !selectedGenres.includes(cd.genre)) return false;
      if (artistQuery && !cd.artist.toLowerCase().includes(artistQuery.toLowerCase())) return false;
      if (cd.price < priceRange[0] || cd.price > priceRange[1]) return false;
      return true;
    });
  }, [cds, selectedGenres, artistQuery, priceRange, sellerId]);

  const toggleGenre = (genre: Genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const maxPrice = Math.max(...cds.map(cd => cd.price), 1000);

  return (
    <div className="container mx-auto px-4 py-8">
      {seller ? (
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            Диски від <span className="text-gradient-gold">{seller.name}</span>
          </h1>
          <p className="text-muted-foreground mt-1">На платформі з {seller.joinedAt}</p>
        </div>
      ) : (
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Знайди свій <span className="text-gradient-gold">диск</span>
          </motion.h1>
          <p className="text-muted-foreground text-lg">Маркетплейс CD-дисків в Україні</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <div className="lg:w-72 shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground mb-4"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Фільтри
          </button>

          <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Artist search */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Виконавець</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={artistQuery}
                  onChange={e => setArtistQuery(e.target.value)}
                  placeholder="Пошук по виконавцю..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Genre filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Жанр</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedGenres.includes(genre)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Ціна (₴)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                  placeholder="Від"
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none text-sm"
                />
                <span className="text-muted-foreground">–</span>
                <input
                  type="number"
                  min={priceRange[0]}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  placeholder="До"
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none text-sm"
                />
              </div>
            </div>

            {(selectedGenres.length > 0 || artistQuery || priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <button
                onClick={() => { setSelectedGenres([]); setArtistQuery(""); setPriceRange([0, maxPrice]); }}
                className="text-sm text-primary hover:underline"
              >
                Скинути фільтри
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          {filteredCDs.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Нічого не знайдено</p>
              <p className="text-sm mt-1">Спробуйте змінити фільтри</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCDs.map(cd => (
                <CDCard key={cd.id} cd={cd} showSeller={!sellerId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
