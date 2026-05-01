import { useEffect, useRef, useState } from "react";
import { X, Send, Loader2, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";

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
  const scrollRef = useRef<HTMLDivElement>(null);

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
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
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
