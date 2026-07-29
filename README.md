# Example Next.js MCP Server

This template uses [`mcp-handler` 2](https://www.npmjs.com/package/mcp-handler) and the MCP TypeScript SDK v2 to add a stateless MCP server to a Next.js App Router application.

## Usage

Update `app/mcp/route.ts` with your tools, prompts, and resources following the [MCP TypeScript SDK v2 documentation](https://ts.sdk.modelcontextprotocol.io/v2/).

Start the application and connect an MCP client to:

```
http://localhost:3000/mcp
```

## Protocol support

- The current 2026-07-28 MCP protocol is served natively.
- Stateless clients using 2025-era Streamable HTTP are supported by the compatibility layer.
- The deprecated HTTP+SSE transport is not supported. Redis is not required.

## Notes for running on Vercel

- Requires Node.js 20 or later
- Make sure you have [Fluid compute](https://vercel.com/docs/functions/fluid-compute) enabled for efficient execution
- [Deploy the Next.js MCP template](https://vercel.com/templates/next.js/model-context-protocol-mcp-with-next-js)

## Sample Client

`scripts/test-client.mjs` connects over Streamable HTTP, lists the available tools, and calls `echo`.

```sh
pnpm test:client -- https://mcp-for-next-js.vercel.app
```
