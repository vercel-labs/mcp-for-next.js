"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthorizeLoginPage() {
  const searchParams = useSearchParams();
  const [authorizeUrl, setAuthorizeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL("/authorize", window.location.origin);
    searchParams.forEach((value, key) => {
      if (value) url.searchParams.set(key, value);
    });
    url.searchParams.set("authenticated", "true");
    setAuthorizeUrl(url.toString());
  }, [searchParams]);

  if (!authorizeUrl) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SignIn
        redirectUrl={authorizeUrl}
        appearance={{
          elements: {
            card: "rounded-2xl shadow-xl",
          },
        }}
      />
    </div>
  );
}
