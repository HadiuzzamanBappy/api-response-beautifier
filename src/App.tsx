import React, { useState } from "react";
import { Search, Copy, Moon, Sun, FileText, Download } from "lucide-react";
import { useJsonSearch } from "@/hooks/useJsonSearch";
import JsonNode from "@/components/JsonNode";
import logo from "@/assets/logo.png";

interface AppProps {
  data: unknown;
  raw: string;
}

const App = ({ data, raw }: AppProps): React.JSX.Element => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("api-beautifier-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"pretty" | "raw">("pretty");
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  React.useEffect(() => {
    localStorage.setItem("api-beautifier-theme", isDark ? "dark" : "light");
  }, [isDark]);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("api-beautifier-theme")) {
        setIsDark(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const { paths: searchResults, count: matchCount } = useJsonSearch(data, searchQuery);

  const copyAll = () => {
    navigator.clipboard.writeText(raw);
  };

  const downloadJson = () => {
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `response-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground font-sans p-4 sm:p-8 selection:bg-primary/20 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse delay-700"></div>

        <header className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-5">
            <div className="shadow-2xl shadow-primary/5 group transition-all hover:scale-105 active:scale-95">
              <img
                src={chrome.runtime.getURL(logo)}
                alt="API Beautifier"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                API Beautifier
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Response
                </span>
                <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest">
                  {viewMode === "pretty" ? "Beautified" : "Raw Source"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-muted/30 p-1.5 rounded-2xl border border-border/50 backdrop-blur-sm shadow-inner">
              <button
                onClick={() => setViewMode("pretty")}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === "pretty" ? "bg-background text-foreground shadow-xl ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground"}`}
              >
                PRETTY
              </button>
              <button
                onClick={() => setViewMode("raw")}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === "raw" ? "bg-background text-foreground shadow-xl ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground"}`}
              >
                RAW
              </button>
            </div>
            <div className="h-8 w-px bg-border/50 mx-1"></div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-3 bg-card hover:bg-accent rounded-2xl border border-border/50 shadow-sm transition-all active:scale-90 group"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" /> : <Moon className="w-5 h-5 text-slate-700 group-hover:-rotate-12 transition-transform" />}
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden ring-1 ring-white/10 relative">
          <div className="p-8 bg-muted/20 border-b border-border/50 flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keys or values..."
                className="w-full h-14 pl-12 pr-6 bg-background/50 border border-border/40 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-muted-foreground/20 font-medium shadow-inner"
              />
              {searchQuery && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black bg-primary text-primary-foreground px-3 py-1.5 rounded-xl shadow-lg shadow-primary/20 animate-in zoom-in-50">
                  {matchCount} MATCHES
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={copyAll}
                className="h-14 px-8 bg-primary text-primary-foreground rounded-2xl text-xs font-black hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-3 whitespace-nowrap"
              >
                <Copy className="w-4 h-4" />
                COPY ALL
              </button>
              <button
                onClick={downloadJson}
                title="Download JSON"
                className="w-14 h-14 flex items-center justify-center bg-card hover:bg-accent border border-border/50 text-muted-foreground hover:text-foreground rounded-2xl transition-all active:scale-95 shadow-sm"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-10 overflow-x-auto min-h-[600px] relative">
            <div className="font-mono text-[13px] leading-[1.8] antialiased">
              {viewMode === "pretty" ? (
                <JsonNode
                  value={data}
                  path="root"
                  depth={0}
                  searchResults={searchResults}
                  searchQuery={searchQuery}
                  onHover={setHoveredPath}
                />
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl -z-10"></div>
                  <pre className="whitespace-pre-wrap break-all text-muted-foreground/80 bg-muted/10 p-8 rounded-[2rem] border border-border/30 backdrop-blur-sm selection:bg-primary selection:text-primary-foreground">
                    {raw}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="max-w-6xl mx-auto mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 px-10 border-t border-border/20 pt-8 mb-12">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 group">
              <div className="p-2 bg-muted/30 rounded-xl border border-border/50 group-hover:bg-primary/5 transition-colors">
                <FileText className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">Payload Size</span>
                <span className="text-xs font-bold tabular-nums">{(raw.length / 1024).toFixed(2)} KB</span>
              </div>
            </div>

            {hoveredPath && (
              <div className="hidden lg:flex flex-col animate-in fade-in slide-in-from-left-4">
                <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">Current Node Path</span>
                <span className="text-xs font-bold text-primary/80 truncate max-w-[300px]">
                  {hoveredPath.replace("root.", "").replace("root", "ROOT")}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="h-10 w-px bg-border/20 hidden sm:block"></div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/20 font-black">
              Studio Executive Edition v1.0.0
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
