"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { clearAdminToken } from "@/lib/storage";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return children;
  }

  return <Guarded>{children}</Guarded>;
}

function Guarded({ children }) {
  const { admin, status } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 animate-pulse">Checking session…</p>
      </div>
    );
  }

  const handleLogout = () => {
    clearAdminToken();
    router.push("/admin/login");
  };

  const navLink = (href, label) => (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        pathname === href ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-slate-900">🏥 Feedback Admin</span>
          <div className="flex gap-1">
            {navLink("/admin", "Responses")}
            {navLink("/admin/departments", "Departments")}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-500">
            {admin?.first_name} · <span className="uppercase text-xs">{admin?.role}</span>
          </span>
          <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 font-medium">
            Log out
          </button>
        </div>
      </nav>
      <main className="p-6 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
