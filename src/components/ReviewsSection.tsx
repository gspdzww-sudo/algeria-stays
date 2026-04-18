import { Star, MessageSquare } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";

interface Props {
  propertyId: string;
  rating: number;
  reviewsCount: number;
}

export function ReviewsSection({ propertyId, rating, reviewsCount }: Props) {
  const { reviews, loading } = useReviews(propertyId);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          آراء النزلاء
        </h2>
        <div className="flex items-center gap-2 font-arabic text-sm">
          <Star className="h-4 w-4 fill-gold text-gold" />
          <span className="font-bold text-foreground">{rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({reviewsCount} تقييم)</span>
        </div>
      </div>

      {loading ? (
        <p className="font-arabic text-sm text-muted-foreground">جاري التحميل...</p>
      ) : reviews.length === 0 ? (
        <p className="font-arabic text-sm text-muted-foreground bg-muted/40 rounded-xl p-4 text-center">
          لا توجد تقييمات بعد. كن أول من يقيم بعد إقامتك!
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-card border border-border/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < r.rating ? "fill-gold text-gold" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-arabic text-muted-foreground" dir="ltr">
                  {new Date(r.created_at).toLocaleDateString("ar-DZ")}
                </span>
              </div>
              {r.comment && (
                <p className="font-arabic text-sm text-foreground leading-relaxed">{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
