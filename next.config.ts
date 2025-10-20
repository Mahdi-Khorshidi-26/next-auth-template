import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GITHUB_ID: process.env.AUTH_GITHUB_ID,
    GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};

export default nextConfig;
