import Link from "next/link";

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

      <main className="max-w-3xl mx-auto py-16 px-6 text-center space-y-6">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
          Your Voice Guides Our Care
        </h2>
        <p className="text-slate-600 leading-relaxed text-base max-w-xl mx-auto">
          Look for the feedback QR code posted in the department you visited
          and scan it with your phone&apos;s camera to share your experience.
          It only takes a couple of minutes and is completely confidential.
        </p>
      </main>

      <footer className="text-center pb-10">
        <Link href="/admin/login" className="text-xs text-slate-400 hover:text-slate-600">
          Staff login
        </Link>
      </footer>
    </div>
  );
}
