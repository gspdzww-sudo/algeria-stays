import { Link } from "react-router-dom";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/PropertyCard";

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
          <PropertyCard
            key={property.id}
            id={property.id}
            name={property.name}
            location={property.location}
            price={property.price}
            rating={property.rating}
            reviews={property.reviews}
            type={property.type}
            image={property.image}
            images={property.images}
          />
        ))}
      </div>
    </section>
  );
}
