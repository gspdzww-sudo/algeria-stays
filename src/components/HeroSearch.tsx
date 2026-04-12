import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, Search, DollarSign } from "lucide-react";
import { wilayas, accommodationTypes } from "@/data/properties";

interface HeroSearchProps {
  variant?: "hero" | "compact";
  initialWilaya?: string;
}

export function HeroSearch({ variant = "hero", initialWilaya = "" }: HeroSearchProps) {
  const navigate = useNavigate();
  const [wilaya, setWilaya] = useState(initialWilaya);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState(30000);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (wilaya) params.set("wilaya", wilaya);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (type) params.set("type", type);
    if (maxPrice < 30000) params.set("maxPrice", maxPrice.toString());
    navigate(`/search?${params.toString()}`);
  };

  const isCompact = variant === "compact";

  return (
    <div className="w-full max-w-5xl mx-auto" dir="rtl">
      <div className={`bg-card/95 backdrop-blur-md rounded-2xl shadow-elevated ${isCompact ? "p-3" : "p-3 md:p-4"}`}>
        <div className={`grid grid-cols-1 ${isCompact ? "md:grid-cols-6" : "md:grid-cols-3 lg:grid-cols-6"} gap-3`}>
          {/* Wilaya */}
          <div className="relative">
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
          <div>
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
          <div>
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
          <div>
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

          {/* Price Range */}
          <div>
            <label className="text-xs font-arabic text-muted-foreground mb-1 block px-3">
              الميزانية: {maxPrice < 30000 ? `${maxPrice.toLocaleString()} دج` : "بدون حد"}
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50">
              <DollarSign className="h-4 w-4 text-primary shrink-0" />
              <input
                type="range"
                min={1000}
                max={30000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary h-2"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-gold text-primary-foreground font-arabic font-semibold py-3 px-6 rounded-xl shadow-gold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              <span>ابحث</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
