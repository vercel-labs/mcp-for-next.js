import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
import { withMcpAuth } from "@/lib/auth";

const createHandler = (req: Request) => {
  console.log("auth", req.headers.get("x-user-email"));

  return createMcpHandler(
    (server) => {
      server.tool(
        "echo",
        "Echo a message",
        { message: z.string() },
        async ({ message }) => {
          return {
            content: [
              {
                type: "text",
                text: `Tool echo: ${message}`,
              },
            ],
          };
        }
      );
    },
    {
      capabilities: {
        tools: {
          echo: {
            description: "Echo a message",
          },
        },
      },
    },
    {
      redisUrl: process.env.REDIS_URL,
      sseEndpoint: "/sse",
      streamableHttpEndpoint: "/mcp",
      verboseLogs: false,
      maxDuration: 60,
    }
  )(req);
};

// Create and wrap the handler with auth
const handler = withMcpAuth(createHandler);

export { handler as GET, handler as POST, handler as DELETE };
