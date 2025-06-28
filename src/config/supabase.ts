import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log("Supabase URL:", supabaseUrl ? "Set" : "Missing");
console.log("Supabase Key:", supabaseKey ? "Set" : "Missing");

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials. Please check your .env file");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// Test connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);
    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    }
    console.log("Supabase connection successful");
    return true;
  } catch (err) {
    console.error("Supabase connection failed:", err);
    return false;
  }
};
