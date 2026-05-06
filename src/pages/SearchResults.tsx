import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Star, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSearch } from "@/components/HeroSearch";
import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { accommodationTypes } from "@/data/properties";

type SortOption = "price-asc" | "price-desc" | "rating" | "reviews";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("rating");

  const [filterType, setFilterType] = useState(searchParams.get("type") || "");
  const [filterMaxPrice, setFilterMaxPrice] = useState(
    Number(searchParams.get("maxPrice")) || 30000
  );
  const [filterMinRating, setFilterMinRating] = useState(0);

  const wilaya = searchParams.get("wilaya") || "";
  const { properties: allProperties, loading } = useProperties();

  const filteredProperties = useMemo(() => {
    let results = [...allProperties];

    if (wilaya) {
      const wilayaResults = results.filter((p) => p.wilaya === wilaya);
      if (wilayaResults.length > 0) {
        results = wilayaResults;
      }
    }
    if (filterType) {
      results = results.filter((p) => p.type === filterType);
    }
    if (filterMaxPrice < 30000) {
      results = results.filter((p) => p.price <= filterMaxPrice);
    }
    if (filterMinRating > 0) {
      results = results.filter((p) => p.rating >= filterMinRating);
    }

    switch (sortBy) {
      case "price-asc":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        results.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return results;
  }, [allProperties, wilaya, filterType, filterMaxPrice, filterMinRating, sortBy]);

  const noWilayaResults = wilaya && allProperties.filter(p => p.wilaya === wilaya).length === 0;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="pt-20 pb-6 bg-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <HeroSearch variant="compact" initialWilaya={wilaya} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              {wilaya ? `إقامات في ${wilaya}` : "جميع الإقامات"}
            </h1>
            <p className="text-sm font-arabic text-muted-foreground mt-1">
              {loading
                ? "جاري البحث..."
                : noWilayaResults
                ? `لا توجد إقامات بعد في ${wilaya} — إليك اقتراحات من مناطق أخرى (${filteredProperties.length})`
                : `${filteredProperties.length} نتيجة`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-border font-arabic text-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              فلاتر
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-sm font-arabic outline-none text-foreground"
              >
                <option value="rating">الأعلى تقييماً</option>
                <option value="price-asc">السعر: الأقل أولاً</option>
                <option value="price-desc">السعر: الأعلى أولاً</option>
                <option value="reviews">الأكثر تقييمات</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${
              showFilters ? "fixed inset-0 z-50 bg-card p-6 overflow-auto" : "hidden"
            } md:block md:static md:w-64 shrink-0`}
          >
            <div className="flex items-center justify-between mb-6 md:hidden">
              <h3 className="font-heading font-bold text-lg">الفلاتر</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-arabic font-semibold text-foreground mb-3">نوع الإقامة</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" checked={filterType === ""} onChange={() => setFilterType("")} className="accent-primary" />
                    <span className="text-sm font-arabic text-foreground">الكل</span>
                  </label>
                  {accommodationTypes.map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="type" checked={filterType === t} onChange={() => setFilterType(t)} className="accent-primary" />
                      <span className="text-sm font-arabic text-foreground">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-arabic font-semibold text-foreground mb-3">الميزانية القصوى</h4>
                <input type="range" min={1000} max={30000} step={500} value={filterMaxPrice} onChange={(e) => setFilterMaxPrice(Number(e.target.value))} className="w-full accent-primary" />
                <div className="flex justify-between text-xs font-arabic text-muted-foreground mt-1">
                  <span>1,000 دج</span>
                  <span className="font-semibold text-primary">
                    {filterMaxPrice < 30000 ? `${filterMaxPrice.toLocaleString()} دج` : "بدون حد"}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-arabic font-semibold text-foreground mb-3">التقييم الأدنى</h4>
                <div className="space-y-2">
                  {[0, 4, 4.5, 4.8].map((r) => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="rating" checked={filterMinRating === r} onChange={() => setFilterMinRating(r)} className="accent-primary" />
                      <span className="text-sm font-arabic text-foreground flex items-center gap-1">
                        {r === 0 ? "الكل" : (<><Star className="h-3 w-3 fill-gold text-gold" />{r}+</>)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="md:hidden w-full mt-6 bg-gradient-gold text-primary-foreground font-arabic font-semibold py-3 rounded-xl"
            >
              تطبيق الفلاتر ({filteredProperties.length} نتيجة)
            </button>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border/30 animate-pulse">
                    <div className="h-48 bg-muted" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-arabic text-muted-foreground">لا توجد نتائج مطابقة لبحثك</p>
                <p className="text-sm font-arabic text-muted-foreground mt-2">جرّب تغيير الفلاتر أو البحث في ولاية أخرى</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    name={property.name}
                    location={property.location}
                    price={property.price}
                    rating={property.rating}
                    reviews={property.reviews}
                    type={property.type}
                    image={property.image}
                    images={property.images}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
