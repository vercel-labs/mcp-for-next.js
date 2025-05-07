import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const metadata = {
    issuer: "http://localhost:3000",
    authorization_endpoint: "http://localhost:3000/authorize",
    token_endpoint: "http://localhost:3000/token",
    registration_endpoint: "http://localhost:3000/oauth/register",
    scopes_supported: ["read_write"],
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],
    token_endpoint_auth_methods_supported: ["client_secret_basic"],
    code_challenge_methods_supported: ["S256"],
    service_documentation:
      "https://docs.stripe.com/stripe-apps/api-authentication/oauth",
  };

  return new NextResponse(JSON.stringify(metadata), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
