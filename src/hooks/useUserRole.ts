import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUserRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      setRole(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    supabase
      .rpc("get_user_role", { _user_id: user.id })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Error fetching role:", error);
          setRole(null);
        } else {
          setRole((data as string) ?? null);
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id, authLoading]);

  return { role, loading };
}
