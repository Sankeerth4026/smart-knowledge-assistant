import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { askQuestion, getChatHistory } from "../apis/chatApi";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  Send,
  FileText,
  AlertCircle,
  BookOpen,
  Terminal,
  FileCode,
  Loader2,
  Cpu,
  ChevronDown,
} from "lucide-react";

function Chat() {
  const { sourceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const source = location.state?.source;

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Interactive console states
  const [screenColor, setScreenColor] = useState("green"); // green or amber
  const [showScanlines, setShowScanlines] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getChatHistory(sourceId);
        const formattedHistory = history.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.created_at
            ? new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "SYNC",
          citations: [],
        }));
        setMessages(formattedHistory);
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };
    if (sourceId) {
      fetchHistory();
    }
  }, [sourceId]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanQuestion = question.trim();
    if (!cleanQuestion) {
      setError("Please Enter a question !");
      return;
    }
    const userMessage = {
      role: "user",
      content: cleanQuestion,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((PreviousMessages) => [...PreviousMessages, userMessage]);

    setQuestion("");
    setError("");
    setLoading(true);

    try {
      const data = await askQuestion(sourceId, cleanQuestion);
      const assistantMessage = {
        role: "assistant",
        content: data.answer,
        citations: data.citations || [],
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((PreviousMessages) => [
        ...PreviousMessages,
        assistantMessage,
      ]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to generate an answer");
    } finally {
      setLoading(false);
    }
  };

  // Determine active terminal text color class
  const textClr = screenColor === "green" ? "crt-text-green" : "crt-text-amber";

  return (
    <div className="h-screen flex flex-col p-4 relative selection:bg-accent">
      <div className="noise-texture" />

      {/* Main Console chassis */}
      <div className="chassis-panel flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Hardware Screws */}
        <div className="absolute top-2 left-2">
          <div className="screw-head" />
        </div>
        <div className="absolute top-2 right-2">
          <div className="screw-head" />
        </div>
        <div className="absolute bottom-2 left-2">
          <div className="screw-head" />
        </div>
        <div className="absolute bottom-2 right-2">
          <div className="screw-head" />
        </div>

        {/* Machine Header */}
        <header className="border-b border-shadow-dark px-6 py-4 flex items-center justify-between flex-shrink-0 gap-4 mt-2">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="chassis-btn key-secondary p-1.5 rounded cursor-pointer shrink-0"
            >
              <ArrowLeft size={14} />
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <FileText size={16} className="text-text-secondary shrink-0" />
              <h1 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {source?.title || "Selected PDF"}
              </h1>
              <div className="flex items-center gap-1.5 bg-recessed border border-border-dark px-2 py-0.5 rounded shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]">
                <span className="led-lamp led-green-active animate-pulse" />
                <span className="font-mono text-[8px] uppercase tracking-wider text-text-secondary">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[9px] text-text-secondary uppercase">
            <Cpu size={12} className="text-accent" />
            <span className="hidden sm:inline">AI Chat Active</span>
          </div>
        </header>

        {/* Console Workspace: Side Telemetry Panel + CRT Screen */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4 pb-2">
          {/* Side Telemetry Module (Left panel, hidden on tiny screens, stacked on small md) */}
          <div className="md:w-60 flex flex-col gap-4 flex-shrink-0">
            <div className="well-recessed p-4 flex-1 flex flex-col justify-between relative shadow-[inset_4px_4px_8px_#babecc,inset_-4px_-4px_8px_#ffffff] border border-shadow-dark/25">
              {/* Telemetry settings screws */}
              <div className="absolute top-2 left-2">
                <div className="screw-head" />
              </div>
              <div className="absolute top-2 right-2">
                <div className="screw-head" />
              </div>

              <div>
                <span className="telemetry-label text-[9px] border-b border-border-dark pb-1.5 block">
                  Document Info
                </span>

                <div className="space-y-3 mt-4">
                  <div>
                    <span className="telemetry-label text-[8px]">
                      Total Pages
                    </span>
                    <p className="text-xs font-bold telemetry-value mt-0.5">
                      {source?.total_pages != null ? source.total_pages : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="telemetry-label text-[8px]">
                      Total Characters
                    </span>
                    <p className="text-xs font-bold telemetry-value mt-0.5">
                      {source?.total_characters != null
                        ? source.total_characters.toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="telemetry-label text-[8px]">Status</span>
                    <p className="text-[10px] font-bold telemetry-value mt-0.5 uppercase">
                      Ready
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Led grid - database connection indicator removed */}
              <div className="border-t border-border-dark/40 pt-4 flex flex-col gap-2">
                <span className="telemetry-label text-[8px]">
                  Connection Status
                </span>
                <div className="flex items-center justify-between bg-chassis p-2 rounded border border-border-dark/30 shadow-[1px_1px_2px_rgba(0,0,0,0.1)]">
                  <span className="font-mono text-[8px] text-text-secondary uppercase">
                    AI Model
                  </span>
                  <span className="led-lamp led-green-active" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Terminal screen wrapper (Right panel) */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div
              className={`crt-screen flex-1 overflow-y-auto p-4 space-y-4 ${showScanlines ? "crt-scanlines" : ""}`}
            >
              {messages.length === 0 ? (
                /* CRT Screen Empty State */
                <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-fade-in gap-3">
                  <Terminal size={32} className={textClr} />
                  <h2
                    className={`${textClr} text-sm font-bold uppercase tracking-widest`}
                  >
                    Ask questions about this PDF
                  </h2>
                  <p
                    className={`${textClr} text-[10px] max-w-sm font-mono leading-relaxed`}
                  >
                    Type your question in the slot below. The AI will find
                    relevant parts and answer.
                  </p>
                </div>
              ) : (
                /* Chat messages */
                <div className="space-y-5 font-mono text-xs">
                  {messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-accent/15 border border-accent/30 rounded-br-sm"
                            : "bg-slate-800/40 border border-slate-600/30 rounded-bl-sm"
                        }`}
                      >
                        {/* Role & Time */}
                        <div className="flex items-center justify-between gap-4 mb-1.5">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider ${
                              message.role === "user" ? "text-accent" : textClr
                            }`}
                          >
                            {message.role === "user" ? "You" : "Assistant"}
                          </span>
                          <span className="text-[8px] text-slate-400">
                            {message.timestamp || ""}
                          </span>
                        </div>

                        {/* Content */}
                        <div
                          className={`leading-relaxed ${textClr} prose prose-sm prose-invert max-w-none text-xs [&_p]:text-slate-200 [&_li]:text-slate-200`}
                        >
                          {message.role === "user" ? (
                            <p className="m-0 text-slate-100">
                              {message.content}
                            </p>
                          ) : (
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          )}
                        </div>

                        {/* Collapsible Citations */}
                        {message.role === "assistant" &&
                          message.citations?.length > 0 && (
                            <details className="mt-3 pt-2 border-t border-slate-700/30 group">
                              <summary className="flex items-center gap-2 cursor-pointer select-none list-none">
                                <BookOpen size={11} className={textClr} />
                                <span
                                  className={`${textClr} text-[9px] uppercase tracking-wider font-bold`}
                                >
                                  Sources ({message.citations.length})
                                </span>
                                <ChevronDown
                                  size={12}
                                  className={`${textClr} transition-transform duration-200 group-open:rotate-180`}
                                />
                              </summary>

                              <div className="grid grid-cols-1 gap-2 mt-2">
                                {message.citations.map((citation, cIdx) => (
                                  <div
                                    key={cIdx}
                                    className="p-2.5 border border-slate-700/40 bg-slate-900/30 rounded-lg flex flex-col gap-1"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[9px] text-text-secondary flex items-center gap-1.5 truncate max-w-[200px]">
                                        <FileCode size={10} />
                                        {citation.title}
                                      </span>
                                      <span className="bg-accent/10 text-accent text-[8px] px-1.5 py-0.5 rounded font-bold">
                                        Page {citation.page_number ?? "N/A"}
                                      </span>
                                    </div>
                                    <p className="text-[9px] text-text-secondary/70 italic leading-relaxed mt-0.5">
                                      "{citation.content_preview}"
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                      </div>
                    </div>
                  ))}

                  {/* Terminal loading line */}
                  {loading && (
                    <div className="flex flex-col gap-2 p-3 bg-slate-900/10 animate-pulse border border-slate-800/40 rounded">
                      <span
                        className={`${textClr} text-[9px] uppercase tracking-widest font-bold`}
                      >
                        ::: Processing answer...
                      </span>
                      <div
                        className={`flex items-center gap-2 ${textClr} text-[10px]`}
                      >
                        <Loader2 size={10} className="animate-spin" />
                        <span>Searching document pages & writing answer…</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Interactive Screen Controls HUD */}
            <div className="flex items-center justify-between mt-3 px-4 py-2 well-recessed relative flex-shrink-0">
              <div className="absolute top-1 left-2">
                <div className="screw-head" />
              </div>
              <div className="absolute top-1 right-2">
                <div className="screw-head" />
              </div>

              <div className="flex items-center gap-3">
                <span className="telemetry-label text-[8px]">CRT CONFIG:</span>

                {/* Toggle Color Mode (Phosphor Green vs Amber Gold) */}
                <button
                  type="button"
                  onClick={() =>
                    setScreenColor(screenColor === "green" ? "amber" : "green")
                  }
                  className="chassis-btn key-secondary px-2 py-1 text-[9px] rounded flex items-center gap-1 cursor-pointer"
                >
                  <span
                    className={`led-lamp ${screenColor === "green" ? "led-green-active" : "led-amber-active"}`}
                  />
                  <span>
                    Mode: {screenColor === "green" ? "Green" : "Amber"}
                  </span>
                </button>

                {/* Toggle Scanlines filter */}
                <button
                  type="button"
                  onClick={() => setShowScanlines(!showScanlines)}
                  className="chassis-btn key-secondary px-2 py-1 text-[9px] rounded flex items-center gap-1 cursor-pointer"
                >
                  <span
                    className={`led-lamp ${showScanlines ? "led-green-active" : ""}`}
                  />
                  <span>Scanlines</span>
                </button>
              </div>

              {/* Clear screen buffer */}
              <button
                type="button"
                onClick={() => setMessages([])}
                disabled={messages.length === 0}
                className="chassis-btn key-secondary px-2 py-1 text-[9px] rounded flex items-center gap-1 hover:text-accent disabled:opacity-40 disabled:hover:text-text-secondary cursor-pointer"
              >
                <span>Clear Screen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Input well controls */}
        <footer className="border-t border-shadow-dark bg-surface-bg p-4 flex-shrink-0 relative">
          <div className="max-w-5xl mx-auto flex flex-col gap-3">
            {error && (
              <div className="flex items-start gap-2.5 rounded bg-red-950/15 border border-red-500/20 px-4 py-2.5 text-xs text-red-700">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span className="font-mono">{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="well-recessed p-2.5 flex items-end gap-3 shadow-[inset_3px_3px_6px_var(--color-shadow-dark),inset_-3px_-3px_6px_var(--color-shadow-light)]"
            >
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask a question about this PDF..."
                rows={1}
                disabled={loading}
                onKeyDown={handleKeyDown}
                className="flex-1 resize-none bg-transparent outline-none border-0 shadow-none ring-0 p-2 text-xs font-mono placeholder:text-text-secondary text-text-primary min-h-[36px] max-h-[140px] focus:ring-0 focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="chassis-btn chassis-btn-active p-3 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Chat;
