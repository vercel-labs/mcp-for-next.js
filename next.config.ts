import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/sse",
      destination: "/api/mcp",
    },
    {
      source: "/message",
      destination: "/api/mcp",
    },
  ],
};

export default nextConfig;
