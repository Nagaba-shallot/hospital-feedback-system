"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { changeMyPassword, ApiError } from "@/lib/api";
import { clearAdminToken } from "@/lib/storage";

export default function SettingsPage() {
  const { admin, token, status } = useAdminAuth();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  if (status !== "ready") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match." });
      return;
    }
    if (newPassword.length < 12) {
      setMessage({ type: "error", text: "New password must be at least 12 characters." });
      return;
    }

    setSubmitting(true);
    try {
      await changeMyPassword(token, currentPassword, newPassword);
      setMessage({
        type: "ok",
        text: "Password changed. Redirecting to login…",
      });
      clearAdminToken();
      setTimeout(() => router.push("/admin/login"), 1200);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof ApiError ? err.detail || "Failed to change password" : "Failed to change password",
      });
      setSubmitting(false);
    }
  };

  const field =
    "w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none";

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Account Settings</h1>
      <p className="text-slate-500 text-sm mb-6">
        Signed in as {admin?.email}
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Change password</h2>

        {message && (
          <p
            className={`mb-4 text-sm rounded-xl px-4 py-2 border ${
              message.type === "ok"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            {message.text}
          </p>
        )}

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Current password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          required
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={`${field} mb-4`}
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">
          New password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          required
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={`${field} mb-4`}
        />

        <label className="block text-sm font-medium text-slate-700 mb-1">
          Confirm new password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`${field} mb-4`}
        />

        <label className="flex items-center gap-2 text-sm text-slate-600 mb-6">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          Show passwords
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-60"
        >
          {submitting ? "Changing…" : "Change password"}
        </button>
      </form>
    </div>
  );
}