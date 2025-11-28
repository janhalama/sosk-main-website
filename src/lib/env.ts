// Environment variable utilities
// Centralized configuration for site URL and other environment variables

/**
 * Gets the site URL from the ORIGIN environment variable.
 * Falls back to localhost:3000 in development if not set.
 * 
 * @throws Error in production if ORIGIN is not set
 */
export function getSiteUrl(): string {
  const origin = process.env.ORIGIN;
  
  // Use ORIGIN if available (may need protocol prefix)
  if (origin) {
    if (origin.startsWith("http://") || origin.startsWith("https://")) {
      return origin;
    }
    // Add protocol if missing
    return process.env.NODE_ENV === "production" ? `https://${origin}` : `http://${origin}`;
  }
  
  // Development fallback
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  
  // Production requires ORIGIN environment variable
  throw new Error(
    "ORIGIN environment variable is required in production. " +
    "Please set ORIGIN in your environment variables."
  );
}

