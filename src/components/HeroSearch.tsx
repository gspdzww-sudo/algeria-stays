import { useState } from "react";
import { MapPin, Calendar, Users, Search } from "lucide-react";

const wilayas = [
  "الجزائر", "وهران", "قسنطينة", "عنابة", "بجاية", "تلمسان", "سطيف", "باتنة",
  "تيزي وزو", "البليدة", "جيجل", "سكيكدة", "مستغانم", "تيبازة", "بومرداس",
  "غرداية", "تمنراست", "جانت", "بشار", "أدرار"
];

const accommodationTypes = ["فندق", "شقة مفروشة", "فيلا", "شاليه", "بيت ريفي"];

export function HeroSearch() {
  const [wilaya, setWilaya] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [type, setType] = useState("");

  return (
    <div className="w-full max-w-5xl mx-auto" dir="rtl">
      <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-elevated p-3 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Wilaya */}
          <div className="relative md:col-span-1">
            <label className="text-xs font-arabic text-muted-foreground mb-1 block px-3">الولاية</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="bg-transparent text-sm font-arabic w-full outline-none text-foreground"
              >
                <option value="">اختر الولاية</option>
                {wilayas.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Check-in */}
          <div className="md:col-span-1">
            <label className="text-xs font-arabic text-muted-foreground mb-1 block px-3">تاريخ الدخول</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent text-sm font-arabic w-full outline-none text-foreground"
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="md:col-span-1">
            <label className="text-xs font-arabic text-muted-foreground mb-1 block px-3">تاريخ الخروج</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent text-sm font-arabic w-full outline-none text-foreground"
              />
            </div>
          </div>

          {/* Type */}
          <div className="md:col-span-1">
            <label className="text-xs font-arabic text-muted-foreground mb-1 block px-3">نوع الإقامة</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50">
              <Users className="h-4 w-4 text-primary shrink-0" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="bg-transparent text-sm font-arabic w-full outline-none text-foreground"
              >
                <option value="">الكل</option>
                {accommodationTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-1 flex items-end">
            <button className="w-full bg-gradient-gold text-primary-foreground font-arabic font-semibold py-3 px-6 rounded-xl shadow-gold hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <Search className="h-4 w-4" />
              <span>ابحث</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
