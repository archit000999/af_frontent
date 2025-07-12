
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function UserProfileSync() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      const insertUser = async () => {
        const { id, emailAddresses, firstName, lastName, imageUrl } = user;

        // Use upsert to handle both new users and updates
        const { data, error } = await supabase
          .from("profiles")
          .upsert([
            {
              user_id: id, // Using clerk user ID
              email: emailAddresses[0]?.emailAddress,
              full_name: `${firstName || ''} ${lastName || ''}`.trim() || null,
              avatar_url: imageUrl || null,
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
  }, [isSignedIn, user]);

  return null; // This component doesn't render anything
}
