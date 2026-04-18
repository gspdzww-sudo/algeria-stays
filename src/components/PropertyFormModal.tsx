import { useState, useEffect } from "react";
import { X, Upload, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { PartnerProperty } from "@/hooks/usePartnerData";
import { ALGERIA_WILAYAS } from "@/data/wilayas";

interface Props {
  open: boolean;
  property: PartnerProperty | null;
  onClose: () => void;
  onSaved: () => void;
}

const PROPERTY_TYPES = ["فندق", "شقة مفروشة", "شاليه", "فيلا", "بيت ضيافة", "إقامة سياحية"];
const COMMON_AMENITIES = ["واي فاي", "موقف سيارات", "مسبح", "إفطار", "تكييف", "مطبخ", "شرفة", "إطلالة بحرية"];

export function PropertyFormModal({ open, property, onClose, onSaved }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState(PROPERTY_TYPES[0]);
  const [wilaya, setWilaya] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [rooms, setRooms] = useState<number>(1);
  const [maxGuests, setMaxGuests] = useState<number>(2);
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (property) {
      setName(property.name);
      setType(property.type);
      setWilaya(property.wilaya);
      setLocation(property.location);
      setPrice(property.price);
      setRooms(property.rooms ?? 1);
      setMaxGuests(property.max_guests ?? 2);
      setDescription(property.description ?? "");
      setAmenities(property.amenities ?? []);
      setImages(property.images ?? (property.image ? [property.image] : []));
      setIsActive(property.is_active);
    } else {
      setName(""); setType(PROPERTY_TYPES[0]); setWilaya(""); setLocation("");
      setPrice(0); setRooms(1); setMaxGuests(2); setDescription("");
      setAmenities([]); setImages([]); setIsActive(true);
    }
  }, [property, open]);

  if (!open) return null;

  const handleUpload = async (files: FileList) => {
    if (!user?.id) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "حجم كبير", description: `${file.name} أكبر من 5MB`, variant: "destructive" });
        continue;
      }
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("property-images").upload(path, file);
      if (upErr) {
        toast({ title: "فشل الرفع", description: upErr.message, variant: "destructive" });
        continue;
      }
      const { data: { publicUrl } } = supabase.storage.from("property-images").getPublicUrl(path);
      newUrls.push(publicUrl);
    }
    setImages((prev) => [...prev, ...newUrls]);
    setUploading(false);
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url));

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const handleSave = async () => {
    if (!user?.id) return;
    if (!name || !wilaya || !location || price <= 0) {
      toast({ title: "حقول ناقصة", description: "يرجى ملء كل الحقول الأساسية", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      name, type, wilaya, location, price, rooms,
      max_guests: maxGuests, description, amenities,
      images, image: images[0] ?? null, is_active: isActive,
      owner_id: user.id,
    };

    const { error } = property
      ? await supabase.from("properties").update(payload).eq("id", property.id)
      : await supabase.from("properties").insert(payload);

    setSaving(false);
    if (error) {
      toast({ title: "خطأ في الحفظ", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: property ? "تم التحديث" : "تم الإضافة" });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-card rounded-2xl shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h2 className="text-xl font-heading font-bold text-foreground">
            {property ? "تعديل الإقامة" : "إضافة إقامة جديدة"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-arabic text-muted-foreground mb-1 block">اسم الإقامة *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-arabic text-muted-foreground mb-1 block">النوع *</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm outline-none">
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-arabic text-muted-foreground mb-1 block">الولاية *</label>
              <select value={wilaya} onChange={(e) => setWilaya(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="">اختر الولاية</option>
                {ALGERIA_WILAYAS.map((w) => (
                  <option key={w.code} value={w.name}>{w.code.toString().padStart(2, "0")} - {w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-arabic text-muted-foreground mb-1 block">العنوان *</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-arabic text-muted-foreground mb-1 block">السعر/ليلة (دج) *</label>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-arabic text-muted-foreground mb-1 block">عدد الغرف</label>
              <input type="number" min={1} value={rooms} onChange={(e) => setRooms(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-arabic text-muted-foreground mb-1 block">الحد الأقصى للضيوف</label>
              <input type="number" min={1} value={maxGuests} onChange={(e) => setMaxGuests(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 font-arabic text-sm text-foreground">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-primary" />
                نشط (مرئي للزوار)
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-arabic text-muted-foreground mb-1 block">الوصف</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-muted/50 font-arabic text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

          <div>
            <label className="text-xs font-arabic text-muted-foreground mb-2 block">المرافق</label>
            <div className="flex flex-wrap gap-2">
              {COMMON_AMENITIES.map((a) => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-arabic border transition-all ${
                    amenities.includes(a) ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"
                  }`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-arabic text-muted-foreground mb-2 block">صور الإقامة</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {images.map((url) => (
                <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-muted group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(url)} className="absolute top-1 left-1 p-1.5 rounded-lg bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <label className={`aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-all ${uploading ? "opacity-50" : ""}`}>
                {uploading ? <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
                <span className="text-xs font-arabic text-muted-foreground mt-1">رفع صور</span>
                <input type="file" accept="image/*" multiple disabled={uploading} className="hidden"
                  onChange={(e) => e.target.files && handleUpload(e.target.files)} />
              </label>
            </div>
            {images.length === 0 && (
              <p className="flex items-center gap-1 font-arabic text-xs text-muted-foreground">
                <ImageIcon className="h-3 w-3" />
                ارفع صورة واحدة على الأقل لجذب المزيد من الحجوزات
              </p>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-border flex gap-3 sticky bottom-0 bg-card">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-border font-arabic text-sm hover:bg-muted">
            إلغاء
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-1 bg-gradient-gold text-primary-foreground font-arabic font-semibold py-2.5 rounded-xl shadow-gold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {property ? "حفظ التعديلات" : "إضافة الإقامة"}
          </button>
        </div>
      </div>
    </div>
  );
}
