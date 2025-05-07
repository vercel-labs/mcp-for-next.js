import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

// In a real app, you would validate against a database
const VALID_CREDENTIALS = {
  email: "test@example.com",
  password: "password123",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate credentials
    if (
      email !== VALID_CREDENTIALS.email ||
      password !== VALID_CREDENTIALS.password
    ) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401 }
      );
    }

    // Generate a JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );

    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    // Return the token
    return new NextResponse(JSON.stringify({ token }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
