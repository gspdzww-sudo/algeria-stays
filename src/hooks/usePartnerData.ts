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
    const { data, error } = await supabase
      .from("bookings")
      .select("*, property:properties!inner(name, wilaya, owner_id)")
      .eq("property.owner_id", user.id)
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
