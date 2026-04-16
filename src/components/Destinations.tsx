import { useNavigate } from "react-router-dom";
import destAlgiers from "@/assets/dest-algiers.jpg";
import destOran from "@/assets/dest-oran.jpg";
import destBejaia from "@/assets/dest-bejaia.jpg";
import destConstantine from "@/assets/dest-constantine.jpg";
import destSahara from "@/assets/dest-sahara.jpg";

const destinations = [
  { name: "الجزائر العاصمة", image: destAlgiers, properties: 450, tag: "الأكثر طلباً" },
  { name: "وهران", image: destOran, properties: 320, tag: "شاطئية" },
  { name: "بجاية", image: destBejaia, properties: 180, tag: "طبيعة خلابة" },
  { name: "قسنطينة", image: destConstantine, properties: 210, tag: "تاريخية" },
  { name: "تمنراست", image: destSahara, properties: 90, tag: "صحراوية" },
];

export function Destinations() {
  const navigate = useNavigate();

  const handleClick = (name: string) => {
    navigate(`/search?wilaya=${encodeURIComponent(name)}`);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" dir="rtl">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
          وجهات <span className="text-gradient-gold">مميزة</span>
        </h2>
        <p className="text-muted-foreground font-arabic max-w-xl mx-auto">
          اكتشف أجمل المدن الجزائرية واحجز إقامتك في أفضل الفنادق والشقق
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest, i) => (
          <div
            key={dest.name}
            onClick={() => handleClick(dest.name)}
            className={`group relative rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 cursor-pointer ${
              i === 0 ? "md:col-span-2 md:row-span-2 min-h-[400px]" : "min-h-[240px]"
            }`}
          >
            <img
              src={dest.image}
              alt={dest.name}
              loading="lazy"
              width={800}
              height={600}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 right-0 p-6">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-arabic mb-2">
                {dest.tag}
              </span>
              <h3 className="text-xl md:text-2xl font-heading font-bold text-primary-foreground">{dest.name}</h3>
              <p className="text-sm font-arabic text-primary-foreground/80">{dest.properties} إقامة متاحة</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
