import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";

const origin =
  process.argv.slice(2).find((argument) => argument !== "--") ||
  "https://mcp-for-next-js.vercel.app";

async function main() {
  const client = new Client({
    name: "mcp-for-next-js-example-client",
    version: "1.0.0",
  });
  const endpoint = new URL("/mcp", `${origin}/`);
  const transport = new StreamableHTTPClientTransport(endpoint);

  console.log("Connecting to", endpoint.toString());
  await client.connect(transport);

  console.log("Connected", client.getServerCapabilities());

  const { tools } = await client.listTools();
  console.log("Tools", tools);

  const result = await client.callTool({
    name: "echo",
    arguments: { message: "Hello from the MCP client" },
  });
  console.log("Result", result);

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
