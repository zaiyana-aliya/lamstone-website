import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Supabase Storage — matches *.supabase.co
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/blogs",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/fragrance",
        destination: "/perfumes",
        permanent: true,
      },
      {
        source: "/fragrances",
        destination: "/perfumes",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
