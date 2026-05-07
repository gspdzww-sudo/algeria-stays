import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Star, MapPin, Heart, ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  type: string;
  image: string;
  images?: string[];
}

export function PropertyCard(p: PropertyCardProps) {
  const gallery = (p.images && p.images.length > 0 ? p.images : [p.image]).filter(Boolean);
  const [idx, setIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const location = useLocation();
  const fromPath = location.pathname + location.search;

  const go = (e: React.MouseEvent, dir: 1 | -1) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((prev) => (prev + dir + gallery.length) % gallery.length);
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked((v) => !v);
  };

  return (
    <Link
      to={`/property/${p.id}`}
      state={{ from: fromPath }}
      className="group block animate-fade-in"
    >
      <div className="relative h-56 rounded-2xl overflow-hidden bg-muted shadow-soft group-hover:shadow-elevated transition-shadow duration-300">
        {gallery.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${p.name} - ${i + 1}`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              i === idx ? "opacity-100" : "opacity-0"
            } group-hover:scale-105 [transition:opacity_500ms_ease,transform_700ms_ease]`}
          />
        ))}

        {/* Top badges */}
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-arabic text-foreground shadow-soft">
          {p.type}
        </span>
        <button
          onClick={toggleLike}
          aria-label="مفضلة"
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-all hover:scale-110 shadow-soft"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              liked ? "fill-primary text-primary" : "text-foreground"
            }`}
          />
        </button>

        {/* Carousel arrows (desktop hover) */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={(e) => go(e, 1)}
              aria-label="السابق"
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/95 items-center justify-center shadow-soft opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={(e) => go(e, -1)}
              aria-label="التالي"
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/95 items-center justify-center shadow-soft opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {gallery.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-4 bg-primary-foreground" : "w-1.5 bg-primary-foreground/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="pt-3 px-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-heading font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {p.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-4 w-4 fill-gold text-gold" />
            <span className="text-sm font-arabic font-semibold text-foreground">{p.rating}</span>
            <span className="text-xs font-arabic text-muted-foreground">({p.reviews})</span>
          </div>
        </div>
        <p className="text-sm font-arabic text-muted-foreground mb-2 flex items-center gap-1 line-clamp-1">
          <MapPin className="h-3 w-3 shrink-0" />
          {p.location}
        </p>
        <div>
          <span className="text-lg font-heading font-bold text-primary">
            {p.price.toLocaleString()}
          </span>
          <span className="text-xs font-arabic text-muted-foreground mr-1">دج / ليلة</span>
        </div>
      </div>
    </Link>
  );
}