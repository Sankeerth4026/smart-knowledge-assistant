import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Chat from "./pages/Chat";
import { ArrowRight, FileText, MessageCircle, CheckCircle, Upload, Zap } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen relative flex flex-col selection:bg-accent selection:text-white">
      {/* Micro-texture noise overlay */}
      <div className="noise-texture" />

      {/* Main Console chassis */}
      <div className="chassis-panel w-full flex-1 p-6 md:p-10 lg:p-16 relative overflow-hidden flex flex-col gap-10">

        {/* Corner Bolts */}
        <div className="absolute top-4 left-4"><div className="screw-head" /></div>
        <div className="absolute top-4 right-4"><div className="screw-head" /></div>
        <div className="absolute bottom-4 left-4"><div className="screw-head" /></div>
        <div className="absolute bottom-4 right-4"><div className="screw-head" /></div>

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-shadow-dark pb-6 gap-4">
          <div className="flex items-center gap-3">
            <span className="led-lamp led-green-active animate-pulse" />
            <h1 className="font-mono text-sm font-bold uppercase tracking-wider text-text-primary">
              Smart Knowledge Assistant
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="chassis-btn key-secondary px-4 py-2 text-xs font-semibold"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="chassis-btn chassis-btn-active px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center gap-6 py-4">
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary leading-tight tracking-tight drop-shadow-[0_1px_1px_#ffffff]">
            Chat with your PDFs,<br />get real answers.
          </h2>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-lg">
            Upload any PDF, ask questions in plain language, and get accurate answers — complete with page numbers so you can verify everything yourself.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <Link
              to="/register"
              className="chassis-btn chassis-btn-active w-full sm:w-auto px-10 py-4 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <span>Try It Free</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/login"
              className="chassis-btn w-full sm:w-auto px-10 py-4 text-xs font-semibold text-center"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* How It Works — 3 steps */}
        <div className="border-t border-shadow-dark pt-8">
          <h3 className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-text-secondary mb-6">
            How It Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="well-recessed p-6 flex flex-col items-center text-center gap-3 relative">
              <div className="absolute top-3 right-3"><div className="screw-head" /></div>
              <div className="chassis-btn key-secondary w-10 h-10 flex items-center justify-center rounded-full">
                <Upload size={16} className="text-text-secondary" />
              </div>
              <h4 className="text-sm font-bold text-text-primary">
                Upload your PDF
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Drag and drop or browse to upload any PDF document. It's ready to chat in seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="well-recessed p-6 flex flex-col items-center text-center gap-3 relative">
              <div className="absolute top-3 right-3"><div className="screw-head" /></div>
              <div className="chassis-btn key-secondary w-10 h-10 flex items-center justify-center rounded-full">
                <MessageCircle size={16} className="text-text-secondary" />
              </div>
              <h4 className="text-sm font-bold text-text-primary">
                Ask a question
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Type your question in plain language — just like talking to someone who's read the whole thing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="well-recessed p-6 flex flex-col items-center text-center gap-3 relative">
              <div className="absolute top-3 right-3"><div className="screw-head" /></div>
              <div className="chassis-btn key-secondary w-10 h-10 flex items-center justify-center rounded-full">
                <CheckCircle size={16} className="text-text-secondary" />
              </div>
              <h4 className="text-sm font-bold text-text-primary">
                Get cited answers
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Every answer shows the exact page it came from, so you can trust and verify the information.
              </p>
            </div>
          </div>
        </div>

        {/* Trust bar / footer */}
        <footer className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-shadow-dark gap-3">
          <span className="text-text-secondary text-[10px] font-mono uppercase tracking-wider">
            Smart Knowledge Assistant
          </span>
          <div className="flex items-center gap-4 text-text-secondary text-[10px] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Zap size={10} className="text-accent" />
              Fast answers
            </span>
            <span className="flex items-center gap-1.5">
              <FileText size={10} />
              Page-level citations
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={10} />
              Free to use
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:sourceId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;