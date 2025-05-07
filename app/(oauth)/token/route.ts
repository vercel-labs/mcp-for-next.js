import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

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
    const formData = await request.formData();

    // Required OAuth parameters
    const grant_type = formData.get("grant_type");
    const code = formData.get("code");
    const redirect_uri = formData.get("redirect_uri");
    const client_id = formData.get("client_id");
    const code_verifier = formData.get("code_verifier");

    // Validate required parameters
    if (!grant_type || !code || !redirect_uri || !client_id) {
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

    // Validate grant type
    if (grant_type !== "authorization_code") {
      return new NextResponse(
        JSON.stringify({
          error: "unsupported_grant_type",
          error_description: "Only authorization_code grant type is supported",
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

    // Verify the authorization code
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );

    // biome-ignore lint/suspicious/noExplicitAny: decrypt
    let codePayload: any;
    try {
      const { payload } = await jwtVerify(code as string, secret);
      codePayload = payload;
    } catch (error) {
      return new NextResponse(
        JSON.stringify({
          error: "invalid_grant",
          error_description: "Invalid authorization code",
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

    // Verify PKCE if code challenge was provided
    if (codePayload.code_challenge && !code_verifier) {
      return new NextResponse(
        JSON.stringify({
          error: "invalid_request",
          error_description: "Code verifier required",
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

    // Generate access token
    const accessToken = await generateAccessToken(
      client_id as string,
      codePayload.scope as string,
      codePayload.email as string
    );

    // Return the access token
    return new NextResponse(
      JSON.stringify({
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: 3600, // 1 hour
        scope: codePayload.scope,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          Pragma: "no-cache",
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

async function generateAccessToken(
  client_id: string,
  scope: string,
  email: string
) {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-secret-key"
  );

  return new SignJWT({
    client_id,
    scope,
    email,
    timestamp: Date.now(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}
