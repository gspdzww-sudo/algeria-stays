import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-3xl font-heading font-bold text-gradient-gold mb-4">Roomy</h3>
            <p className="text-sm font-arabic text-secondary-foreground/70 leading-relaxed mb-6">
              منصة جزائرية 100% لحجز الفنادق والشقق السياحية عبر كامل الولايات الـ 58
            </p>
            <div className="flex gap-4">
              {["فيسبوك", "انستغرام", "تويتر"].map(s => (
                <span key={s} className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center text-xs font-arabic hover:bg-primary/20 transition-colors cursor-pointer">
                  {s[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-2 font-arabic text-sm text-secondary-foreground/70">
              {["من نحن", "كيف يعمل Roomy", "الأسئلة الشائعة", "سياسة الخصوصية", "الشروط والأحكام"].map(l => (
                <li key={l}><a href="#" className="hover:text-primary transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">للشركاء</h4>
            <ul className="space-y-2 font-arabic text-sm text-secondary-foreground/70">
              {["سجّل فندقك", "لوحة التحكم", "الباقات والأسعار", "مركز المساعدة"].map(l => (
                <li key={l}><a href="#" className="hover:text-primary transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">تواصل معنا</h4>
            <div className="space-y-3 font-arabic text-sm text-secondary-foreground/70">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span dir="ltr">+213 555 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@roomy.dz</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>الجزائر العاصمة، الجزائر</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-secondary-foreground/10 text-center font-arabic text-xs text-secondary-foreground/50">
          <p>© 2026 Roomy. جميع الحقوق محفوظة. صُنع بـ ❤️ في الجزائر</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <span className="px-3 py-1 rounded-full bg-secondary-foreground/10 text-xs">الذهبية Edahabia</span>
            <span className="px-3 py-1 rounded-full bg-secondary-foreground/10 text-xs">BaridiMob</span>
            <span className="px-3 py-1 rounded-full bg-secondary-foreground/10 text-xs">CIB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
