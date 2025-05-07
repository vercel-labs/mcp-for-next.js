"use client";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SsoCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
      signInFallbackRedirectUrl="http://localhost:6274"
      signUpFallbackRedirectUrl="http://localhost:6274"
    />
  );
}
