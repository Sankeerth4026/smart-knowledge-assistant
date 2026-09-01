import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { UploadPdf, getSources } from "../apis/sourceApi";
import {
  LogOut,
  Crown,
  FileText,
  BarChart3,
  Upload,
  MessageSquare,
  BookOpen,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sources, setSources] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const loadSources = async () => {
    try {
      const data = await getSources();
      setSources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Error loading the files");
      setSources([]);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }
    if (selectedFile.type !== "application/pdf") {
      setError("Select PDF files only");
      return;
    }
    setUploading(true);
    setError("");
    try {
      await UploadPdf(selectedFile);
      setSelectedFile(null);
      await loadSources();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "PDF upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen relative p-4 md:p-8 selection:bg-accent">
      <div className="noise-texture" />

      {/* Main Container Chassis */}
      <div className="max-w-6xl mx-auto flex flex-col gap-6 relative z-10">
        
        {/* Navigation panel */}
        <header className="chassis-panel p-4 flex items-center justify-between">
          {/* Bolts */}
          <div className="absolute top-2 left-2"><div className="screw-head" /></div>
          <div className="absolute top-2 right-2"><div className="screw-head" /></div>
          
          <div className="flex items-center gap-3">
            <span className="led-lamp led-green-active animate-pulse" />
            <div className="flex flex-col">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary">
                Smart Knowledge Assistant
              </span>
              <p className="telemetry-label text-[9px] mt-0.5">
                Welcome, <span className="text-text-primary font-bold">{user?.name || "User"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Operator initial tag */}
            <div className="w-8 h-8 rounded border border-border-dark flex items-center justify-center font-mono text-xs font-bold bg-recessed shadow-[inset_1.5px_1.5px_3px_var(--color-shadow-dark)]">
              {userInitial}
            </div>

            {/* Logout key button */}
            <button
              onClick={handleLogout}
              className="chassis-btn key-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Diagnostic Stat Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Gauge 1 */}
          <div className="chassis-panel p-6 relative">
            <div className="absolute top-2 right-2"><div className="screw-head" /></div>
            <div className="flex items-start gap-3">
              <div className="text-text-secondary mt-0.5">
                <Crown size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="telemetry-label">Current Plan</p>
                <p className="text-xl font-bold mt-1 text-text-primary uppercase tracking-wide font-mono">
                  {user?.plan || "free"}
                </p>
              </div>
            </div>
          </div>

          {/* Gauge 2 */}
          <div className="chassis-panel p-6 relative">
            <div className="absolute top-2 right-2"><div className="screw-head" /></div>
            <div className="flex items-start gap-3">
              <div className="text-text-secondary mt-0.5">
                <FileText size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="telemetry-label">PDF Uploads</p>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-xl font-bold telemetry-value">
                    {sources.length} / 3
                  </p>
                  <span className="font-mono text-[9px] text-text-secondary">Files</span>
                </div>
                {/* Neumorphic progress bar */}
                <div className="well-recessed h-2.5 w-full mt-2 relative overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300 shadow-[0_0_4px_var(--color-accent)]"
                    style={{
                      width: `${Math.min((sources.length / 3) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gauge 3 */}
          <div className="chassis-panel p-6 relative">
            <div className="absolute top-2 right-2"><div className="screw-head" /></div>
            <div className="flex items-start gap-3">
              <div className="text-text-secondary mt-0.5">
                <BarChart3 size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="telemetry-label">Chats Today</p>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-xl font-bold telemetry-value">
                    0 / 20
                  </p>
                  <span className="font-mono text-[9px] text-text-secondary">Used</span>
                </div>
                <div className="well-recessed h-2.5 w-full mt-2 relative overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300 shadow-[0_0_4px_var(--color-accent)]"
                    style={{ width: "0%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Ingestion Machine Section */}
        <div className="chassis-panel p-6 relative">
          <div className="absolute top-3 left-3"><div className="screw-head" /></div>
          <div className="absolute top-3 right-3"><div className="screw-head" /></div>
          
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-primary mb-4 flex items-center gap-2 font-bold pl-3">
            <Upload size={14} className="text-text-secondary" />
            Upload a PDF
          </h2>

          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            {/* Sunken document scanner slot */}
            <div
              className="well-recessed py-8 px-6 flex flex-col items-center gap-2.5 cursor-pointer border border-dashed border-border-dark text-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <>
                  <FileText size={28} className="text-accent" />
                  <p className="text-xs font-bold text-text-primary truncate max-w-md">
                    {selectedFile.name}
                  </p>
                  <p className="font-mono text-[9px] text-text-secondary uppercase">
                    {(selectedFile.size / 1024).toFixed(1)} KB // Click to remove
                  </p>
                </>
              ) : (
                <>
                  <Upload size={28} className="text-text-secondary opacity-60 animate-pulse" />
                  <p className="text-xs font-semibold text-text-secondary">
                    Select a PDF file
                  </p>
                  <p className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">
                    PDF Files Only // Limit 10MB
                  </p>
                </>
              )}
            </div>

            {/* Error telemetry block */}
            {error && (
              <div className="flex items-start gap-2.5 rounded bg-red-950/15 border border-red-500/20 px-4 py-3 text-xs text-red-700">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span className="font-mono">{error}</span>
              </div>
            )}

            {/* Upload trigger key */}
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="chassis-btn chassis-btn-active flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold disabled:opacity-40 self-start"
            >
              {uploading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>Uploading…</span>
                </>
              ) : (
                <>
                  <Upload size={12} />
                  <span>Upload PDF</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Document Registry Ledger */}
        <div className="chassis-panel p-6 relative">
          <div className="absolute top-3 left-3"><div className="screw-head" /></div>
          <div className="absolute top-3 right-3"><div className="screw-head" /></div>

          <h2 className="font-mono text-xs uppercase tracking-wider text-text-primary mb-5 flex items-center gap-2 font-bold pl-3">
            <BookOpen size={14} className="text-text-secondary" />
            Your Uploaded PDFs
          </h2>

          {sources.length === 0 ? (
            /* Sunken Empty Plate */
            <div className="flex flex-col items-center justify-center py-16 gap-3 well-recessed">
              <BookOpen size={24} className="text-text-secondary opacity-50" />
              <p className="font-mono text-[9px] uppercase tracking-wider text-text-secondary font-bold">
                No PDFs Uploaded
              </p>
              <p className="text-xs text-text-secondary max-w-xs text-center leading-relaxed">
                Upload a PDF above to get started.
              </p>
            </div>
          ) : (
            /* Document tables list */
            <div className="flex flex-col gap-4">
              {sources.map((source, idx) => (
                <div
                  key={source.id || idx}
                  className="well-recessed p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-shadow-dark/25 relative"
                >
                  <div className="absolute top-2 right-2"><div className="screw-head" /></div>
                  
                  {/* File diagnostics */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded border border-border-dark flex items-center justify-center bg-chassis shadow-[1px_1px_2px_var(--color-shadow-dark)] shrink-0">
                      <FileText size={14} className="text-text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate">
                        {source.title || "Untitled Document"}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-2 flex-wrap font-mono text-[9px] text-text-secondary uppercase">
                        <span className="mono-badge mono-badge-active !py-0.5 px-2">PDF</span>
                        {source.total_pages != null && (
                          <span>Pages: <span className="text-text-primary font-bold">{source.total_pages}</span></span>
                        )}
                        {source.total_characters != null && (
                          <span>Characters: <span className="text-text-primary font-bold">{source.total_characters.toLocaleString()}</span></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status lights / actions */}
                  <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                    {source.status === "processed" || source.status === "completed" ? (
                      <>
                        <div className="flex items-center gap-1.5 bg-chassis border border-border-dark px-2.5 py-1 rounded shadow-[1px_1px_2px_var(--color-shadow-dark)]">
                          <span className="led-lamp led-green-active" />
                          <span className="font-mono text-[9px] uppercase font-bold text-text-secondary">Processed</span>
                        </div>
                        <button
                          onClick={() =>
                            navigate(`/chat/${source.id}`, {
                              state: { source },
                            })
                          }
                          className="chassis-btn key-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs"
                        >
                          <MessageSquare size={12} />
                          <span>Chat</span>
                          <ChevronRight size={12} />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-chassis border border-border-dark px-2.5 py-1 rounded shadow-[inset_1px_1px_2px_var(--color-shadow-dark)]">
                        <span className="led-lamp led-amber-active animate-pulse" />
                        <span className="font-mono text-[9px] uppercase font-bold text-accent">Processing…</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;