"use client";

import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { listAdmins, createAdmin, deleteAdmin, ApiError } from "@/lib/api";

export default function AdminsPage() {
  const { admin, token, status: authStatus } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await listAdmins(token);
      setAdmins(data);
      setError("");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.detail || "Failed to load admins"
          : "Failed to load admins"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus === "ready" && token) load();
  }, [authStatus, token]);

  if (authStatus !== "ready") return null;

  if (admin?.role !== "super_admin") {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
        <p className="text-2xl mb-2">🔒</p>
        <h2 className="font-semibold text-slate-900 mb-1">Super admin only</h2>
        <p className="text-slate-500 text-sm">
          You don&apos;t have permission to manage admin accounts.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin Accounts</h1>
      <p className="text-slate-500 text-sm mb-6">
        Create and manage staff logins. Only super admins can access this page.
      </p>

      {error && (
        <p className="mb-4 text-sm bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-2">
          {error}
        </p>
      )}

      <CreateAdminForm token={token} onCreated={load} />

      {loading ? (
        <p className="text-slate-400 animate-pulse mt-6">Loading…</p>
      ) : (
        <div className="mt-6 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-3">Name</th>
                <th className="text-left font-medium px-4 py-3">Email</th>
                <th className="text-left font-medium px-4 py-3">Role</th>
                <th className="text-left font-medium px-4 py-3">Hospital</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <AdminRow
                  key={a.admin_id}
                  admin={a}
                  token={token}
                  currentAdminId={admin?.admin_id}
                  onDeleted={load}
                />
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No admins yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CreateAdminForm({ token, onCreated }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    hospital_name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await createAdmin(token, form);
      setMessage({ type: "ok", text: `Created admin ${form.email}.` });
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        hospital_name: "",
      });
      onCreated();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof ApiError
            ? err.detail || "Failed to create admin"
            : "Failed to create admin",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-100 p-5"
    >
      <h2 className="font-semibold text-slate-900 mb-4">Add a new admin</h2>

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

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input
          required
          placeholder="First name"
          value={form.first_name}
          onChange={update("first_name")}
          className={field}
        />
        <input
          required
          placeholder="Last name"
          value={form.last_name}
          onChange={update("last_name")}
          className={field}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={update("email")}
          className={field}
        />
        <input
          required
          placeholder="Hospital name"
          value={form.hospital_name}
          onChange={update("hospital_name")}
          className={field}
        />
        <div className="relative sm:col-span-2">
          <input
            required
            type={showPassword ? "text" : "password"}
            placeholder="Temporary password"
            value={form.password}
            onChange={update("password")}
            className={`${field} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? "Creating…" : "Create admin"}
      </button>
    </form>
  );
}

function AdminRow({ admin, token, currentAdminId, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const isSelf = admin.admin_id === currentAdminId;

  const handleDelete = async () => {
    if (!confirm(`Delete admin ${admin.email}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteAdmin(token, admin.admin_id);
      onDeleted();
    } catch (err) {
      alert(
        err instanceof ApiError
          ? err.detail || "Failed to delete"
          : "Failed to delete"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr className="border-t border-slate-100">
      <td className="px-4 py-3 text-slate-900">
        {admin.first_name} {admin.last_name}
      </td>
      <td className="px-4 py-3 text-slate-600">{admin.email}</td>
      <td className="px-4 py-3">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${
            admin.role === "super_admin"
              ? "bg-purple-50 text-purple-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {admin.role}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-600">{admin.hospital_name || "—"}</td>
      <td className="px-4 py-3">
        <span
          className={`text-xs font-medium ${
            admin.is_active ? "text-green-600" : "text-slate-400"
          }`}
        >
          {admin.is_active ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        {!isSelf && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        )}
        {isSelf && <span className="text-xs text-slate-400">You</span>}
      </td>
    </tr>
  );
}