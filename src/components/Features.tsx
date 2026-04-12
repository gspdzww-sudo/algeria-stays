import { CreditCard, Shield, Clock, MapPin, Star, Headphones } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "دفع محلي آمن",
    description: "ادفع بالذهبية، BaridiMob أو بطاقة CIB بكل أمان",
  },
  {
    icon: Clock,
    title: "حجز في 3 خطوات",
    description: "اختر، احجز، واستمتع - بدون تعقيدات",
  },
  {
    icon: MapPin,
    title: "58 ولاية مغطاة",
    description: "تغطية شاملة لكامل التراب الوطني الجزائري",
  },
  {
    icon: Shield,
    title: "ضمان أفضل سعر",
    description: "نضمن لك أفضل الأسعار مقارنة بأي منصة أخرى",
  },
  {
    icon: Star,
    title: "تقييمات حقيقية",
    description: "آراء موثوقة من مسافرين جزائريين حقيقيين",
  },
  {
    icon: Headphones,
    title: "دعم على مدار الساعة",
    description: "فريق دعم جزائري متاح 24/7 لمساعدتك",
  },
];

export function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            لماذا <span className="text-gradient-gold">Roomy؟</span>
          </h2>
          <p className="text-muted-foreground font-arabic max-w-xl mx-auto">
            منصة جزائرية 100% صُممت لتلبية احتياجات المسافر الجزائري
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 group cursor-pointer border border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-gradient-gold group-hover:text-primary-foreground transition-all">
                <feature.icon className="h-6 w-6 text-accent-foreground group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm font-arabic text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
