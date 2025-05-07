import { createMcpHandler } from "@vercel/mcp-adapter";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Wrapper function for MCP handler with auth
export const withMcpAuth = (handler: (req: Request) => Promise<Response>) => {
  return async (req: Request) => {
    const authHeader = req.headers.get("authorization");
    const cookieStore = await cookies();
    const authSession = cookieStore.get("auth_session");

    let email: string | undefined;

    // Check for bearer token
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const secret = new TextEncoder().encode(
          process.env.JWT_SECRET || "your-secret-key"
        );
        const { payload } = await jwtVerify(token, secret);
        email = payload.email as string;
      } catch (error) {
        // Token verification failed, try session cookie
        email = authSession?.value;
      }
    } else {
      // No bearer token, try session cookie
      email = authSession?.value;
    }

    if (!email) {
      // Redirect to login page if no valid token or session
      return new Response(null, {
        status: 401,
        headers: {
          Location: "/authorize/login",
        },
      });
    }

    // Add email to request headers
    req.headers.set("x-user-email", email);

    // If authenticated, proceed with the MCP handler
    return handler(req);
  };
};
