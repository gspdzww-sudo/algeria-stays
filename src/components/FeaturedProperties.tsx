import { Star } from "lucide-react";

const properties = [
  {
    name: "فندق الأوراسي",
    location: "الجزائر العاصمة",
    price: 12000,
    rating: 4.8,
    reviews: 234,
    type: "فندق 5 نجوم",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
  },
  {
    name: "شقة مطلة على البحر",
    location: "وهران",
    price: 6500,
    rating: 4.5,
    reviews: 89,
    type: "شقة مفروشة",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
  },
  {
    name: "فيلا الياسمين",
    location: "بجاية",
    price: 18000,
    rating: 4.9,
    reviews: 156,
    type: "فيلا",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
  },
  {
    name: "شاليه الصنوبر",
    location: "تيبازة",
    price: 8000,
    rating: 4.6,
    reviews: 67,
    type: "شاليه",
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&q=80",
  },
];

export function FeaturedProperties() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            إقامات <span className="text-gradient-gold">مميزة</span>
          </h2>
          <p className="text-muted-foreground font-arabic">أفضل العروض المختارة لك</p>
        </div>
        <button className="hidden md:block px-6 py-2 rounded-xl border border-primary text-primary font-arabic text-sm hover:bg-primary hover:text-primary-foreground transition-all">
          عرض الكل
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <div
            key={property.name}
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
              <p className="text-sm font-arabic text-muted-foreground mb-3">{property.location}</p>
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
          </div>
        ))}
      </div>
    </section>
  );
}
