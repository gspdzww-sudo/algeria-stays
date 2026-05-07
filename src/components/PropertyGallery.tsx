import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Grid3x3, Expand } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface PropertyGalleryProps {
  images: string[];
  alt: string;
  badge?: string;
}

export function PropertyGallery({ images, alt, badge }: PropertyGalleryProps) {
  const safeImages = images.length > 0 ? images : ["/placeholder.svg"];
  const heroImg = safeImages[0];
  const sideImgs = safeImages.slice(1, 5);
  while (sideImgs.length < 4) sideImgs.push(safeImages[sideImgs.length % safeImages.length] ?? heroImg);

  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ direction: "rtl", loop: true, startIndex });
  const [selectedIdx, setSelectedIdx] = useState(0);

  const openAt = (i: number) => {
    setStartIndex(i);
    setSelectedIdx(i);
    setOpen(true);
  };

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(startIndex, true);
    const onSelect = () => setSelectedIdx(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, startIndex, open]);

  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") prev();
      if (e.key === "ArrowLeft") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, next, prev]);

  return (
    <>
      {/* Mobile: single image with overlay button */}
      <div className="md:hidden relative rounded-2xl overflow-hidden h-[280px] group">
        <img
          src={heroImg}
          alt={alt}
          onClick={() => openAt(0)}
          className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-arabic text-foreground shadow-soft">
            {badge}
          </span>
        )}
        <button
          onClick={() => openAt(0)}
          className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-card/95 backdrop-blur-sm text-foreground text-xs font-arabic shadow-soft"
        >
          <Grid3x3 className="h-3.5 w-3.5" />
          عرض الكل ({safeImages.length})
        </button>
      </div>

      {/* Desktop: 1 + 4 grid */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[480px] relative">
        <button
          onClick={() => openAt(0)}
          className="col-span-2 row-span-2 relative overflow-hidden group cursor-zoom-in"
        >
          <img
            src={heroImg}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
        </button>
        {sideImgs.map((src, i) => (
          <button
            key={i}
            onClick={() => openAt(i + 1)}
            className="relative overflow-hidden group cursor-zoom-in"
          >
            <img
              src={src}
              alt={`${alt} - ${i + 2}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
          </button>
        ))}

        {badge && (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-card/95 backdrop-blur-sm text-sm font-arabic text-foreground shadow-soft z-10">
            {badge}
          </span>
        )}
        <button
          onClick={() => openAt(0)}
          className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-card/95 backdrop-blur-sm text-foreground text-sm font-arabic shadow-elevated hover:bg-card transition-all hover:scale-105 z-10"
        >
          <Grid3x3 className="h-4 w-4" />
          عرض كل الصور ({safeImages.length})
        </button>
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-foreground/95 backdrop-blur-md animate-fade-in flex flex-col"
          dir="rtl"
          onClick={() => setOpen(false)}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between p-4 text-primary-foreground" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-full bg-card/10 hover:bg-card/20 flex items-center justify-center transition-all"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
            <span className="font-arabic text-sm">
              {selectedIdx + 1} / {safeImages.length}
            </span>
            <div className="w-10" />
          </div>

          {/* Embla */}
          <div className="flex-1 relative overflow-hidden" ref={emblaRef}>
            <div className="flex h-full">
              {safeImages.map((src, i) => (
                <div key={i} className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center px-4 md:px-12">
                  <img
                    src={src}
                    alt={`${alt} - ${i + 1}`}
                    onClick={(e) => e.stopPropagation()}
                    className="max-h-full max-w-full object-contain rounded-xl shadow-elevated animate-fade-in"
                  />
                </div>
              ))}
            </div>

            {/* Nav buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/15 hover:bg-card/30 backdrop-blur-sm flex items-center justify-center text-primary-foreground transition-all hover:scale-110"
              aria-label="السابق"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/15 hover:bg-card/30 backdrop-blur-sm flex items-center justify-center text-primary-foreground transition-all hover:scale-110"
              aria-label="التالي"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="px-4 pb-4 pt-2 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2 justify-center min-w-max mx-auto">
              {safeImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg overflow-hidden transition-all ${
                    i === selectedIdx
                      ? "ring-2 ring-primary scale-105"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}