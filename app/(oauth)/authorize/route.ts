import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Required OAuth parameters
  const client_id = searchParams.get("client_id");
  const redirect_uri = searchParams.get("redirect_uri");
  const response_type = searchParams.get("response_type");
  const code_challenge = searchParams.get("code_challenge");
  const code_challenge_method = searchParams.get("code_challenge_method");
  const state = "123";
  const authenticated = searchParams.get("authenticated");

  // Check which parameters are missing
  const missingParams = [];
  if (!client_id) missingParams.push("client_id");
  if (!redirect_uri) missingParams.push("redirect_uri");
  if (!response_type) missingParams.push("response_type");

  // Validate required parameters
  if (missingParams.length > 0) {
    return new NextResponse(
      JSON.stringify({
        error: "invalid_request",
        error_description: `Missing required parameters: ${missingParams.join(
          ", "
        )}`,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate response_type
  if (response_type !== "code") {
    return new NextResponse(
      JSON.stringify({
        error: "unsupported_response_type",
        error_description: "Only code response type is supported",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate PKCE if provided
  if (code_challenge && code_challenge_method !== "S256") {
    return new NextResponse(
      JSON.stringify({
        error: "invalid_request",
        error_description: "Only S256 code challenge method is supported",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Check for authentication
  if (authenticated !== "true") {
    // Redirect to login page with all parameters
    const loginUrl = new URL("/authorize/login", request.url);
    searchParams.forEach((value, key) => {
      if (value) {
        loginUrl.searchParams.set(key, value);
      }
    });
    return NextResponse.redirect(loginUrl.toString());
  }

  // At this point, we know the user is authenticated
  // Get the email from the session cookie
  const cookieStore = await cookies();
  const authSession = cookieStore.get("auth_session");
  if (!authSession?.value) {
    return new NextResponse(
      JSON.stringify({
        error: "unauthorized",
        error_description: "No authenticated session found",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Generate authorization code
  const code = await generateAuthorizationCode(
    client_id,
    "read_write", // Default scope
    code_challenge,
    authSession.value
  );

  // Store the code and its details in a secure way (e.g., database)
  // For this example, we'll use cookies
  cookieStore.set("auth_code", code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
  });

  // Redirect to the client's redirect URI with the authorization code
  if (!redirect_uri) {
    throw new Error("Redirect URI is required");
  }

  const redirectUrl = new URL(redirect_uri);
  redirectUrl.searchParams.set("code", code);
  redirectUrl.searchParams.set("state", state);

  return NextResponse.redirect(redirectUrl.toString());
}

async function generateAuthorizationCode(
  client_id: string | null,
  scope: string,
  code_challenge?: string | null,
  email?: string
) {
  if (!client_id) {
    throw new Error("Client ID is required");
  }

  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-secret-key"
  );

  return new SignJWT({
    client_id,
    scope,
    code_challenge,
    email,
    timestamp: Date.now(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(secret);
}
