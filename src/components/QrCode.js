"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrGenerator() {
  const [surveyUrl, setSurveyUrl] = useState("");

  useEffect(() => {
    setSurveyUrl(`${window.location.origin}/survey`);
  }, []);

  if (!surveyUrl)
    return (
      <div className="text-slate-400 animate-pulse">
        Generating portal link...
      </div>
    );

  return (
    <>
      <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center border border-slate-100 max-w-sm">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
          <QRCodeSVG
            value={surveyUrl}
            size={200}
            bgColor={"#ffffff"}
            fgColor={"#0f172a"}
            level={"H"}
          />
        </div>
        <p className="text-slate-900 text-center font-extrabold text-xl mt-4 tracking-wider uppercase">
          Scan to Start Survey
        </p>

        <div className="h-8"></div>

        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16 px-6 text-left rounded-2xl flex flex-col">
          <p>For every question, it is rated out of 5</p>
          <div className="h-4"></div>
          <div>
            <span>5: 🤩 </span>
            Very Satisfied
          </div>
          <div className="h-3"></div>
          <div>
            <span>4: 😐 </span>
            Satisfied
          </div>
          <div className="h-3"></div>
          <div>
            <span>3: 😐 </span>
            Average
          </div>
          <div className="h-3"></div>
          <div>
            <span>2: 😐 </span>
            Dissatisfied
          </div>
          <div className="h-3"></div>
          <div>
            <span>1: 😟 </span>
            Very Dissatified
          </div>
        </div>
      </div>
    </>
  );
}
