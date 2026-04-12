import heroImage from "@/assets/hero-hotel.jpg";
import { HeroSearch } from "./HeroSearch";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="فندق فاخر في الجزائر"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" dir="rtl">
        <div className="animate-fade-up mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-primary-foreground mb-4 leading-tight">
            اكتشف الجزائر <span className="text-gradient-gold">بأفضل الأسعار</span>
          </h1>
          <p className="text-lg md:text-xl font-arabic text-primary-foreground/80 max-w-2xl mx-auto">
            احجز فندقك أو شقتك المفروشة عبر 58 ولاية بكل سهولة وأمان
          </p>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <HeroSearch />
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          {[
            { number: "58", label: "ولاية مغطاة" },
            { number: "+2000", label: "فندق وشقة" },
            { number: "+50K", label: "حجز ناجح" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground">{stat.number}</div>
              <div className="text-sm font-arabic text-primary-foreground/70 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
