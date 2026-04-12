import { useNavigate } from "react-router-dom";

interface WilayaRegion {
  name: string;
  x: number;
  y: number;
  properties: number;
}

const regions: WilayaRegion[] = [
  { name: "الجزائر", x: 250, y: 95, properties: 450 },
  { name: "وهران", x: 130, y: 105, properties: 320 },
  { name: "قسنطينة", x: 360, y: 110, properties: 210 },
  { name: "عنابة", x: 420, y: 95, properties: 180 },
  { name: "بجاية", x: 310, y: 100, properties: 180 },
  { name: "تلمسان", x: 80, y: 125, properties: 130 },
  { name: "سطيف", x: 330, y: 120, properties: 150 },
  { name: "باتنة", x: 360, y: 140, properties: 120 },
  { name: "تيزي وزو", x: 275, y: 95, properties: 140 },
  { name: "البليدة", x: 240, y: 108, properties: 110 },
  { name: "جيجل", x: 345, y: 95, properties: 90 },
  { name: "سكيكدة", x: 385, y: 95, properties: 85 },
  { name: "مستغانم", x: 155, y: 115, properties: 95 },
  { name: "تيبازة", x: 225, y: 100, properties: 100 },
  { name: "بومرداس", x: 265, y: 100, properties: 75 },
  { name: "غرداية", x: 240, y: 230, properties: 90 },
  { name: "تمنراست", x: 280, y: 420, properties: 45 },
  { name: "جانت", x: 400, y: 400, properties: 30 },
  { name: "بشار", x: 100, y: 220, properties: 50 },
  { name: "أدرار", x: 140, y: 320, properties: 35 },
  { name: "الجلفة", x: 260, y: 170, properties: 60 },
  { name: "المدية", x: 245, y: 130, properties: 55 },
  { name: "مسيلة", x: 300, y: 150, properties: 50 },
  { name: "الأغواط", x: 220, y: 190, properties: 40 },
  { name: "ورقلة", x: 330, y: 270, properties: 65 },
  { name: "الوادي", x: 370, y: 230, properties: 55 },
  { name: "بسكرة", x: 340, y: 180, properties: 70 },
  { name: "تيارت", x: 180, y: 140, properties: 45 },
  { name: "سعيدة", x: 140, y: 150, properties: 35 },
  { name: "النعامة", x: 100, y: 170, properties: 25 },
  { name: "البيض", x: 130, y: 190, properties: 20 },
  { name: "إليزي", x: 400, y: 340, properties: 25 },
  { name: "تندوف", x: 50, y: 280, properties: 15 },
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
            انقر على أي ولاية لاستكشاف الإقامات المتاحة فيها
          </p>
        </div>

        <div className="relative bg-card rounded-2xl shadow-soft border border-border/30 p-4 md:p-8 overflow-hidden">
          <svg
            viewBox="0 0 500 480"
            className="w-full max-w-3xl mx-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Algeria outline simplified */}
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
              x1="50" y1="200" x2="460" y2="200"
              stroke="hsl(var(--gold))"
              strokeWidth="0.5"
              strokeDasharray="8,4"
              className="opacity-30"
            />
            <text x="460" y="198" fontSize="8" fill="hsl(var(--muted-foreground))" textAnchor="end" className="font-arabic opacity-50">
              الصحراء الكبرى
            </text>

            {/* Wilaya dots */}
            {regions.map((region) => {
              const size = Math.min(Math.max(region.properties / 30, 4), 12);
              return (
                <g
                  key={region.name}
                  className="cursor-pointer group"
                  onClick={() => handleClick(region.name)}
                >
                  {/* Pulse animation */}
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={size + 4}
                    fill="hsl(var(--primary))"
                    className="opacity-0 group-hover:opacity-20 transition-opacity"
                  />
                  {/* Dot */}
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={size}
                    fill="hsl(var(--primary))"
                    className="opacity-70 group-hover:opacity-100 transition-all"
                    stroke="hsl(var(--card))"
                    strokeWidth="1.5"
                  />
                  {/* Tooltip on hover */}
                  <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <rect
                      x={region.x - 50}
                      y={region.y - 38}
                      width="100"
                      height="28"
                      rx="6"
                      fill="hsl(var(--secondary))"
                    />
                    <text
                      x={region.x}
                      y={region.y - 25}
                      textAnchor="middle"
                      fontSize="9"
                      fill="hsl(var(--secondary-foreground))"
                      className="font-arabic"
                      fontWeight="600"
                    >
                      {region.name}
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
          <div className="flex items-center justify-center gap-6 mt-6 font-arabic text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary opacity-70" />
              مدن ساحلية
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary opacity-70" />
              مدن داخلية
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-ocean opacity-50" />
              البحر المتوسط
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
