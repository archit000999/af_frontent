
import { useSupabaseAuth } from "./SupabaseAuthProvider";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function UserProfileSync() {
  const { user } = useSupabaseAuth();

  useEffect(() => {
    if (user) {
      const insertUser = async () => {
        const { id, email, user_metadata } = user;

        // Use upsert to handle both new users and updates
        const { data, error } = await supabase
          .from("profiles")
          .upsert([
            {
              user_id: id, // Using Supabase user ID
              email: email,
              full_name: user_metadata?.full_name || user_metadata?.name || null,
              avatar_url: user_metadata?.avatar_url || user_metadata?.picture || null,
            }
          ], {
            onConflict: 'user_id'
          });

        if (error) {
          console.error("Supabase profile sync error:", error);
        } else {
          console.log("User profile synced successfully");
        }
      };

      insertUser();
    }
  }, [user]);

  return null; // This component doesn't render anything
}
