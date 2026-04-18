import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, CheckCircle, Clock, XCircle, ArrowRight, Loader2, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useMyBookings } from "@/hooks/usePartnerData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReviewModal } from "@/components/ReviewModal";

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; className: string }> = {
  confirmed: { label: "مؤكد", icon: CheckCircle, className: "text-green-600 bg-green-50" },
  pending: { label: "قيد الانتظار", icon: Clock, className: "text-yellow-600 bg-yellow-50" },
  cancelled: { label: "ملغى", icon: XCircle, className: "text-red-600 bg-red-50" },
  rejected: { label: "مرفوض", icon: XCircle, className: "text-red-600 bg-red-50" },
  completed: { label: "مكتمل", icon: CheckCircle, className: "text-blue-600 bg-blue-50" },
};

const MyBookings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { bookings, loading, refetch } = useMyBookings();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reviewBooking, setReviewBooking] = useState<{ id: string; propertyId: string; name: string } | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  if (!authLoading && !user) {
    navigate("/auth");
    return null;
  }

  const handleCancel = async (id: string) => {
    if (!confirm("هل أنت متأكد من إلغاء هذا الحجز؟")) return;
    setCancellingId(id);
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    setCancellingId(null);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم الإلغاء", description: "تم إلغاء حجزك بنجاح" });
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-12 px-4 max-w-5xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">حجوزاتي</h1>
          <p className="font-arabic text-sm sm:text-base text-muted-foreground">جميع حجوزاتك في مكان واحد</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="font-arabic text-muted-foreground">جاري التحميل...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-card rounded-2xl border border-border/30 px-4">
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-10 w-10 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">لا توجد حجوزات بعد</h3>
            <p className="font-arabic text-muted-foreground mb-6">ابدأ باستكشاف الإقامات المتاحة</p>
            <Link to="/search" className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground font-arabic font-semibold py-3 px-6 rounded-xl shadow-gold">
              <span>تصفح الإقامات</span>
              <ArrowRight className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const status = statusConfig[booking.status] ?? statusConfig.pending;
              const canCancel = booking.status === "pending" || booking.status === "confirmed";
              const canReview = booking.status === "completed" && !reviewedIds.has(booking.id);
              return (
                <div key={booking.id} className="bg-card rounded-2xl shadow-soft border border-border/30 p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-heading font-semibold text-foreground truncate">
                          {booking.property?.name ?? "إقامة"}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-arabic ${status.className}`}>
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>
                      <p className="font-arabic text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {booking.property?.wilaya}
                      </p>
                    </div>
                    <Link to={`/property/${booking.property_id}`} className="text-xs font-arabic text-primary hover:underline shrink-0">
                      عرض الإقامة
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-xs font-arabic text-muted-foreground mb-0.5">الدخول</p>
                      <p className="font-arabic text-foreground" dir="ltr">{booking.check_in}</p>
                    </div>
                    <div>
                      <p className="text-xs font-arabic text-muted-foreground mb-0.5">الخروج</p>
                      <p className="font-arabic text-foreground" dir="ltr">{booking.check_out}</p>
                    </div>
                    <div>
                      <p className="text-xs font-arabic text-muted-foreground mb-0.5">الضيوف</p>
                      <p className="font-arabic text-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />{booking.guests}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-arabic text-muted-foreground mb-0.5">المبلغ</p>
                      <p className="font-arabic font-bold text-primary">{booking.total_price.toLocaleString()} دج</p>
                    </div>
                  </div>

                  {(canCancel || canReview) && (
                    <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-border">
                      {canReview && (
                        <button
                          onClick={() => setReviewBooking({
                            id: booking.id,
                            propertyId: booking.property_id,
                            name: booking.property?.name ?? "إقامة",
                          })}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-gold text-primary-foreground font-arabic text-sm shadow-gold hover:opacity-90"
                        >
                          <Star className="h-4 w-4" />
                          أضف تقييماً
                        </button>
                      )}
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-destructive/30 text-destructive font-arabic text-sm hover:bg-destructive/10 transition-all disabled:opacity-50"
                        >
                          {cancellingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                          إلغاء الحجز
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {reviewBooking && (
        <ReviewModal
          open={!!reviewBooking}
          bookingId={reviewBooking.id}
          propertyId={reviewBooking.propertyId}
          propertyName={reviewBooking.name}
          onClose={() => setReviewBooking(null)}
          onSaved={() => {
            setReviewedIds((s) => new Set(s).add(reviewBooking.id));
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default MyBookings;
