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
  const [showPassword, setShowPassword] = useState(false);
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
        err instanceof ApiError
          ? err.detail || "Login failed"
          : "Couldn't reach the server.",
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
        <p className="text-slate-500 text-sm mb-6">
          Memorial Hospital feedback dashboard
        </p>

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

        <label
          htmlFor="admin-email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@memorial.org"
          className="w-full mb-4 p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        />

        <label
          htmlFor="admin-password"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Password
        </label>
        <div className="relative mb-6">
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-3 pr-12 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-700 focus:text-slate-700 outline-none"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

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

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a19.77 19.77 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a19.83 19.83 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
