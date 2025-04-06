import { z } from "zod";
import { initializeMcpApiHandler } from "../../lib/mcp-api-handler";
import { createServerResponseAdapter } from "@/lib/server-response-adapter";

export const maxDuration = 60;

export const mcpHandler = initializeMcpApiHandler(
  (server) => {
    // Add more tools, resources, and prompts here
    server.tool("echo", { message: z.string() }, async ({ message }) => ({
      content: [{ type: "text", text: `Tool echo: ${message}` }],
    }));
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
      },
    },
  }
);

export async function POST(req: Request) {
  return createServerResponseAdapter(req.signal, (res) => {
    mcpHandler(req, res);
  });
}
