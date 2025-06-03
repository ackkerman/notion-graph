"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { saveNotionToken } from "@/lib/notion/notionToken";

function Callback() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.get("code");
    const codeVerifier = localStorage.getItem("code_verifier");
    if (!code || !codeVerifier) return;

    (async () => {
      try {
        const res = await fetch("/api/notion/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, code_verifier: codeVerifier }),
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("Token exchange error:", err);
          return;
        }

        const { access_token } = await res.json();
        saveNotionToken(access_token);
        router.push("/");
      } catch (e) {
        console.error(e);
      }
    })();
  }, [params, router]);

  return <p>認証中です…</p>;
}

export default function OAuthCallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Suspense fallback={<p>Loading...</p>}>
        <Callback />
      </Suspense>
    </div>
  );
}