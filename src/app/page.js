import QrGenerator from "../components/QrCode";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 text-2xl font-bold mb-4 border border-blue-400/30">
            🏥
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Memorial Hospital
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
            Providing world-class healthcare with empathy, innovation and
            clinical excellence. Your wellness remains our lifelong pursuit.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Your Voice Guides Our Care
          </h2>
          <p className="text-slate-600 leading-relaxed text-base">
            We continually strive to improve our hospitality, emergency response
            times and patient care systems. Please scan the QR code using your
            mobile phone camera to open our brief feedback portal.
          </p>

          <div className="space-y-3 pt-2 text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-3">
              <span className="text-blue-500 text-base">✨</span> Completely
              anonymous and confidential
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-500 text-base">⏱️</span> Takes fewer
              minutes to complete
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-500 text-base">📋</span> Directly
              reviewed by administrative boards
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="transform hover:scale-102 transition-transform duration-300">
            <QrGenerator />
          </div>
        </div>
      </main>
    </div>
  );
}
