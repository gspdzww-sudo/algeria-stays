import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function InfoButton() {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110"
            aria-label="معلومات حول الموقع"
          >
            <Info size={24} />
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-80 font-arabic text-right" dir="rtl">
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-foreground">تنبيه هام</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              هذا الموقع هو مشروع تجريبي في إطار <strong>مذكرة تخرج سنة ثالثة ليسانس</strong> لدفعة التخرج <strong>2025 / 2026</strong>.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              كل ما تراه من بيانات وإقامات هو لأغراض العرض والاختبار فقط وليس حقيقياً.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
