"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AuthorizeLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      // Get all the original OAuth parameters
      const client_id = searchParams.get("client_id");
      const redirect_uri = searchParams.get("redirect_uri");
      const response_type = searchParams.get("response_type");
      const code_challenge = searchParams.get("code_challenge");
      const code_challenge_method = searchParams.get("code_challenge_method");
      const state = searchParams.get("state");

      // Redirect back to authorize with all parameters
      const authorizeUrl = new URL("/authorize", window.location.origin);
      authorizeUrl.searchParams.set("client_id", client_id || "");
      authorizeUrl.searchParams.set("redirect_uri", redirect_uri || "");
      authorizeUrl.searchParams.set("response_type", response_type || "");
      if (code_challenge)
        authorizeUrl.searchParams.set("code_challenge", code_challenge);
      if (code_challenge_method)
        authorizeUrl.searchParams.set(
          "code_challenge_method",
          code_challenge_method
        );
      if (state) authorizeUrl.searchParams.set("state", state);
      authorizeUrl.searchParams.set("authenticated", "true");

      // Use window.location.href for a full page navigation
      window.location.href = authorizeUrl.toString();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-blue-500 to-purple-500">
            <h2 className="text-center text-3xl font-bold text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-blue-100">
              Please sign in to continue
            </p>
          </div>

          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100 text-center">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
