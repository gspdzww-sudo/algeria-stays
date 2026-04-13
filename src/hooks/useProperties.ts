import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mockProperties, type Property } from "@/data/properties";

export interface SupabaseProperty {
  id: string;
  name: string;
  location: string;
  wilaya: string;
  price: number;
  rating: number;
  reviews: number;
  type: string;
  image: string;
  images: string[];
  description: string;
  amenities: string[];
  rooms: number;
  guests: number;
}

function mapDbToProperty(row: any): SupabaseProperty {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    wilaya: row.wilaya,
    price: row.price,
    rating: Number(row.rating) || 0,
    reviews: row.reviews_count || 0,
    type: row.type,
    image: row.image || "",
    images: row.images || [],
    description: row.description || "",
    amenities: row.amenities || [],
    rooms: row.rooms || 1,
    guests: row.max_guests || 2,
  };
}

export function useProperties(wilaya?: string) {
  const [properties, setProperties] = useState<SupabaseProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      let query = supabase
        .from("properties")
        .select("*")
        .eq("is_active", true);

      if (wilaya) {
        query = query.eq("wilaya", wilaya);
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        // Fallback to mock data
        if (wilaya) {
          const filtered = mockProperties.filter((p) => p.wilaya === wilaya);
          setProperties(filtered.length > 0 ? filtered : mockProperties);
        } else {
          setProperties(mockProperties);
        }
      } else {
        setProperties(data.map(mapDbToProperty));
      }
      setLoading(false);
    };

    fetchProperties();
  }, [wilaya]);

  return { properties, loading };
}

export function useProperty(id: string | undefined) {
  const [property, setProperty] = useState<SupabaseProperty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        // Fallback to mock
        const mock = mockProperties.find((p) => p.id === id) || null;
        setProperty(mock);
      } else {
        setProperty(mapDbToProperty(data));
      }
      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  return { property, loading };
}
