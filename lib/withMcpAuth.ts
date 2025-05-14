import { createMcpHandler } from "@vercel/mcp-adapter";
import { cookies } from "next/headers";

import { auth } from "@/lib/auth";
// Wrapper function for MCP handler with auth
export const withMcpAuth = (handler: (req: Request) => Promise<Response>) => {
  return async (req: Request) => {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    const wwwAuthenticateValue =
      "Bearer resource_metadata=http://localhost:3000/.well-known/oauth-authorization-server";

    if (!session) {
      // Redirect to login page if no valid token or session
      return new Response(null, {
        status: 401,
        headers: {
          Location: "/api/auth/authorize",
          "WWW-Authenticate": wwwAuthenticateValue,
        },
      });
    }

    // If authenticated, proceed with the MCP handler
    return handler(req);
  };
};
