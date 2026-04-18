import { useState } from "react";
import { X, Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  open: boolean;
  bookingId: string;
  propertyId: string;
  propertyName: string;
  onClose: () => void;
  onSaved: () => void;
}

export function ReviewModal({ open, bookingId, propertyId, propertyName, onClose, onSaved }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    const { error } = await supabase.from("reviews").insert({
      booking_id: bookingId,
      property_id: propertyId,
      user_id: user.id,
      rating,
      comment: comment.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast({ title: "تعذر حفظ التقييم", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "شكراً لك!", description: "تم نشر تقييمك بنجاح" });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-card rounded-2xl shadow-elevated w-full max-w-md">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-heading font-bold text-foreground">قيّم إقامتك</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <p className="font-arabic text-sm text-muted-foreground">{propertyName}</p>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star className={`h-9 w-9 ${n <= (hover || rating) ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />
              </button>
            ))}
          </div>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="شاركنا تجربتك (اختياري)"
            className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
        <div className="p-5 border-t border-border flex gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border font-arabic text-sm hover:bg-muted">إلغاء</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-gradient-gold text-primary-foreground font-arabic font-semibold py-2.5 rounded-xl shadow-gold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            نشر التقييم
          </button>
        </div>
      </div>
    </div>
  );
}
