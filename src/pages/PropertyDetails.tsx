import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star, MapPin, Users, BedDouble, ChevronRight, ChevronLeft,
  Check, CreditCard, Shield, ArrowRight, AlertCircle, XCircle
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProperty } from "@/hooks/useProperties";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchBookedRanges, rangesOverlap } from "@/hooks/useReviews";
import { ReviewsSection } from "@/components/ReviewsSection";

type BookingStep = 1 | 2 | 3;
type PaymentStatus = "idle" | "processing" | "success" | "failed";

const paymentMethods = [
  { id: "edahabia", name: "بطاقة الذهبية", icon: "💳", desc: "Edahabia - بريد الجزائر" },
  { id: "baridimob", name: "BaridiMob", icon: "📱", desc: "الدفع عبر التطبيق" },
  { id: "cib", name: "بطاقة CIB", icon: "🏦", desc: "البطاقات البنكية" },
];

const todayStr = () => new Date().toISOString().split("T")[0];

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { property, loading } = useProperty(id);

  const [currentImage, setCurrentImage] = useState(0);
  const [bookingStep, setBookingStep] = useState<BookingStep | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [bookingComplete, setBookingComplete] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [forceFail, setForceFail] = useState(false);
  const [dateError, setDateError] = useState("");

  // Step 2 controlled fields
  const [guestFirstName, setGuestFirstName] = useState("");
  const [guestLastName, setGuestLastName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestNotes, setGuestNotes] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <Navbar />
        <div className="text-center pt-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="font-arabic text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <Navbar />
        <div className="text-center pt-20">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-4">الإقامة غير موجودة</h1>
          <button onClick={() => navigate("/")} className="text-primary font-arabic underline">
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  const nights =
    checkIn && checkOut
      ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
      : 1;
  const totalPrice = property.price * nights;
  const serviceFee = Math.round(totalPrice * 0.05);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % property.images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);

  const validateDates = async () => {
    if (!checkIn || !checkOut) {
      setDateError("يرجى اختيار تاريخ الدخول والخروج");
      return false;
    }
    const today = new Date(todayStr());
    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    if (ci < today) {
      setDateError("تاريخ الدخول لا يمكن أن يكون في الماضي");
      return false;
    }
    if (co <= ci) {
      setDateError("تاريخ الخروج يجب أن يكون بعد تاريخ الدخول");
      return false;
    }
    // Conflict check
    if (property) {
      const ranges = await fetchBookedRanges(property.id);
      const conflict = ranges.some((r) => rangesOverlap(checkIn, checkOut, r.check_in, r.check_out));
      if (conflict) {
        setDateError("هذه التواريخ محجوزة مسبقاً. يرجى اختيار تواريخ أخرى.");
        return false;
      }
    }
    setDateError("");
    return true;
  };

  const handleStartBooking = () => {
    if (!user) {
      toast({ title: "تسجيل الدخول مطلوب", description: "الرجاء تسجيل الدخول قبل الحجز" });
      navigate("/auth");
      return;
    }
    setBookingStep(1);
  };

  const resetBookingState = () => {
    setBookingStep(null);
    setBookingComplete(false);
    setPaymentStatus("idle");
    setForceFail(false);
  };

  const handleConfirmPayment = async () => {
    if (!user || !property) return;
    setPaymentStatus("processing");

    await new Promise((r) => setTimeout(r, 1500));

    if (forceFail) {
      setPaymentStatus("failed");
      toast({ title: "فشل الدفع", description: "حاول مرة أخرى أو استخدم وسيلة دفع أخرى", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      property_id: property.id,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      total_price: totalPrice + serviceFee,
      service_fee: serviceFee,
      status: "pending",
      payment_method: paymentMethod,
      guest_name: `${guestFirstName} ${guestLastName}`.trim(),
      guest_email: guestEmail,
      guest_phone: guestPhone,
      notes: guestNotes || null,
    });

    if (error) {
      console.error("Booking error:", error);
      setPaymentStatus("failed");
      toast({ title: "خطأ في الحجز", description: error.message, variant: "destructive" });
      return;
    }

    setPaymentStatus("success");
    setBookingComplete(true);
    toast({ title: "تم الحجز بنجاح!", description: "سيتم التواصل معك قريباً" });
  };

  const renderBookingModal = () => {
    if (!bookingStep) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
        <div className="bg-card rounded-2xl shadow-elevated w-full max-w-lg max-h-[90vh] overflow-auto" dir="rtl">
          {/* Progress Steps */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-bold text-foreground">
                {bookingComplete ? "تم الحجز!" : `خطوة ${bookingStep} من 3`}
              </h2>
              <button
                onClick={resetBookingState}
                className="text-muted-foreground hover:text-foreground text-xl"
              >
                ✕
              </button>
            </div>
            {!bookingComplete && (
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-arabic font-bold ${
                        step <= bookingStep
                          ? "bg-gradient-gold text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step < bookingStep ? <Check className="h-4 w-4" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`flex-1 h-1 rounded ${step < bookingStep ? "bg-primary" : "bg-muted"}`} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6">
            {bookingComplete ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">تم تأكيد حجزك!</h3>
                <p className="font-arabic text-muted-foreground mb-2">
                  {property.name} - {nights} {nights > 1 ? "ليالي" : "ليلة"}
                </p>
                <p className="font-arabic text-lg font-bold text-primary mb-6">
                  {(totalPrice + serviceFee).toLocaleString()} دج
                </p>
                <p className="font-arabic text-sm text-muted-foreground mb-6">
                  تم حفظ حجزك بنجاح. يمكنك متابعته من حسابك.
                </p>
                <button
                  onClick={resetBookingState}
                  className="bg-gradient-gold text-primary-foreground font-arabic font-semibold py-3 px-8 rounded-xl shadow-gold"
                >
                  حسناً
                </button>
              </div>
            ) : bookingStep === 1 ? (
              /* Step 1: Dates & Guests */
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg text-foreground">اختر تواريخ إقامتك</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-arabic text-muted-foreground mb-1 block">تاريخ الدخول</label>
                    <input
                      type="date"
                      value={checkIn}
                      min={todayStr()}
                      onChange={(e) => { setCheckIn(e.target.value); setDateError(""); }}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-arabic text-muted-foreground mb-1 block">تاريخ الخروج</label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || todayStr()}
                      onChange={(e) => { setCheckOut(e.target.value); setDateError(""); }}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                {dateError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="font-arabic text-sm">{dateError}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-arabic text-muted-foreground mb-1 block">عدد الضيوف</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none"
                  >
                    {Array.from({ length: property.guests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} {n > 1 ? "ضيوف" : "ضيف"}</option>
                    ))}
                  </select>
                </div>

                {/* Price Summary */}
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between font-arabic text-sm">
                    <span className="text-muted-foreground">{property.price.toLocaleString()} دج × {nights} {nights > 1 ? "ليالي" : "ليلة"}</span>
                    <span className="text-foreground">{totalPrice.toLocaleString()} دج</span>
                  </div>
                  <div className="flex justify-between font-arabic text-sm">
                    <span className="text-muted-foreground">رسوم الخدمة (5%)</span>
                    <span className="text-foreground">{serviceFee.toLocaleString()} دج</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-arabic font-bold">
                    <span>المجموع</span>
                    <span className="text-primary">{(totalPrice + serviceFee).toLocaleString()} دج</span>
                  </div>
                </div>

                <button
                  onClick={async () => { if (await validateDates()) setBookingStep(2); }}
                  className="w-full bg-gradient-gold text-primary-foreground font-arabic font-semibold py-3 rounded-xl shadow-gold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span>التالي: معلوماتك الشخصية</span>
                  <ArrowRight className="h-4 w-4 rotate-180" />
                </button>
              </div>
            ) : bookingStep === 2 ? (
              /* Step 2: Personal Info */
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg text-foreground">معلوماتك الشخصية</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-arabic text-muted-foreground mb-1 block">الاسم</label>
                    <input
                      type="text"
                      placeholder="محمد"
                      value={guestFirstName}
                      onChange={(e) => setGuestFirstName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-arabic text-muted-foreground mb-1 block">اللقب</label>
                    <input
                      type="text"
                      placeholder="بن أحمد"
                      value={guestLastName}
                      onChange={(e) => setGuestLastName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-arabic text-muted-foreground mb-1 block">البريد الإلكتروني</label>
                  <input
                    type="email"
                    placeholder="example@email.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-xs font-arabic text-muted-foreground mb-1 block">رقم الهاتف</label>
                  <input
                    type="tel"
                    placeholder="0555 123 456"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-xs font-arabic text-muted-foreground mb-1 block">ملاحظات (اختياري)</label>
                  <textarea
                    rows={2}
                    placeholder="أي طلبات خاصة..."
                    value={guestNotes}
                    onChange={(e) => setGuestNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="px-6 py-3 rounded-xl border border-border font-arabic text-sm hover:bg-muted transition-all"
                  >
                    رجوع
                  </button>
                  <button
                    onClick={() => {
                      if (!guestFirstName || !guestLastName || !guestEmail || !guestPhone) {
                        toast({ title: "حقول مطلوبة", description: "يرجى ملء جميع الحقول", variant: "destructive" });
                        return;
                      }
                      setBookingStep(3);
                    }}
                    className="flex-1 bg-gradient-gold text-primary-foreground font-arabic font-semibold py-3 rounded-xl shadow-gold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <span>التالي: الدفع</span>
                    <ArrowRight className="h-4 w-4 rotate-180" />
                  </button>
                </div>
              </div>
            ) : (
              /* Step 3: Payment */
              <div className="space-y-4">
                <h3 className="font-heading font-semibold text-lg text-foreground">اختر وسيلة الدفع</h3>

                {paymentStatus === "failed" && (
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 text-destructive">
                    <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-arabic font-semibold text-sm">فشلت عملية الدفع</p>
                      <p className="font-arabic text-xs opacity-80 mt-1">
                        تعذّر معالجة الدفع. يرجى المحاولة مرة أخرى أو اختيار وسيلة دفع أخرى.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-primary bg-accent"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => { setPaymentMethod(e.target.value); setPaymentStatus("idle"); }}
                        className="accent-primary"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-arabic font-semibold text-foreground">{method.name}</p>
                        <p className="text-xs font-arabic text-muted-foreground">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Mock gateway: simulate payment failure (testing/demo) */}
                <label className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forceFail}
                    onChange={(e) => setForceFail(e.target.checked)}
                    className="accent-primary"
                  />
                  <span className="font-arabic text-xs text-muted-foreground">
                    🧪 محاكاة فشل الدفع (وضع الاختبار)
                  </span>
                </label>

                <div className="bg-muted/50 rounded-xl p-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-xs font-arabic text-muted-foreground">
                    جميع المعاملات مشفرة ومؤمنة بالكامل. لن يتم مشاركة بياناتك البنكية.
                  </p>
                </div>

                <div className="bg-accent rounded-xl p-4 flex justify-between font-arabic font-bold text-lg">
                  <span>المبلغ الإجمالي</span>
                  <span className="text-primary">{(totalPrice + serviceFee).toLocaleString()} دج</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setBookingStep(2)}
                    disabled={paymentStatus === "processing"}
                    className="px-6 py-3 rounded-xl border border-border font-arabic text-sm hover:bg-muted transition-all disabled:opacity-50"
                  >
                    رجوع
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    disabled={!paymentMethod || paymentStatus === "processing"}
                    className="flex-1 bg-gradient-gold text-primary-foreground font-arabic font-semibold py-3 rounded-xl shadow-gold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {paymentStatus === "processing" ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                        <span>جاري المعالجة...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        <span>{paymentStatus === "failed" ? "إعادة المحاولة" : "تأكيد والدفع"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-[300px] md:h-[500px]">
          <img
            src={property.images[currentImage]}
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <button
              onClick={prevImage}
              className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-all"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={nextImage}
              className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-all"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
          </div>
          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {property.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentImage ? "bg-primary-foreground scale-125" : "bg-primary-foreground/50"
                }`}
              />
            ))}
          </div>
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-sm font-arabic text-foreground">
            {property.type}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">{property.name}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1 font-arabic text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {property.location}
                </span>
                <span className="flex items-center gap-1 font-arabic">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="font-semibold text-foreground">{property.rating}</span>
                  <span className="text-muted-foreground">({property.reviews} تقييم)</span>
                </span>
              </div>
            </div>

            <div className="flex gap-6 py-4 border-y border-border">
              <div className="flex items-center gap-2 font-arabic text-sm text-foreground">
                <BedDouble className="h-5 w-5 text-primary" />
                <span>{property.rooms} غرف</span>
              </div>
              <div className="flex items-center gap-2 font-arabic text-sm text-foreground">
                <Users className="h-5 w-5 text-primary" />
                <span>حتى {property.guests} ضيوف</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">وصف الإقامة</h2>
              <p className="font-arabic text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-3">المرافق والخدمات</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 font-arabic text-sm text-foreground"
                  >
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl shadow-elevated p-6 border border-border/30">
              <div className="mb-4">
                <span className="text-3xl font-heading font-bold text-primary">
                  {property.price.toLocaleString()}
                </span>
                <span className="font-arabic text-muted-foreground mr-1">دج / ليلة</span>
              </div>

              <div className="flex items-center gap-1 mb-6">
                <Star className="h-4 w-4 fill-gold text-gold" />
                <span className="font-arabic font-semibold text-sm text-foreground">{property.rating}</span>
                <span className="font-arabic text-xs text-muted-foreground">· {property.reviews} تقييم</span>
              </div>

              <button
                onClick={handleStartBooking}
                className="w-full bg-gradient-gold text-primary-foreground font-arabic font-bold py-4 rounded-xl shadow-gold hover:opacity-90 transition-all text-lg"
              >
                احجز الآن
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 font-arabic text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" /> دفع آمن
                </span>
                <span>|</span>
                <span>إلغاء مجاني</span>
              </div>

              {/* Payment methods */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="font-arabic text-xs text-muted-foreground mb-3 text-center">وسائل الدفع المتاحة</p>
                <div className="flex justify-center gap-3">
                  {paymentMethods.map((m) => (
                    <span
                      key={m.id}
                      className="px-3 py-1 rounded-full bg-muted text-xs font-arabic text-muted-foreground"
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderBookingModal()}
      <Footer />
    </div>
  );
};

export default PropertyDetails;
