"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyAdminProfile, ApiError } from "@/lib/api";
import { getAdminToken, clearAdminToken } from "@/lib/storage";

export function useAdminAuth() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState("checking"); 

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const stored = getAdminToken();
      if (!stored) {
        router.replace("/admin/login");
        return;
      }
      try {
        const profile = await getMyAdminProfile(stored);
        if (cancelled) return;
        setAdmin(profile);
        setToken(stored);
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        clearAdminToken();
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/admin/login?expired=1");
        } else {
          router.replace("/admin/login");
        }
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return { admin, token, status };
}
