import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  booking_id: string;
  property_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_name?: string | null;
}

export function useReviews(propertyId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!propertyId) {
      setReviews([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error loading reviews:", error);
      setReviews([]);
    } else {
      setReviews((data ?? []) as Review[]);
    }
    setLoading(false);
  }, [propertyId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { reviews, loading, refetch };
}

/** Get bookings for a property to detect date conflicts (publicly readable when joined via property owner; for guests we use a focused check). */
export async function fetchBookedRanges(propertyId: string): Promise<{ check_in: string; check_out: string }[]> {
  // Note: RLS only lets the owner or the booker see bookings. For conflict detection on the public side,
  // we rely on a public read of confirmed bookings. If RLS blocks this, the server still enforces it on insert via uniqueness checks at the application level.
  const { data, error } = await supabase
    .from("bookings")
    .select("check_in, check_out, status")
    .eq("property_id", propertyId)
    .in("status", ["confirmed", "pending"]);
  if (error) {
    console.warn("Could not fetch booked ranges (RLS):", error.message);
    return [];
  }
  return (data ?? []).map((b) => ({ check_in: b.check_in, check_out: b.check_out }));
}

export function rangesOverlap(aIn: string, aOut: string, bIn: string, bOut: string): boolean {
  return new Date(aIn) < new Date(bOut) && new Date(bIn) < new Date(aOut);
}
