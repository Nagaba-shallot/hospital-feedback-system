"use client";

import React, { useEffect, useState } from "react";
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

      const questionById = Object.fromEntries(questions.map((q) => [q.question_id, q]));
      const enriched = responses
        .map((r) => ({ ...r, question: questionById[r.question_id] }))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setRows(enriched);
      setLoading(false);
    }
    load().catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [authStatus, token]);

  if (authStatus !== "ready") return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Feedback Responses</h1>
      <p className="text-slate-500 text-sm mb-6">
        {rows.length} response{rows.length === 1 ? "" : "s"} received
      </p>

      {loading ? (
        <p className="text-slate-400 animate-pulse">Loading…</p>
      ) : rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <ResponseCard key={row.feedback_response_id} row={row} token={token} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
      No feedback yet. Once a patient completes a survey, their answers will show up here.
    </div>
  );
}

function formatAnswer(row) {
  if (row.rating_value != null) return `${row.rating_value} / 5`;
  if (row.yes_no_value != null) return row.yes_no_value ? "Yes" : "No";
  if (row.text_response) return row.text_response;
  return "—";
}

function ResponseCard({ row, token }) {
  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [repliesLoaded, setRepliesLoaded] = useState(false);

  const toggle = async () => {
    setExpanded((e) => !e);
    if (!repliesLoaded) {
      const data = await listAdminReplies(token, row.feedback_response_id);
      setReplies(data);
      setRepliesLoaded(true);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSending(true);
    try {
      const reply = await createAdminReply(token, row.feedback_response_id, replyText.trim());
      setReplies((prev) => [...prev, reply]);
      setReplyText("");
    } finally {
      setSending(false);
    }
  };

  const isLowRating = row.rating_value != null && row.rating_value <= 2;

  return (
    <div
      className={`bg-white rounded-2xl border p-5 ${
        isLowRating ? "border-red-200" : "border-slate-100"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
            {row.question?.question_text || `Question #${row.question_id}`}
          </p>
          <p className="text-lg font-semibold text-slate-900">{formatAnswer(row)}</p>
          <p className="text-xs text-slate-400 mt-1">
            Patient #{row.patient_id} · {new Date(row.created_at).toLocaleString()}
          </p>
        </div>
        <button
          onClick={toggle}
          className="text-sm text-blue-600 font-medium hover:underline whitespace-nowrap"
        >
          {expanded ? "Hide" : "Reply"}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          {replies.map((r) => (
            <div key={r.admin_reply_id} className="bg-slate-50 rounded-xl p-3 text-sm">
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
              className="flex-1 p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-sm"
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
