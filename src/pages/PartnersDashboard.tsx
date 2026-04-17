import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3, BedDouble, Calendar, DollarSign, Star, TrendingUp,
  Plus, Edit, Trash2, Menu, X, Home, Settings, LogOut, Users,
  CheckCircle, Clock, XCircle, Loader2, Image as ImageIcon
} from "lucide-react";
import { usePartnerBookings, usePartnerProperties, type PartnerProperty } from "@/hooks/usePartnerData";
import { PropertyFormModal } from "@/components/PropertyFormModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Tab = "overview" | "bookings" | "properties" | "settings";

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; className: string }> = {
  confirmed: { label: "مؤكد", icon: CheckCircle, className: "text-green-600 bg-green-50" },
  pending: { label: "قيد الانتظار", icon: Clock, className: "text-yellow-600 bg-yellow-50" },
  cancelled: { label: "ملغى", icon: XCircle, className: "text-red-600 bg-red-50" },
};

const PartnersDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerProperty | null>(null);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { properties, loading: propsLoading, refetch: refetchProps } = usePartnerProperties();
  const { bookings, loading: bookingsLoading, refetch: refetchBookings } = usePartnerBookings();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "confirmed");
    const totalRevenue = confirmed.reduce((s, b) => s + b.total_price, 0);
    const avgRating = properties.length
      ? (properties.reduce((s, p) => s + (Number(p.rating) || 0), 0) / properties.length).toFixed(1)
      : "0.0";
    return [
      { label: "إجمالي الإيرادات", value: `${totalRevenue.toLocaleString()} دج`, icon: DollarSign },
      { label: "الحجوزات المؤكدة", value: confirmed.length.toString(), icon: Calendar },
      { label: "التقييم المتوسط", value: avgRating, icon: Star },
      { label: "الإقامات النشطة", value: properties.filter((p) => p.is_active).length.toString(), icon: BedDouble },
    ];
  }, [bookings, properties]);

  const sidebarItems = [
    { id: "overview" as Tab, label: "نظرة عامة", icon: BarChart3 },
    { id: "bookings" as Tab, label: "الحجوزات", icon: Calendar },
    { id: "properties" as Tab, label: "إقاماتي", icon: BedDouble },
    { id: "settings" as Tab, label: "الإعدادات", icon: Settings },
  ];

  const handleDelete = async (p: PartnerProperty) => {
    if (!confirm(`حذف "${p.name}"؟ لا يمكن التراجع.`)) return;
    const { error } = await supabase.from("properties").delete().eq("id", p.id);
    if (error) {
      toast({ title: "خطأ في الحذف", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم الحذف" });
      refetchProps();
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم تحديث الحالة" });
      refetchBookings();
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex" dir="rtl">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "fixed inset-0 z-50" : "hidden"} md:static md:block md:w-64 shrink-0`}>
        {sidebarOpen && <div className="fixed inset-0 bg-foreground/30 md:hidden" onClick={() => setSidebarOpen(false)} />}
        <div className={`${sidebarOpen ? "fixed right-0 top-0 h-full z-50" : ""} w-64 bg-secondary text-secondary-foreground h-full flex flex-col`}>
          <div className="p-6 border-b border-secondary-foreground/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-heading font-bold text-gradient-gold">Roomy</Link>
              <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5 text-secondary-foreground" />
              </button>
            </div>
            <p className="text-xs font-arabic text-secondary-foreground/60 mt-1">لوحة تحكم الشركاء</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-arabic text-sm transition-all ${
                  activeTab === item.id ? "bg-primary/20 text-primary-foreground font-semibold" : "text-secondary-foreground/70 hover:bg-secondary-foreground/5"
                }`}>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-secondary-foreground/10">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-arabic text-sm font-semibold text-secondary-foreground truncate">{user?.email}</p>
                <p className="font-arabic text-xs text-secondary-foreground/60">شريك</p>
              </div>
            </div>
            <button onClick={handleSignOut} className="mt-2 w-full flex items-center gap-2 px-4 py-2 rounded-xl font-arabic text-sm text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary-foreground/5 transition-all">
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-foreground" />
            </button>
            <h1 className="text-xl font-heading font-bold text-foreground">
              {sidebarItems.find((i) => i.id === activeTab)?.label}
            </h1>
          </div>
          <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border font-arabic text-sm text-muted-foreground hover:text-foreground transition-all">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">الموقع الرئيسي</span>
          </Link>
        </header>

        <div className="p-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-card rounded-2xl p-5 shadow-soft border border-border/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-arabic text-sm text-muted-foreground">{stat.label}</span>
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                        <stat.icon className="h-5 w-5 text-accent-foreground" />
                      </div>
                    </div>
                    <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs font-arabic text-primary mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      تحديث مباشر
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-2xl shadow-soft border border-border/30">
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-foreground">آخر الحجوزات</h3>
                  <button onClick={() => setActiveTab("bookings")} className="text-sm font-arabic text-primary hover:underline">
                    عرض الكل
                  </button>
                </div>
                {bookingsLoading ? (
                  <div className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></div>
                ) : bookings.length === 0 ? (
                  <div className="p-10 text-center font-arabic text-sm text-muted-foreground">لا توجد حجوزات بعد</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-right px-5 py-3 font-arabic text-xs text-muted-foreground font-medium">الضيف</th>
                          <th className="text-right px-5 py-3 font-arabic text-xs text-muted-foreground font-medium">الإقامة</th>
                          <th className="text-right px-5 py-3 font-arabic text-xs text-muted-foreground font-medium">التاريخ</th>
                          <th className="text-right px-5 py-3 font-arabic text-xs text-muted-foreground font-medium">المبلغ</th>
                          <th className="text-right px-5 py-3 font-arabic text-xs text-muted-foreground font-medium">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map((booking) => {
                          const status = statusConfig[booking.status] ?? statusConfig.pending;
                          return (
                            <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/30">
                              <td className="px-5 py-3 font-arabic text-sm text-foreground">{booking.guest_name ?? "—"}</td>
                              <td className="px-5 py-3 font-arabic text-sm text-muted-foreground">{booking.property?.name}</td>
                              <td className="px-5 py-3 font-arabic text-sm text-muted-foreground" dir="ltr">{booking.check_in}</td>
                              <td className="px-5 py-3 font-arabic text-sm font-semibold text-foreground">{booking.total_price.toLocaleString()} دج</td>
                              <td className="px-5 py-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-arabic ${status.className}`}>
                                  <status.icon className="h-3 w-3" />
                                  {status.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bookings */}
          {activeTab === "bookings" && (
            <div className="bg-card rounded-2xl shadow-soft border border-border/30">
              <div className="p-5 border-b border-border">
                <h3 className="font-heading font-semibold text-foreground">جميع الحجوزات</h3>
              </div>
              {bookingsLoading ? (
                <div className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></div>
              ) : bookings.length === 0 ? (
                <div className="p-10 text-center font-arabic text-sm text-muted-foreground">لا توجد حجوزات بعد</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-right px-5 py-3 font-arabic text-xs text-muted-foreground font-medium">الضيف</th>
                        <th className="text-right px-5 py-3 font-arabic text-xs text-muted-foreground font-medium">الإقامة</th>
                        <th className="text-right px-5 py-3 font-arabic text-xs text-muted-foreground font-medium">الدخول</th>
                        <th className="text-right px-5 py-3 font-arabic text-xs text-muted-foreground font-medium">الخروج</th>
                        <th className="text-right px-5 py-3 font-arabic text-xs text-muted-foreground font-medium">المبلغ</th>
                        <th className="text-right px-5 py-3 font-arabic text-xs text-muted-foreground font-medium">الحالة</th>
                        <th className="text-right px-5 py-3 font-arabic text-xs text-muted-foreground font-medium">إجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => {
                        const status = statusConfig[booking.status] ?? statusConfig.pending;
                        return (
                          <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="px-5 py-3 font-arabic text-sm text-foreground">{booking.guest_name ?? "—"}</td>
                            <td className="px-5 py-3 font-arabic text-sm text-muted-foreground">{booking.property?.name}</td>
                            <td className="px-5 py-3 font-arabic text-sm text-muted-foreground" dir="ltr">{booking.check_in}</td>
                            <td className="px-5 py-3 font-arabic text-sm text-muted-foreground" dir="ltr">{booking.check_out}</td>
                            <td className="px-5 py-3 font-arabic text-sm font-semibold text-foreground">{booking.total_price.toLocaleString()} دج</td>
                            <td className="px-5 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-arabic ${status.className}`}>
                                <status.icon className="h-3 w-3" />
                                {status.label}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              {booking.status === "pending" && (
                                <div className="flex gap-1">
                                  <button onClick={() => handleUpdateBookingStatus(booking.id, "confirmed")} className="text-xs font-arabic px-2 py-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100">تأكيد</button>
                                  <button onClick={() => handleUpdateBookingStatus(booking.id, "cancelled")} className="text-xs font-arabic px-2 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">رفض</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Properties */}
          {activeTab === "properties" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground">إقاماتي</h3>
                <button onClick={() => { setEditing(null); setFormOpen(true); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-gold text-primary-foreground font-arabic text-sm shadow-gold hover:opacity-90 transition-all">
                  <Plus className="h-4 w-4" />
                  إضافة إقامة
                </button>
              </div>

              {propsLoading ? (
                <div className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></div>
              ) : properties.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border/30 p-10 text-center">
                  <BedDouble className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="font-arabic text-muted-foreground mb-4">لا توجد إقامات بعد. ابدأ بإضافة أول إقامة!</p>
                  <button onClick={() => { setEditing(null); setFormOpen(true); }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-gold text-primary-foreground font-arabic text-sm shadow-gold">
                    <Plus className="h-4 w-4" />
                    إضافة إقامة
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {properties.map((property) => (
                    <div key={property.id} className="bg-card rounded-2xl shadow-soft border border-border/30 p-4 flex items-start gap-4">
                      <div className="w-24 h-24 rounded-xl bg-muted shrink-0 overflow-hidden flex items-center justify-center">
                        {property.image ? (
                          <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-heading font-semibold text-foreground truncate">{property.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-arabic ${
                            property.is_active ? "bg-green-50 text-green-600" : "bg-muted text-muted-foreground"
                          }`}>
                            {property.is_active ? "نشط" : "غير نشط"}
                          </span>
                        </div>
                        <p className="font-arabic text-sm text-muted-foreground mb-2">{property.type} · {property.wilaya}</p>
                        <div className="flex items-center gap-3 font-arabic text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{property.price.toLocaleString()} دج</span>
                          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" />{Number(property.rating).toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button onClick={() => { setEditing(property); setFormOpen(true); }} className="p-2 rounded-lg hover:bg-muted transition-all" title="تعديل">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => handleDelete(property)} className="p-2 rounded-lg hover:bg-destructive/10 transition-all" title="حذف">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="max-w-2xl">
              <div className="bg-card rounded-2xl shadow-soft border border-border/30 p-6 space-y-4">
                <h3 className="font-heading font-semibold text-foreground mb-2">معلومات الحساب</h3>
                <div>
                  <label className="text-xs font-arabic text-muted-foreground mb-1 block">البريد الإلكتروني</label>
                  <input value={user?.email ?? ""} disabled dir="ltr"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none" />
                </div>
                <p className="font-arabic text-xs text-muted-foreground">لتعديل معلوماتك الشخصية، تواصل مع الإدارة.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <PropertyFormModal
        open={formOpen}
        property={editing}
        onClose={() => setFormOpen(false)}
        onSaved={refetchProps}
      />
    </div>
  );
};

export default PartnersDashboard;
