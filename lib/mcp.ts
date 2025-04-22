import { z } from "zod";
import { initializeMcpApiHandler } from "./mcp-api-handler";
import {
  CallToolResult,
  GetPromptResult,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";

export const mcpHandler = initializeMcpApiHandler(
  (server) => {
    server.tool(
      "start-notification-stream",
      "Starts sending periodic notifications for testing resumability",
      {
        interval: z
          .number()
          .describe("Interval in milliseconds between notifications")
          .default(100),
        count: z
          .number()
          .describe("Number of notifications to send (0 for 100)")
          .default(10),
      },
      async (
        { interval, count },
        { sendNotification }
      ): Promise<CallToolResult> => {
        // In a stateless environment, we should not start long-running processes
        // Just return immediately with a message instead of actually running notifications
        return {
          content: [
            {
              type: "text",
              text: `In stateless mode, notifications are simulated. Would send ${
                count || "unlimited"
              } notifications every ${interval}ms if this were stateful.`,
            },
          ],
        };
      }
    );
    server.resource(
      "greeting-resource",
      "https://example.com/greetings/default",
      { mimeType: "text/plain" },
      async (): Promise<ReadResourceResult> => {
        return {
          contents: [
            {
              uri: "https://example.com/greetings/default",
              text: "Hello, world!",
            },
          ],
        };
      }
    );
    server.prompt(
      "greeting-template",
      "A simple greeting prompt template",
      {
        name: z.string().describe("Name to include in greeting"),
      },
      async ({ name }): Promise<GetPromptResult> => {
        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Please greet ${name} in a friendly manner.`,
              },
            },
          ],
        };
      }
    );
    server.tool("random-uuid", {}, async () => ({
      content: [{ type: "text", text: `Tool random-uuid: ${Math.random()}` }],
    }));
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
