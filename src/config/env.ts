// Environment configuration and validation
export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(",") ?? ["*"],
} as const;

// Validate required environment variables
export const validateEnv = () => {
  const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "JWT_SECRET"];
  const missing = required.filter((key) => !env[key as keyof typeof env]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:", missing);
    console.error("Please set these variables in your Vercel project settings");
    return false;
  }

  console.log("✅ All required environment variables are set");
  return true;
};

// Check if running in production
export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
