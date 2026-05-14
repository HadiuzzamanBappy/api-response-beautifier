import { useEffect, useState } from "react";
import { Settings, ExternalLink, Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";

type Status = "idle" | "loading" | "success" | "already_beautified" | "not_json" | "error";

const Popup = () => {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const triggerBeautify = async () => {
      try {
        const response = await chrome.runtime.sendMessage({ type: "TRIGGER_BEAUTIFY" });

        if (response?.status === "SUCCESS") {
          setStatus("success");
          // Close popup after a short delay on success
          setTimeout(() => window.close(), 1500);
        } else if (response?.status === "ALREADY_BEAUTIFIED") {
          setStatus("already_beautified");
        } else if (response?.status === "NOT_JSON") {
          setStatus("not_json");
        } else {
          setStatus("error");
        }
      } catch (e) {
        setStatus("error");
      }
    };

    triggerBeautify();
  }, []);

  const renderStatus = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center gap-3 py-6 animate-in fade-in duration-500">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm font-medium text-muted-foreground">Analyzing page content...</p>
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center gap-3 py-6 animate-in zoom-in-95 duration-300">
            <div className="bg-emerald-500/10 p-3 rounded-full">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Beautified Successfully!</p>
          </div>
        );
      case "already_beautified":
        return (
          <div className="flex flex-col items-center gap-3 py-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-blue-500/10 p-3 rounded-full">
              <Info className="w-10 h-10 text-blue-500" />
            </div>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Already beautified</p>
          </div>
        );
      case "not_json":
        return (
          <div className="flex flex-col items-center gap-3 py-6 animate-in shake-in duration-300">
            <div className="bg-amber-500/10 p-3 rounded-full">
              <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400 text-center px-4">
              This page does not contain valid JSON
            </p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="bg-destructive/10 p-3 rounded-full">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <p className="text-sm font-bold text-destructive">An error occurred</p>
          </div>
        );
    }
  };

  return (
    <div className="w-[300px] bg-background text-foreground p-5 font-sans overflow-hidden rounded-[2rem]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-0.5 rounded-xl border border-primary/10 overflow-hidden shadow-sm">
          <img
            src={chrome.runtime.getURL("logo.png")}
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">API Beautifier</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-50">
            Studio Edition
          </p>
        </div>
      </div>

      <div className="bg-muted/30 rounded-3xl p-2 mb-6 border border-border/50">
        {renderStatus()}
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Settings className="w-3 h-3" />
          <span className="font-medium">v1.0.0</span>
        </div>
        <a
          href="https://github.com/HadiuzzamanBappy/api-response-beautifier"
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
        >
          DOCS <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
};

export default Popup;
