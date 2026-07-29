import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

// StreamableHttp server
const handler = createMcpHandler(
  async (server) => {
    server.registerTool(
      "echo",
      {
        title: "Echo",
        description: "Echo a message",
        inputSchema: z
          .object({
            message: z
              .string()
              .min(1)
              .max(100)
              .describe("Message to echo back"),
          })
          .strict(),
        outputSchema: z
          .object({
            message: z.string().describe("Echoed message"),
          })
          .strict(),
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async ({ message }) => ({
        content: [{ type: "text", text: `Tool echo: ${message}` }],
        structuredContent: { message },
      })
    );
  },
  {},
  {
    basePath: "",
    verboseLogs: true,
  }
);

export { handler as GET, handler as POST };
