"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import {
  listFeedbackResponses,
  listQuestions,
  createAdminReply,
  listAdminReplies,
} from "@/lib/api";

export default function AdminResponsesPage() {
  const { token, status: authStatus } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [visible, setVisible] = useState(20);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (authStatus !== "ready" || !token) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [responses, questions] = await Promise.all([
        listFeedbackResponses(token),
        listQuestions(),
      ]);
      if (cancelled) return;

      const questionById = Object.fromEntries(
        questions.map((q) => [q.question_id, q]),
      );
      const enriched = responses.map((r) => ({
        ...r,
        question: questionById[r.question_id],
      }));

      setRows(enriched);
      setLoading(false);
    }
    load().catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [authStatus, token]);

  useEffect(() => {
    setVisible(20);
  }, [departmentFilter, sortBy, search]);

  const visits = useMemo(() => {
    const byPatient = new Map();
    for (const r of rows) {
      const key = r.patient_id ?? "unknown";
      if (!byPatient.has(key)) {
        byPatient.set(key, {
          patientId: key,
          createdAt: r.created_at,
          department: r.department_name || r.department_visited || null,
          answers: [],
        });
      }
      const visit = byPatient.get(key);
      visit.answers.push(r);
      if (new Date(r.created_at) > new Date(visit.createdAt)) {
        visit.createdAt = r.created_at;
      }
    }

    const list = [...byPatient.values()].map((v) => {
      const ratings = v.answers
        .map((a) => a.rating_value)
        .filter((x) => typeof x === "number");
      const worstRating = ratings.length ? Math.min(...ratings) : null;
      const avgRating = ratings.length
        ? ratings.reduce((s, x) => s + x, 0) / ratings.length
        : null;
      return {
        ...v,
        answerCount: v.answers.length,
        worstRating,
        avgRating,
      };
    });

    const filtered =
      departmentFilter === "all"
        ? list
        : list.filter((v) => v.department === departmentFilter);

    const q = search.trim().toLowerCase();
    const searched = !q
      ? filtered
      : filtered.filter((v) => {
          if (`patient #${v.patientId}`.toLowerCase().includes(q)) return true;
          if ((v.department || "").toLowerCase().includes(q)) return true;
          return v.answers.some((a) => {
            const txt = (a.text_response || "").toLowerCase();
            const qTxt = (a.question?.question_text || "").toLowerCase();
            return txt.includes(q) || qTxt.includes(q);
          });
        });

    const sorted = [...searched].sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "worst") {
        const aw = a.worstRating ?? 99;
        const bw = b.worstRating ?? 99;
        return aw - bw;
      }
      return 0;
    });

    return sorted;
  }, [rows, departmentFilter, sortBy, search]);

  const departments = useMemo(() => {
    const s = new Set();
    for (const r of rows) {
      const d = r.department_name || r.department_visited;
      if (d) s.add(d);
    }
    return [...s].sort();
  }, [rows]);

  if (authStatus !== "ready") return null;

  const totalVisits = visits.length;
  const totalAnswers = rows.length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        Feedback Responses
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        {totalVisits} visit{totalVisits === 1 ? "" : "s"} · {totalAnswers}{" "}
        answer
        {totalAnswers === 1 ? "" : "s"} received
      </p>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search patients, departments, or comments…"
        className="w-full mb-3 px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-blue-900 focus:border-blue-500 outline-none"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-blue-900 focus:border-blue-500 outline-none"
        >
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-blue-900 focus:border-blue-500 outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="worst">Worst ratings first</option>
        </select>
      </div>

      {loading ? (
        <p className="text-slate-400 animate-pulse">Loading…</p>
      ) : visits.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {visits.slice(0, visible).map((visit) => (
            <VisitCard key={visit.patientId} visit={visit} token={token} />
          ))}

          {visible < visits.length && (
            <button
              onClick={() => setVisible((v) => v + 20)}
              className="w-full py-3 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              Load {Math.min(20, visits.length - visible)} more
              <span className="text-slate-400 ml-1">
                ({visits.length - visible} hidden)
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
      No feedback yet. Once a patient completes a survey, their answers will
      show up here.
    </div>
  );
}

function formatAnswer(row) {
  if (row.rating_value != null) return `${row.rating_value} / 5`;
  if (row.yes_no_value != null) return row.yes_no_value ? "Yes" : "No";
  if (row.text_response) return row.text_response;
  return "—";
}

function VisitCard({ visit, token }) {
  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [repliesLoaded, setRepliesLoaded] = useState(false);

  const hasLowRating = visit.worstRating != null && visit.worstRating <= 2;

  const toggle = async () => {
    setExpanded((e) => !e);
    if (!repliesLoaded) {
      const first = visit.answers[0];
      if (first) {
        const data = await listAdminReplies(token, first.feedback_response_id);
        setReplies(data);
        setRepliesLoaded(true);
      }
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSending(true);
    try {
      const first = visit.answers[0];
      if (first) {
        const reply = await createAdminReply(
          token,
          first.feedback_response_id,
          replyText.trim(),
        );
        setReplies((prev) => [...prev, reply]);
        setReplyText("");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border p-5 ${
        hasLowRating ? "border-red-200" : "border-slate-100"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-900">
              Patient #{visit.patientId}
            </p>
            {hasLowRating && (
              <span className="text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5">
                Low rating
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {visit.department ? `${visit.department} · ` : ""}
            {new Date(visit.createdAt).toLocaleString()} · {visit.answerCount}{" "}
            answer
            {visit.answerCount === 1 ? "" : "s"}
            {visit.avgRating != null &&
              ` · avg ${visit.avgRating.toFixed(1)}/5`}
          </p>
        </div>
        <button
          onClick={toggle}
          className="text-sm text-blue-600 font-medium hover:underline whitespace-nowrap"
        >
          {expanded ? "Hide" : "Reply"}
        </button>
      </div>

      <ul className="divide-y divide-slate-100">
        {visit.answers.map((a) => {
          const isLow = a.rating_value != null && a.rating_value <= 2;
          return (
            <li
              key={a.feedback_response_id}
              className="py-3 flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-0.5">
                  {a.question?.question_text || `Question #${a.question_id}`}
                </p>
                <p
                  className={`text-sm ${
                    isLow ? "text-red-600 font-medium" : "text-slate-800"
                  }`}
                >
                  {formatAnswer(a)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          {replies.map((r) => (
            <div
              key={r.admin_reply_id}
              className="bg-slate-50 rounded-xl p-3 text-sm"
            >
              <p className="text-slate-700">{r.reply_text}</p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(r.created_at).toLocaleString()}
              </p>
            </div>
          ))}
          <form onSubmit={handleReply} className="flex gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write an internal follow-up note…"
              className="flex-1 p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-blue-900 focus:border-blue-500 outline-none text-sm"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-blue-600 text-white text-sm font-semibold px-4 rounded-xl hover:bg-blue-700 disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
