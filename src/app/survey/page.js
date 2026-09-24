// No department token in the URL — this page is only reached if someone
// navigates to /survey directly instead of scanning a department's QR code.
// Each department's link is /survey/{qr_code_token}; there's no meaningful
// "generic" survey since questions are grouped and tracked per department.

export default function SurveyLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-100">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
          📷
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Scan a QR Code to Begin</h2>
        <p className="text-slate-500">
          Please scan the QR code posted in the department you visited to open
          its feedback survey.
        </p>
      </div>
    </div>
  );
}
