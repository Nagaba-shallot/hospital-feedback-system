"use client";

import React, { useState } from "react";
import { hospitalReviewQuestions } from "@/components/Data";

export default function SurveyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentCategory = hospitalReviewQuestions[currentStep];
  const progressPercent =
    ((currentStep + 1) / hospitalReviewQuestions.length) * 100;

  const handleSelectAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < hospitalReviewQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      console.log("Final Collected Responses Structure:", answers);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
          <p className="text-slate-500 mb-6">
            Your Feedback has been securely submitted to our quality improvement
            team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        <div className="bg-blue-900 p-8 text-white">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
            Category {currentStep + 1} of {hospitalReviewQuestions.length}
          </span>
          <h2 className="text-2xl font-bold mt-1">
            {currentCategory?.category}
          </h2>
          <div className="w-full bg-blue-950 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-blue-400 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          
          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white p-6 text-left rounded-2xl flex flex-col shadow-md">
            <p className="font-semibold text-sm border-b border-white/20 pb-2 mb-3">
              For every question, it is rated out of 5
            </p>
            <div className="space-y-2 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <span>5: 🤩 </span> Very Satisfied
              </div>
              <div className="flex items-center gap-2">
                <span>4: 🙂 </span> Satisfied
              </div>
              <div className="flex items-center gap-2">
                <span>3: 😐 </span> Average
              </div>
              <div className="flex items-center gap-2">
                <span>2: 🙁 </span> Dissatisfied
              </div>
              <div className="flex items-center gap-2">
                <span>1: 😟 </span> Very Dissatisfied
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-4">
            {currentCategory?.questions.map((q) => (
              <div
                key={q.id}
                className="border-b border-slate-100 pb-6 last:border-0"
              >
                <label className="block text-slate-800 font-semibold mb-4 text-base">
                  {q.text}
                </label>

                {q.type === "rating" && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, num)}
                        className={`flex-1 py-3 font-bold rounded-xl border transition-all ${
                          answers[q.id] === num
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === "boolean" && (
                  <div className="flex gap-4">
                    {["Yes", "No"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleSelectAnswer(q.id, option)}
                        className={`flex-1 py-3 font-bold rounded-xl border transition-all ${
                          answers[q.id] === option
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === "textarea" && (
                  <textarea
                    rows={4}
                    value={answers[q.id] || ""}
                    onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-400"
                    placeholder="Tell us more about your experience..."
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 px-8 py-5 flex items-center justify-between border-t border-slate-100">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="text-slate-500 font-medium hover:text-slate-800 disabled:opacity-0"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            {currentStep === hospitalReviewQuestions.length - 1
              ? "Submit Feedback"
              : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
