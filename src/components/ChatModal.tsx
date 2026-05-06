import { useEffect, useRef, useState } from "react";
import { X, Send, Loader2, MessageCircle, ImagePlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatModalProps {
  open: boolean;
  bookingId: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export function ChatModal({ open, bookingId, title, subtitle, onClose }: ChatModalProps) {
  const { user } = useAuth();
  const { messages, loading, sending, send } = useMessages(open ? bookingId : null);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  if (!open) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    const res = await send(text);
    if (!res.error) setText("");
  };

  const handlePickImage = () => fileInputRef.current?.click();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user?.id) return;
    if (!file.type.startsWith("image/")) {
      toast.error("الملف يجب أن يكون صورة");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب ألا يتجاوز 5 ميغابايت");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${bookingId}/${user.id}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("chat-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (upErr) {
      setUploading(false);
      toast.error("فشل رفع الصورة");
      return;
    }
    const { data: signed } = await supabase.storage.from("chat-images").createSignedUrl(path, 60 * 60 * 24 * 365);
    const url = signed?.signedUrl ?? path;
    await send("", url);
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4" dir="rtl">
      <div className="bg-card w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-xl border border-border/30 flex flex-col h-[85vh] sm:h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-semibold text-foreground text-sm truncate">{title}</h3>
              {subtitle && <p className="font-arabic text-xs text-muted-foreground truncate">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0" aria-label="إغلاق">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="font-arabic text-sm text-muted-foreground">لا توجد رسائل بعد</p>
              <p className="font-arabic text-xs text-muted-foreground mt-1">ابدأ المحادثة بإرسال رسالة</p>
            </div>
          ) : (
            messages.map((m) => {
              const mine = m.sender_id === user?.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 font-arabic text-sm ${
                      mine
                        ? "bg-primary text-primary-foreground rounded-bl-sm"
                        : "bg-card border border-border text-foreground rounded-br-sm"
                    }`}
                  >
                    {m.image_url && (
                      <a href={m.image_url} target="_blank" rel="noopener noreferrer" className="block mb-1">
                        <img
                          src={m.image_url}
                          alt="مرفق"
                          loading="lazy"
                          className="rounded-lg max-h-64 w-auto object-cover"
                        />
                      </a>
                    )}
                    {m.content && <p className="whitespace-pre-wrap break-words">{m.content}</p>}
                    <p className={`text-[10px] mt-1 ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`} dir="ltr">
                      {new Date(m.created_at).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-border flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={handlePickImage}
            disabled={uploading || sending}
            className="p-2.5 rounded-xl border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-50"
            aria-label="إرفاق صورة"
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          </button>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب رسالة..."
            maxLength={2000}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background font-arabic text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="p-2.5 rounded-xl bg-gradient-gold text-primary-foreground shadow-gold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            aria-label="إرسال"
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
