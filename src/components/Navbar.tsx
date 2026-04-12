import { useState } from "react";
import { Menu, X, User } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/30" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-heading font-bold text-gradient-gold">Roomy</span>
            <span className="text-xs font-arabic text-muted-foreground hidden sm:block">الجزائر</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-arabic text-sm">
            <a href="#" className="text-foreground hover:text-primary transition-colors">الرئيسية</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">الوجهات</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">العروض</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">الشركاء</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">تواصل معنا</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-gold text-primary-foreground font-arabic text-sm shadow-gold hover:opacity-90 transition-all">
              <User className="h-4 w-4" />
              <span>تسجيل الدخول</span>
            </button>
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border/30 animate-fade-in">
          <div className="px-4 py-4 space-y-3 font-arabic text-sm">
            <a href="#" className="block py-2 text-foreground">الرئيسية</a>
            <a href="#" className="block py-2 text-muted-foreground">الوجهات</a>
            <a href="#" className="block py-2 text-muted-foreground">العروض</a>
            <a href="#" className="block py-2 text-muted-foreground">الشركاء</a>
            <a href="#" className="block py-2 text-muted-foreground">تواصل معنا</a>
            <button className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-gold text-primary-foreground font-arabic text-sm">
              <User className="h-4 w-4" />
              <span>تسجيل الدخول</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
