import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Building2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";

type AuthMode = "login" | "signup";
type UserRole = "user" | "partner";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [role, setRole] = useState<UserRole>("user");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    hotelName: "",
    wilaya: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "partner") {
      navigate("/partners/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-gradient-gold mb-2">Roomy</h1>
            <p className="font-arabic text-muted-foreground">
              {mode === "login" ? "مرحباً بعودتك!" : "أنشئ حسابك الآن"}
            </p>
          </div>

          {/* Role Selection (signup only) */}
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-arabic text-sm transition-all ${
                  role === "user"
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                <User className="h-5 w-5" />
                <span>مسافر</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("partner")}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-arabic text-sm transition-all ${
                  role === "partner"
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span>صاحب إقامة</span>
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-elevated p-6 border border-border/30 space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-arabic text-muted-foreground mb-1 block">الاسم</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    placeholder="محمد"
                  />
                </div>
                <div>
                  <label className="text-xs font-arabic text-muted-foreground mb-1 block">اللقب</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    placeholder="بن أحمد"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-arabic text-muted-foreground mb-1 block">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="text-xs font-arabic text-muted-foreground mb-1 block">رقم الهاتف</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0555 123 456"
                  dir="ltr"
                />
              </div>
            )}

            {mode === "signup" && role === "partner" && (
              <>
                <div>
                  <label className="text-xs font-arabic text-muted-foreground mb-1 block">اسم الفندق / الإقامة</label>
                  <input
                    type="text"
                    required
                    value={formData.hotelName}
                    onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    placeholder="فندق النخيل"
                  />
                </div>
                <div>
                  <label className="text-xs font-arabic text-muted-foreground mb-1 block">الولاية</label>
                  <input
                    type="text"
                    required
                    value={formData.wilaya}
                    onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    placeholder="الجزائر العاصمة"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-arabic text-muted-foreground mb-1 block">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring pl-10"
                  placeholder="••••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="text-left">
                <a href="#" className="text-xs font-arabic text-primary hover:underline">
                  نسيت كلمة المرور؟
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-gold text-primary-foreground font-arabic font-semibold py-3 rounded-xl shadow-gold hover:opacity-90 transition-all"
            >
              {mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center mt-6 font-arabic text-sm text-muted-foreground">
            {mode === "login" ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-primary font-semibold hover:underline"
            >
              {mode === "login" ? "أنشئ حساباً" : "سجّل الدخول"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
