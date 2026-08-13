import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin/auth pulls in jwks-rsa -> jose, which Turbopack's
  // serverless bundling can't require() (jose ships as an ESM build).
  // Forcing these to native Node require avoids the ERR_REQUIRE_ESM crash.
  serverExternalPackages: ["firebase-admin", "jwks-rsa", "jose"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
