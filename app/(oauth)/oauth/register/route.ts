import { NextResponse } from "next/server";
import { SignJWT } from "jose";

interface OAuthClient {
  client_id: string;
  client_secret: string;
  client_name: string;
  redirect_uris: string[];
  grant_types: string[];
  response_types: string[];
  token_endpoint_auth_method: string;
  created_at: number;
}

// In a real application, you would store this in a database
const clients = new Map<string, OAuthClient>();

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Required registration parameters
    const {
      client_name,
      redirect_uris,
      grant_types,
      response_types,
      token_endpoint_auth_method,
    } = body;

    // Validate required parameters
    if (!client_name || !redirect_uris || !grant_types || !response_types) {
      return new NextResponse(
        JSON.stringify({
          error: "invalid_request",
          error_description: "Missing required parameters",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // Generate client credentials
    const client_id = await generateClientId();
    const client_secret = await generateClientSecret();

    // Store client information
    clients.set(client_id, {
      client_id,
      client_secret,
      client_name,
      redirect_uris,
      grant_types,
      response_types,
      token_endpoint_auth_method:
        token_endpoint_auth_method || "client_secret_basic",
      created_at: Date.now(),
    });

    // Return client credentials
    return new NextResponse(
      JSON.stringify({
        client_id,
        client_secret,
        client_id_issued_at: Math.floor(Date.now() / 1000),
        client_secret_expires_at: 0, // 0 means it never expires
        redirect_uris,
        grant_types,
        response_types,
        token_endpoint_auth_method:
          token_endpoint_auth_method || "client_secret_basic",
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "server_error",
        error_description: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

async function generateClientId() {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-secret-key"
  );
  return new SignJWT({ type: "client_id" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(secret);
}

async function generateClientSecret() {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-secret-key"
  );
  return new SignJWT({ type: "client_secret" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(secret);
}
