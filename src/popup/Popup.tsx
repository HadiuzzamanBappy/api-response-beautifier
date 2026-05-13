import { Sparkles, Settings, ExternalLink } from "lucide-react";

const Popup = () => {
  const handleBeautify = async () => {
    chrome.runtime.sendMessage({ type: "TRIGGER_BEAUTIFY" });
    window.close();
  };

  return (
    <div className="w-[300px] bg-background text-foreground p-5 font-sans overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-xl border border-primary/20">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-lg font-bold tracking-tight">API Beautifier</h1>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleBeautify}
          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
        >
          Beautify Current Page
        </button>

        <p className="text-[10px] text-muted-foreground text-center px-4">
          Click above if the page contains JSON but wasn't auto-detected.
        </p>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Settings className="w-3 h-3" />
            <span>v1.0.0</span>
          </div>
          <a
            href="https://github.com/HadiuzzamanBappy"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
          >
            DOCS <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Popup;
