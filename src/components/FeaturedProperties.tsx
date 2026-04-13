import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useProperties } from "@/hooks/useProperties";

export function FeaturedProperties() {
  const { properties, loading } = useProperties();
  const featured = properties.slice(0, 4);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border/30 animate-pulse">
              <div className="h-48 bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            إقامات <span className="text-gradient-gold">مميزة</span>
          </h2>
          <p className="text-muted-foreground font-arabic">أفضل العروض المختارة لك</p>
        </div>
        <Link
          to="/search"
          className="hidden md:block px-6 py-2 rounded-xl border border-primary text-primary font-arabic text-sm hover:bg-primary hover:text-primary-foreground transition-all"
        >
          عرض الكل
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((property) => (
          <Link
            key={property.id}
            to={`/property/${property.id}`}
            className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 group cursor-pointer border border-border/30"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={property.image}
                alt={property.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-arabic text-foreground">
                {property.type}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-heading font-semibold text-foreground mb-1">{property.name}</h3>
              <p className="text-sm font-arabic text-muted-foreground mb-3 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {property.location}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-heading font-bold text-primary">{property.price.toLocaleString()}</span>
                  <span className="text-xs font-arabic text-muted-foreground mr-1">دج / ليلة</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="text-sm font-arabic font-semibold text-foreground">{property.rating}</span>
                  <span className="text-xs font-arabic text-muted-foreground">({property.reviews})</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
