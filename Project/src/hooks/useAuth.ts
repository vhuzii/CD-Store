import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";

export interface AuthProfile {
  id: string;
  name: string;
  avatarUrl?: string;
}

async function fetchProfile(user: SupabaseUser): Promise<AuthProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("user_id", user.id)
    .single();

  if (error) {
    toast.error("Не вдалося завантажити профіль");
  }

  return {
    id: user.id,
    name: data?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || "Користувач",
    avatarUrl: data?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture,
  };
}

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const setCurrentUser = useAppStore(s => s.setCurrentUser);

  useEffect(() => {
    mountedRef.current = true;

    const syncProfile = (p: AuthProfile | null) => {
      setProfile(p);
      if (p) {
        setCurrentUser({ id: p.id, name: p.name, avatarUrl: p.avatarUrl, joinedAt: new Date().toISOString().split('T')[0] });
      } else {
        setCurrentUser(null);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;
        if (!mountedRef.current) return;
        setUser(u);

        if (u) {
          const p = await fetchProfile(u);
          if (mountedRef.current) {
            syncProfile(p);
            setLoading(false);
          }
        } else {
          syncProfile(null);
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      if (!mountedRef.current) return;
      setUser(u);

      if (u) {
        const p = await fetchProfile(u);
        if (mountedRef.current) {
          syncProfile(p);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [setCurrentUser]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setCurrentUser(null);
  };

  return { user, profile, loading, signOut };
}
