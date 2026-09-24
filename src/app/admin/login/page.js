"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminLogin, ApiError } from "@/lib/api";
import { setAdminToken } from "@/lib/storage";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { access_token } = await adminLogin(email, password);
      setAdminToken(access_token);
      router.push("/admin");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.detail || "Login failed" : "Couldn't reach the server."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <form
        onSubmit={handleSubmit}
        className="max-w-sm w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
      >
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin Login</h1>
        <p className="text-slate-500 text-sm mb-6">Memorial Hospital feedback dashboard</p>

        {expired && (
          <p className="mb-4 text-sm bg-amber-50 text-amber-700 border border-amber-200 rounded-xl px-4 py-2">
            Your session expired. Please log in again.
          </p>
        )}
        {error && (
          <p className="mb-4 text-sm bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-2">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Log In"}
        </button>
      </form>
    </div>
  );
}
