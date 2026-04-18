import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface PartnerProperty {
  id: string;
  name: string;
  type: string;
  wilaya: string;
  location: string;
  price: number;
  rating: number;
  reviews_count: number;
  image: string | null;
  images: string[];
  description: string | null;
  amenities: string[];
  rooms: number;
  max_guests: number;
  is_active: boolean;
  owner_id: string;
}

export interface PartnerBooking {
  id: string;
  property_id: string;
  user_id: string;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  service_fee: number;
  status: string;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  property?: { name: string; wilaya: string };
}

export function usePartnerProperties() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<PartnerProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user?.id) {
      setProperties([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading partner properties:", error);
      setProperties([]);
    } else {
      setProperties((data ?? []) as PartnerProperty[]);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { properties, loading, refetch };
}

export function usePartnerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<PartnerBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user?.id) {
      setBookings([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    // 1) جلب أيدي العقارات المملوكة للشريك
    const { data: props, error: propsErr } = await supabase
      .from("properties")
      .select("id")
      .eq("owner_id", user.id);

    if (propsErr) {
      console.error("Error loading owner properties:", propsErr);
      setBookings([]);
      setLoading(false);
      return;
    }

    const propIds = (props ?? []).map((p) => p.id);
    if (propIds.length === 0) {
      setBookings([]);
      setLoading(false);
      return;
    }

    // 2) جلب الحجوزات المرتبطة بهذه العقارات (RLS تسمح للمالك بقراءتها)
    const { data, error } = await supabase
      .from("bookings")
      .select("*, property:properties(name, wilaya)")
      .in("property_id", propIds)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading partner bookings:", error);
      setBookings([]);
    } else {
      setBookings((data ?? []) as PartnerBooking[]);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Realtime: refetch when bookings change (new bookings, status updates)
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`partner-bookings-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => { refetch(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, refetch]);

  return { bookings, loading, refetch };
}

export function useMyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<PartnerBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user?.id) {
      setBookings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*, property:properties(name, wilaya)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading my bookings:", error);
      setBookings([]);
    } else {
      setBookings((data ?? []) as PartnerBooking[]);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { bookings, loading, refetch };
}
