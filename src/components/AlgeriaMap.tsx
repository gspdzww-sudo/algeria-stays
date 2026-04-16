import { useNavigate } from "react-router-dom";

interface WilayaRegion {
  name: string;
  code: number;
  x: number;
  y: number;
  properties: number;
}

const regions: WilayaRegion[] = [
  // الشمال الساحلي (من الغرب إلى الشرق)
  { name: "تلمسان", code: 13, x: 80, y: 105, properties: 130 },
  { name: "عين تموشنت", code: 46, x: 100, y: 100, properties: 40 },
  { name: "وهران", code: 31, x: 125, y: 98, properties: 320 },
  { name: "مستغانم", code: 27, x: 155, y: 100, properties: 95 },
  { name: "غليزان", code: 48, x: 160, y: 112, properties: 35 },
  { name: "الشلف", code: 2, x: 190, y: 100, properties: 60 },
  { name: "تيبازة", code: 42, x: 225, y: 95, properties: 100 },
  { name: "الجزائر العاصمة", code: 16, x: 250, y: 92, properties: 450 },
  { name: "بومرداس", code: 35, x: 268, y: 94, properties: 75 },
  { name: "تيزي وزو", code: 15, x: 280, y: 96, properties: 140 },
  { name: "بجاية", code: 6, x: 310, y: 95, properties: 180 },
  { name: "جيجل", code: 18, x: 340, y: 93, properties: 90 },
  { name: "سكيكدة", code: 21, x: 370, y: 92, properties: 85 },
  { name: "عنابة", code: 23, x: 405, y: 90, properties: 180 },
  { name: "الطارف", code: 36, x: 425, y: 92, properties: 50 },

  // الشمال الداخلي
  { name: "النعامة", code: 45, x: 90, y: 130, properties: 25 },
  { name: "سعيدة", code: 20, x: 130, y: 128, properties: 35 },
  { name: "سيدي بلعباس", code: 22, x: 105, y: 115, properties: 50 },
  { name: "معسكر", code: 29, x: 145, y: 118, properties: 40 },
  { name: "تيارت", code: 14, x: 175, y: 128, properties: 45 },
  { name: "قصر الشلالة", code: 64, x: 175, y: 142, properties: 10 },
  { name: "تيسمسيلت", code: 38, x: 200, y: 120, properties: 30 },
  { name: "عين الدفلى", code: 44, x: 215, y: 108, properties: 35 },
  { name: "البليدة", code: 9, x: 240, y: 105, properties: 110 },
  { name: "المدية", code: 26, x: 245, y: 118, properties: 55 },
  { name: "قصر البخاري", code: 67, x: 245, y: 132, properties: 10 },
  { name: "عين وسارة", code: 65, x: 258, y: 140, properties: 10 },
  { name: "البويرة", code: 10, x: 265, y: 108, properties: 45 },
  { name: "برج بوعريريج", code: 34, x: 310, y: 115, properties: 40 },
  { name: "سطيف", code: 19, x: 330, y: 108, properties: 150 },
  { name: "ميلة", code: 43, x: 350, y: 105, properties: 30 },
  { name: "قسنطينة", code: 25, x: 370, y: 105, properties: 210 },
  { name: "قالمة", code: 24, x: 400, y: 100, properties: 40 },
  { name: "سوق أهراس", code: 41, x: 420, y: 100, properties: 35 },

  // الهضاب العليا والأوراس
  { name: "العريشة", code: 63, x: 90, y: 150, properties: 8 },
  { name: "البيض", code: 32, x: 120, y: 165, properties: 20 },
  { name: "الأبيض سيدي الشيخ", code: 69, x: 120, y: 180, properties: 8 },
  { name: "آفلو", code: 59, x: 195, y: 160, properties: 10 },
  { name: "الأغواط", code: 3, x: 215, y: 175, properties: 40 },
  { name: "مسعد", code: 66, x: 240, y: 165, properties: 8 },
  { name: "الجلفة", code: 17, x: 260, y: 158, properties: 60 },
  { name: "المسيلة", code: 28, x: 300, y: 140, properties: 50 },
  { name: "بوسعادة", code: 68, x: 290, y: 155, properties: 15 },
  { name: "بريكة", code: 60, x: 325, y: 140, properties: 10 },
  { name: "باتنة", code: 5, x: 350, y: 130, properties: 120 },
  { name: "أم البواقي", code: 4, x: 380, y: 118, properties: 35 },
  { name: "خنشلة", code: 40, x: 395, y: 128, properties: 30 },
  { name: "تبسة", code: 12, x: 420, y: 125, properties: 40 },
  { name: "بير العاتر", code: 62, x: 435, y: 138, properties: 8 },
  { name: "بسكرة", code: 7, x: 340, y: 160, properties: 70 },
  { name: "القنطرة", code: 61, x: 340, y: 150, properties: 8 },
  { name: "أولاد جلال", code: 51, x: 355, y: 170, properties: 15 },

  // الصحراء الشمالية
  { name: "بشار", code: 8, x: 95, y: 210, properties: 50 },
  { name: "بني عباس", code: 52, x: 110, y: 250, properties: 10 },
  { name: "غرداية", code: 47, x: 240, y: 215, properties: 90 },
  { name: "المنيعة", code: 58, x: 260, y: 240, properties: 15 },
  { name: "الوادي", code: 39, x: 370, y: 200, properties: 55 },
  { name: "المغير", code: 57, x: 355, y: 215, properties: 15 },
  { name: "تقرت", code: 55, x: 345, y: 230, properties: 20 },
  { name: "ورقلة", code: 30, x: 330, y: 255, properties: 65 },

  // الصحراء الوسطى والجنوبية
  { name: "تيميمون", code: 49, x: 170, y: 280, properties: 20 },
  { name: "أدرار", code: 1, x: 140, y: 320, properties: 35 },
  { name: "عين صالح", code: 53, x: 230, y: 310, properties: 15 },
  { name: "تندوف", code: 37, x: 50, y: 280, properties: 15 },
  { name: "إليزي", code: 33, x: 390, y: 340, properties: 25 },

  // أقصى الجنوب
  { name: "تمنراست", code: 11, x: 280, y: 400, properties: 45 },
  { name: "عين قزام", code: 54, x: 260, y: 440, properties: 8 },
  { name: "برج باجي مختار", code: 50, x: 180, y: 420, properties: 8 },
  { name: "جانت", code: 56, x: 400, y: 400, properties: 30 },
];

export function AlgeriaMap() {
  const navigate = useNavigate();

  const handleClick = (wilaya: string) => {
    navigate(`/search?wilaya=${encodeURIComponent(wilaya)}`);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            اكتشف الجزائر على <span className="text-gradient-gold">الخريطة</span>
          </h2>
          <p className="text-muted-foreground font-arabic max-w-xl mx-auto">
            انقر على أي ولاية لاستكشاف الإقامات المتاحة فيها — جميع الولايات الـ69
          </p>
        </div>

        <div className="relative bg-card rounded-2xl shadow-soft border border-border/30 p-4 md:p-8 overflow-hidden">
          <svg
            viewBox="0 0 500 480"
            className="w-full max-w-3xl mx-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Algeria outline */}
            <path
              d="M 60,90 L 120,80 180,78 220,82 260,80 300,78 340,80 380,78 420,82 460,90 
                 460,110 450,130 440,160 430,200 420,250 430,300 440,350 440,400 430,440 400,460 
                 350,470 300,475 250,470 200,460 150,440 120,400 100,350 80,300 60,250 50,200 
                 55,150 58,120 Z"
              fill="hsl(var(--sand))"
              stroke="hsl(var(--sand-dark))"
              strokeWidth="1.5"
              className="opacity-60"
            />
            {/* Northern coastal line */}
            <path
              d="M 60,90 L 120,80 180,78 220,82 260,80 300,78 340,80 380,78 420,82 460,90"
              fill="none"
              stroke="hsl(var(--ocean))"
              strokeWidth="3"
              className="opacity-50"
            />
            {/* Sahara line */}
            <line
              x1="50" y1="195" x2="460" y2="195"
              stroke="hsl(var(--gold))"
              strokeWidth="0.5"
              strokeDasharray="8,4"
              className="opacity-30"
            />
            <text x="460" y="193" fontSize="8" fill="hsl(var(--muted-foreground))" textAnchor="end" className="font-arabic opacity-50">
              الصحراء الكبرى
            </text>

            {/* Wilaya dots */}
            {regions.map((region) => {
              const size = Math.min(Math.max(region.properties / 40, 3), 10);
              return (
                <g
                  key={region.code}
                  className="cursor-pointer group"
                  onClick={() => handleClick(region.name)}
                >
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={size + 4}
                    fill="hsl(var(--primary))"
                    className="opacity-0 group-hover:opacity-20 transition-opacity"
                  />
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={size}
                    fill="hsl(var(--primary))"
                    className="opacity-70 group-hover:opacity-100 transition-all"
                    stroke="hsl(var(--card))"
                    strokeWidth="1"
                  />
                  <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <rect
                      x={region.x - 55}
                      y={region.y - 40}
                      width="110"
                      height="30"
                      rx="6"
                      fill="hsl(var(--secondary))"
                    />
                    <text
                      x={region.x}
                      y={region.y - 26}
                      textAnchor="middle"
                      fontSize="8"
                      fill="hsl(var(--secondary-foreground))"
                      className="font-arabic"
                      fontWeight="600"
                    >
                      ({String(region.code).padStart(2, "0")}) {region.name}
                    </text>
                    <text
                      x={region.x}
                      y={region.y - 15}
                      textAnchor="middle"
                      fontSize="7"
                      fill="hsl(var(--secondary-foreground))"
                      className="font-arabic opacity-70"
                    >
                      {region.properties} إقامة
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 font-arabic text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary opacity-70" />
              مدن كبرى
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary opacity-70" />
              ولايات ومقاطعات
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-ocean opacity-50" />
              البحر المتوسط
            </span>
            <span className="font-bold text-primary">69 ولاية</span>
          </div>
        </div>
      </div>
    </section>
  );
}
