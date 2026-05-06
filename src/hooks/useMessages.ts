import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ChatMessage {
  id: string;
  booking_id: string;
  sender_id: string;
  content: string | null;
  image_url: string | null;
  read_at: string | null;
  created_at: string;
}

export function useMessages(bookingId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!bookingId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true });
    if (!error && data) setMessages(data as ChatMessage[]);
    setLoading(false);
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId) {
      setMessages([]);
      return;
    }
    fetchMessages();
    const channel = supabase
      .channel(`messages-${bookingId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `booking_id=eq.${bookingId}` },
        (payload) => {
          setMessages((prev) => {
            const m = payload.new as ChatMessage;
            if (prev.some((x) => x.id === m.id)) return prev;
            return [...prev, m];
          });
        }
      )
      .subscribe();
    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [bookingId, fetchMessages]);

  const send = useCallback(
    async (content: string, imageUrl?: string | null) => {
      if (!bookingId || !user?.id) return { error: "empty" as const };
      const trimmed = content.trim();
      if (!trimmed && !imageUrl) return { error: "empty" as const };
      setSending(true);
      const { error } = await supabase.from("messages").insert({
        booking_id: bookingId,
        sender_id: user.id,
        content: trimmed || null,
        image_url: imageUrl ?? null,
      });
      setSending(false);
      return { error: error?.message ?? null };
    },
    [bookingId, user?.id]
  );

  return { messages, loading, sending, send, refetch: fetchMessages };
}
