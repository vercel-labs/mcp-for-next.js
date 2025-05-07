import { createMcpHandler } from "@vercel/mcp-adapter";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { auth, currentUser } from "@clerk/nextjs/server";

// Wrapper function for MCP handler with auth
export const withMcpAuth = (handler: (req: Request) => Promise<Response>) => {
  return async (req: Request) => {
    const { userId } = await auth();
    if (!userId) {
      return new Response(null, { status: 401 });
    }
    // Fetch the full user object to get the email
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (email) {
      req.headers.set("x-user-email", email);
    }
    return handler(req);
  };
};
