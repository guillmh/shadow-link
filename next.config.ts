import type { NextConfig } from "next";

const defaultSupabaseHost = "clmgzeydrstlyfrxqyuc.supabase.co";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHost = defaultSupabaseHost;

if (supabaseUrl) {
  try {
    const { hostname } = new URL(supabaseUrl);
    if (hostname) {
      supabaseHost = hostname;
    }
  } catch {
    // If parsing fails, fall back to the default hostname
    supabaseHost = defaultSupabaseHost;
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
