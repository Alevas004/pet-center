import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"], // Para Cloudinary
  },
  // External packages para mejor performance
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
