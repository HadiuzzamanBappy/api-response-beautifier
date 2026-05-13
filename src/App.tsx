import React, { useState } from "react";
import { Search, Copy, Moon, Sun, Code, FileText } from "lucide-react";
import { useJsonSearch } from "@/hooks/useJsonSearch";
import JsonNode from "./components/JsonNode";

interface AppProps {
  data: unknown;
  raw: string;
}

const App = ({ data, raw }: AppProps): React.JSX.Element => {
  // Initialize theme: Check localStorage first, then system preference
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("api-beautifier-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"pretty" | "raw">("pretty");
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  // Persistence: Save theme whenever it changes
  React.useEffect(() => {
    localStorage.setItem("api-beautifier-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Sync with system theme if user hasn't set a preference (optional, but good for "system" feel)
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-change if there's no saved preference
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

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground font-sans p-4 sm:p-8 selection:bg-primary/20">
        <header className="max-w-6xl mx-auto flex items-center justify-between mb-8 border-b pb-6 border-border/50">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20 shadow-inner">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                API Beautifier
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-2 font-medium uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {viewMode === "pretty" ? "Beautified View" : "Original Source"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-muted/50 p-1 rounded-xl border border-border mr-2">
              <button 
                onClick={() => setViewMode("pretty")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "pretty" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                PRETTY
              </button>
              <button 
                onClick={() => setViewMode("raw")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "raw" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                RAW
              </button>
            </div>
            <button 
              onClick={() => setIsDark(!isDark)}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2.5 hover:bg-accent rounded-xl border border-border shadow-sm transition-all active:scale-95"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto bg-card/30 backdrop-blur-md border border-border rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-border/50">
          <div className="p-6 bg-muted/10 border-b border-border flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keys or values..."
                className="w-full pl-11 pr-4 py-3.5 bg-background/50 border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30 shadow-sm"
              />
              {searchQuery && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-lg">
                  {matchCount} MATCHES
                </div>
              )}
            </div>
            <button 
              onClick={copyAll}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-2xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] w-full sm:w-auto"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
          
          <div className="p-8 overflow-x-auto min-h-[500px]">
             <div className="font-mono text-[13px] leading-relaxed">
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
                 <pre className="whitespace-pre-wrap break-all text-muted-foreground bg-muted/20 p-6 rounded-3xl border border-border/50">
                   {raw}
                 </pre>
               )}
             </div>
          </div>
        </main>

        <footer className="max-w-6xl mx-auto mt-8 flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
             <div className="text-[10px] font-bold text-muted-foreground/40 flex items-center gap-1.5 uppercase tracking-[0.2em]">
                <FileText className="w-3 h-3" />
                {raw.length.toLocaleString()} bytes
             </div>
             {hoveredPath && (
               <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-primary/60 uppercase tracking-[0.1em] animate-in fade-in slide-in-from-left-2">
                 <span className="w-1 h-1 rounded-full bg-primary/40"></span>
                 PATH: {hoveredPath}
               </div>
             )}
          </div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-black">
            Studio Executive Edition
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
