"use client";

import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { listDepartmentsAll, createDepartment, getDepartmentQrToken } from "@/lib/api";

export default function DepartmentsPage() {
  const { token, status: authStatus } = useAdminAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [qrByDept, setQrByDept] = useState({}); 

  const load = async () => {
    setLoading(true);
    const depts = await listDepartmentsAll(token);
    setDepartments(depts);
    setLoading(false);
  };

  useEffect(() => {
    if (authStatus === "ready" && token) load().catch(() => setLoading(false));
  }, [authStatus, token]);

  if (authStatus !== "ready") return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await createDepartment(token, newName.trim());
      setNewName("");
      await load();
    } finally {
      setCreating(false);
    }
  };

  const revealQr = async (departmentId) => {
    if (qrByDept[departmentId]) {
      setQrByDept((prev) => {
        const next = { ...prev };
        delete next[departmentId];
        return next;
      });
      return;
    }
    const { qr_code_token } = await getDepartmentQrToken(token, departmentId);
    const scanUrl = `${window.location.origin}/survey/${qr_code_token}`;
    setQrByDept((prev) => ({ ...prev, [departmentId]: scanUrl }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Departments</h1>
      <p className="text-slate-500 text-sm mb-6">
        Each department has its own scannable QR code. Print or display the code so patients can
        open that department&apos;s survey.
      </p>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6 max-w-md">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New department name"
          className="flex-1 p-2.5 border border-slate-200 rounded-xl bg-white focus:border-blue-500 outline-none text-sm"
        />
        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 text-white text-sm font-semibold px-4 rounded-xl hover:bg-blue-700 disabled:opacity-60"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400 animate-pulse">Loading…</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <div key={dept.department_id} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{dept.name}</p>
                  <p className="text-xs text-slate-400">
                    {dept.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
                <button
                  onClick={() => revealQr(dept.department_id)}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  {qrByDept[dept.department_id] ? "Hide QR" : "Show QR"}
                </button>
              </div>

              {qrByDept[dept.department_id] && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <QRCodeSVG value={qrByDept[dept.department_id]} size={160} level="H" />
                  </div>
                  <p className="text-xs text-slate-400 mt-2 break-all text-center">
                    {qrByDept[dept.department_id]}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
