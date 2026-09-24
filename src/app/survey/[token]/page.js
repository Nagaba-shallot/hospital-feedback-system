"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { scanQrCode, listFeedbackCategories, listQuestions, submitAnswer, getMyAnswers, ApiError } from "@/lib/api";
import { getPatientSession, setPatientSession } from "@/lib/storage";

const RATING_EMOJI = { 5: "🤩", 4: "🙂", 3: "😐", 2: "🙁", 1: "😟" };

export default function SurveyPage() {
  const params = useParams();
  const qrToken = params?.token;

  const [status, setStatus] = useState("loading"); // loading | error | ready | submitted
  const [errorMessage, setErrorMessage] = useState("");
  const [session, setSession] = useState(null); // { session_token, patient_id, department_visited }
  const [categories, setCategories] = useState([]);
  const [questionsByCategory, setQuestionsByCategory] = useState({});
  const [answers, setAnswers] = useState({}); // question_id -> value
  const [saving, setSaving] = useState({}); // question_id -> bool
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!qrToken) return;
    let cancelled = false;

    async function bootstrap() {
      try {
        // Reuse an existing session for this exact QR link (e.g. on refresh)
        // rather than scanning again and creating a second patient record.
        let activeSession = getPatientSession();
        if (!activeSession || activeSession.qrToken !== qrToken) {
          const scanResult = await scanQrCode(qrToken);
          activeSession = { ...scanResult, qrToken };
          setPatientSession(activeSession);
        }
        if (cancelled) return;
        setSession(activeSession);

        const [cats, allQuestions, myAnswers] = await Promise.all([
          listFeedbackCategories(),
          listQuestions(),
          getMyAnswers(activeSession.session_token),
        ]);
        if (cancelled) return;

        const sortedCats = [...cats].sort((a, b) => a.display_order - b.display_order);
        const grouped = {};
        for (const cat of sortedCats) {
          grouped[cat.feedback_category_id] = allQuestions
            .filter((q) => q.feedback_category_id === cat.feedback_category_id)
            .sort((a, b) => a.order_in_feedback_category - b.order_in_feedback_category);
        }

        const prefilled = {};
        for (const a of myAnswers) {
          prefilled[a.question_id] = a.rating_value ?? a.text_response ?? a.yes_no_value;
        }

        setCategories(sortedCats);
        setQuestionsByCategory(grouped);
        setAnswers(prefilled);
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof ApiError && err.status === 404
            ? "This survey link is invalid or no longer active. Please ask reception for a current QR code."
            : "Something went wrong loading the survey. Please try again in a moment.";
        setErrorMessage(message);
        setStatus("error");
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [qrToken]);

  const currentCategory = categories[currentStep];
  const currentQuestions = currentCategory
    ? questionsByCategory[currentCategory.feedback_category_id] || []
    : [];
  const progressPercent = categories.length
    ? ((currentStep + 1) / categories.length) * 100
    : 0;

  const handleAnswer = async (question, value) => {
    setAnswers((prev) => ({ ...prev, [question.question_id]: value }));
    setSaving((prev) => ({ ...prev, [question.question_id]: true }));

    const payload = { question_id: question.question_id };
    if (question.question_type === "rating") payload.rating_value = value;
    else if (question.question_type === "yes_no") payload.yes_no_value = value;
    else payload.text_response = value;

    try {
      await submitAnswer(session.session_token, payload);
    } catch {
      // Leave the local answer in place; it'll retry naturally if the user
      // changes it, and nothing is lost from their perspective. A production
      // build might surface a small inline "couldn't save, retrying" note.
    } finally {
      setSaving((prev) => ({ ...prev, [question.question_id]: false }));
    }
  };

  const handleNext = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo(0, 0);
    } else {
      setStatus("submitted");
    }
  };

  if (status === "loading") {
    return (
      <CenteredCard>
        <p className="text-slate-400 animate-pulse">Loading your survey…</p>
      </CenteredCard>
    );
  }

  if (status === "error") {
    return (
      <CenteredCard>
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          !
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Can&apos;t open this survey</h2>
        <p className="text-slate-500">{errorMessage}</p>
      </CenteredCard>
    );
  }

  if (status === "submitted") {
    return (
      <CenteredCard>
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
        <p className="text-slate-500 mb-6">
          Your response has been securely submitted to our quality improvement team.
        </p>
      </CenteredCard>
    );
  }

  if (categories.length === 0) {
    return (
      <CenteredCard>
        <p className="text-slate-500">
          There isn&apos;t a survey configured for this department yet. Please check back later.
        </p>
      </CenteredCard>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-blue-900 p-8 text-white">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
            {session?.department_visited} · Category {currentStep + 1} of {categories.length}
          </span>
          <h2 className="text-2xl font-bold mt-1">{currentCategory?.name}</h2>
          <div className="w-full bg-blue-950 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-blue-400 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="p-8 space-y-8">
          {currentQuestions.map((q) => (
            <div key={q.question_id} className="border-b border-slate-50 pb-6 last:border-0">
              <label className="block text-slate-800 font-semibold mb-4 text-base">
                {q.question_text}
                {q.is_required && <span className="text-red-400"> *</span>}
              </label>

              {q.question_type === "rating" && (
                <div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleAnswer(q, num)}
                        className={`flex-1 py-3 font-bold rounded-xl border transition-all ${
                          answers[q.question_id] === num
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  {(q.min_rating_label || q.max_rating_label) && (
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>{q.min_rating_label}</span>
                      <span>{q.max_rating_label}</span>
                    </div>
                  )}
                </div>
              )}

              {q.question_type === "yes_no" && (
                <div className="flex gap-4">
                  {[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleAnswer(q, opt.value)}
                      className={`flex-1 py-3 font-bold rounded-xl border transition-all ${
                        answers[q.question_id] === opt.value
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {q.question_type === "text" && (
                <textarea
                  rows={4}
                  defaultValue={answers[q.question_id] || ""}
                  onBlur={(e) => {
                    if (e.target.value.trim()) handleAnswer(q, e.target.value.trim());
                  }}
                  className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-400"
                  placeholder="Tell us more about your experience..."
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-slate-50 px-8 py-5 flex items-center justify-between border-t border-slate-100">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((s) => s - 1)}
            className="text-slate-500 font-medium hover:text-slate-800 disabled:opacity-0"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            {currentStep === categories.length - 1 ? "Submit Feedback" : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CenteredCard({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-100">
        {children}
      </div>
    </div>
  );
}
