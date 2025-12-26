import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type AdminMode = "mock" | "real";

export const useAdminMode = () => {
  const [mode, setMode] = useState<AdminMode>("mock");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMode();
  }, []);

  const fetchMode = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "admin_mode")
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No setting found, create default
          await supabase.from("settings").insert({
            key: "admin_mode",
            value: { mode: "mock" }
          });
          setMode("mock");
        } else {
          console.error("Error fetching admin mode:", error);
        }
      } else if (data?.value) {
        const value = data.value as { mode?: AdminMode };
        setMode(value.mode || "mock");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const switchToRealMode = async () => {
    setLoading(true);
    try {
      // Clear mock data from tables (except menu_items)
      await supabase.from("orders").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("customer_loyalty").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("coupons").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      
      // Update mode setting
      const { error } = await supabase
        .from("settings")
        .upsert({
          key: "admin_mode",
          value: { mode: "real" }
        }, { onConflict: "key" });

      if (error) throw error;

      setMode("real");
      toast.success("Switched to Real Mode! All mock data has been cleared.");
    } catch (err) {
      console.error("Error switching to real mode:", err);
      toast.error("Failed to switch modes");
    } finally {
      setLoading(false);
    }
  };

  const switchToMockMode = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("settings")
        .upsert({
          key: "admin_mode",
          value: { mode: "mock" }
        }, { onConflict: "key" });

      if (error) throw error;

      setMode("mock");
      toast.success("Switched to Mock Mode");
    } catch (err) {
      console.error("Error switching to mock mode:", err);
      toast.error("Failed to switch modes");
    } finally {
      setLoading(false);
    }
  };

  return {
    mode,
    loading,
    switchToRealMode,
    switchToMockMode,
    isRealMode: mode === "real"
  };
};
