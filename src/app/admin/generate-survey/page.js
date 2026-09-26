"use client";

import React, { useState } from "react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { generateSurveyDraft, replaceSurvey, ApiError } from "@/lib/api";
import ConfirmModal from "@/components/ConfirmModal";

let _localId = 0;
const nextId = () => `local-${++_localId}`;

export default function GenerateSurveyPage() {
  const { token, status: authStatus } = useAdminAuth();

  const [focus, setFocus] = useState("");
  const [numCategories, setNumCategories] = useState(3);
  const [questionsPerCategory, setQuestionsPerCategory] = useState(3);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  if (authStatus !== "ready") return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setPublishResult(null);
    setGenerating(true);
    try {
      const result = await generateSurveyDraft(token, {
        focus,
        num_categories: Number(numCategories),
        questions_per_category: Number(questionsPerCategory),
      });
      const withIds = {
        categories: result.categories.map((cat) => ({
          ...cat,
          _id: nextId(),
          questions: cat.questions.map((q) => ({ ...q, _id: nextId() })),
        })),
      };
      setDraft(withIds);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.detail || "Generation failed"
          : "Couldn't reach the server.",
      );
    } finally {
      setGenerating(false);
    }
  };

  const updateCategory = (catId, patch) => {
    setDraft((d) => ({
      categories: d.categories.map((c) =>
        c._id === catId ? { ...c, ...patch } : c,
      ),
    }));
  };

  const removeCategory = (catId) => {
    setDraft((d) => ({
      categories: d.categories.filter((c) => c._id !== catId),
    }));
  };

  const updateQuestion = (catId, qId, patch) => {
    setDraft((d) => ({
      categories: d.categories.map((c) =>
        c._id !== catId
          ? c
          : {
              ...c,
              questions: c.questions.map((q) =>
                q._id === qId ? { ...q, ...patch } : q,
              ),
            },
      ),
    }));
  };

  const removeQuestion = (catId, qId) => {
    setDraft((d) => ({
      categories: d.categories.map((c) =>
        c._id !== catId
          ? c
          : { ...c, questions: c.questions.filter((q) => q._id !== qId) },
      ),
    }));
  };

  const handlePublish = () => {
    setPublishResult(null);
    setShowPublishConfirm(true);
  };

  const doPublish = async () => {
    setPublishing(true);
    setPublishResult(null);
    try {
      const payload = {
        categories: draft.categories
          .filter((c) => c.questions.length > 0)
          .map((c, ci) => ({
            name: c.name,
            display_order: ci + 1,
            icon: c.icon || null,
            description: null,
            department_id: null,
            questions: c.questions.map((q, qi) => ({
              question_text: q.question_text,
              question_type: q.question_type,
              order_in_feedback_category: qi + 1,
              is_required: q.is_required,
              min_rating_label:
                q.question_type === "rating"
                  ? q.min_rating_label || null
                  : null,
              max_rating_label:
                q.question_type === "rating"
                  ? q.max_rating_label || null
                  : null,
            })),
          })),
      };

      const result = await replaceSurvey(token, payload);
      setPublishResult({
        created: { categories: result.categories, questions: result.questions },
        failures: [],
      });
      setDraft(null);
      setFocus("");
    } catch (err) {
      let msg = "Publish failed";
      if (err instanceof ApiError) {
        if (typeof err.detail === "string") msg = err.detail;
        else if (Array.isArray(err.detail))
          msg = err.detail
            .map((d) => `${(d.loc || []).join(".")}: ${d.msg}`)
            .join("; ");
        else if (err.detail) msg = JSON.stringify(err.detail);
      }
      setPublishResult({
        created: { categories: 0, questions: 0 },
        failures: [msg],
      });
    } finally {
      setPublishing(false);
      setShowPublishConfirm(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        Generate Survey with AI
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Describe what you want feedback on. Review and edit the draft below —
        nothing is saved until you publish it.
      </p>

      <form
        onSubmit={handleGenerate}
        className="bg-white rounded-2xl border border-slate-100 p-5 mb-6"
      >
        <label className="block text-sm font-medium text-black mb-1">
          Focus area
        </label>
        <input
          required
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          placeholder="e.g. Emergency Room — wait times and staff communication"
          className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-blue-600 focus:bg-white focus:border-blue-500 outline-none text-sm mb-4"
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Categories
            </label>
            <input
              type="number"
              min={1}
              max={6}
              value={numCategories}
              onChange={(e) => setNumCategories(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-blue-600 focus:bg-white focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Questions per category
            </label>
            <input
              type="number"
              min={1}
              max={6}
              value={questionsPerCategory}
              onChange={(e) => setQuestionsPerCategory(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-blue-600 focus:bg-white focus:border-blue-500 outline-none text-sm"
            />
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={generating}
          className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-60"
        >
          {generating ? "Generating…" : "Generate draft"}
        </button>
      </form>

      {publishResult && (
        <div
          className={`mb-6 rounded-xl px-4 py-3 text-sm border ${
            publishResult.failures.length === 0
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          <p className="font-medium">
            Created {publishResult.created.categories} categories and{" "}
            {publishResult.created.questions} questions.
          </p>
          {publishResult.failures.map((f, i) => (
            <p key={i} className="mt-1">
              {f}
            </p>
          ))}
        </div>
      )}

      {draft && (
        <div className="space-y-4">
          {draft.categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-2xl border border-slate-100 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <input
                  value={category.name}
                  onChange={(e) =>
                    updateCategory(category._id, { name: e.target.value })
                  }
                  className="font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 outline-none flex-1"
                />
                <button
                  onClick={() => removeCategory(category._id)}
                  className="text-xs text-red-500 hover:text-red-700 ml-3"
                >
                  Remove category
                </button>
              </div>

              <div className="space-y-3">
                {category.questions.map((q) => (
                  <div
                    key={q._id}
                    className="flex items-start gap-3 border-t border-slate-50 pt-3"
                  >
                    <div className="flex-1">
                      <input
                        value={q.question_text}
                        onChange={(e) =>
                          updateQuestion(category._id, q._id, {
                            question_text: e.target.value,
                          })
                        }
                        className="w-full text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 outline-none"
                      />
                      <span className="text-xs text-slate-400 uppercase">
                        {q.question_type}
                        {q.is_required ? " · required" : ""}
                      </span>
                    </div>
                    <button
                      onClick={() => removeQuestion(category._id, q._id)}
                      className="text-xs text-red-500 hover:text-red-700 whitespace-nowrap"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {category.questions.length === 0 && (
                  <p className="text-xs text-slate-400 pt-2">
                    No questions left — this category will be skipped on
                    publish.
                  </p>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={handlePublish}
            disabled={
              publishing ||
              draft.categories.every((c) => c.questions.length === 0)
            }
            className="bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 disabled:opacity-60 shadow-md"
          >
            {publishing ? "Publishing…" : "Publish survey"}
          </button>
        </div>
      )}
      <ConfirmModal
        open={showPublishConfirm}
        title="Publish this survey?"
        message="Publishing will REPLACE the current survey. Any existing categories and questions will be deleted. This cannot be undone."
        confirmLabel="Publish"
        cancelLabel="Cancel"
        busy={publishing}
        destructive
        onConfirm={doPublish}
        onCancel={() => setShowPublishConfirm(false)}
      />
    </div>
  );
}
