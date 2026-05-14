import React, { useState } from "react";
import { ChevronRight, ChevronDown, Copy, Hash } from "lucide-react";
import { cn } from "@/utils/cn";

interface JsonNodeProps {
  label?: string;
  value: unknown;
  path: string;
  depth: number;
  searchResults?: Set<string>;
  searchQuery?: string;
  onHover?: (path: string | null) => void;
}

const JsonNode = ({ label, value, path, depth, searchResults, searchQuery, onHover }: JsonNodeProps): React.JSX.Element => {
  const [isCollapsed, setIsCollapsed] = useState(depth > 2);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  const isMatch = searchResults?.has(path);

  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    if (searchQuery && isMatch) {
      setIsCollapsed(false);
    }
  }

  const type = typeof value;
  const isObject = value !== null && type === "object";
  const isArray = Array.isArray(value);

  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() 
        ? <span key={i} className="bg-primary text-primary-foreground px-1 rounded-sm font-bold shadow-sm">{part}</span> 
        : part
    );
  };

  const renderValue = (): React.JSX.Element => {
    if (value === null) return <span className="json-token-null font-black uppercase text-[10px]">null</span>;
    if (type === "string") return <span className="json-token-string">"{highlightText(value as string)}"</span>;
    if (type === "number") return <span className="json-token-number font-bold">{highlightText(String(value))}</span>;
    if (type === "boolean") return <span className="json-token-boolean font-black uppercase text-[10px] tracking-widest">{String(value)}</span>;
    return <span>{String(value)}</span>;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isObject) {
    const typedValue = value as Record<string, unknown>;
    const keys = Object.keys(typedValue);
    const isEmpty = keys.length === 0;

    return (
      <div 
        className={cn("ml-2 py-1", depth > 0 && "ml-5 border-l-2 border-border/20 pl-6 transition-all hover:border-primary/40")}
        onMouseEnter={(e) => { e.stopPropagation(); onHover?.(path); }}
        onMouseLeave={() => onHover?.(null)}
      >
        <div 
          className="flex items-center gap-3 cursor-pointer group hover:bg-primary/5 rounded-[0.75rem] px-3 py-1.5 transition-all duration-300"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isEmpty && (
            <div className="text-muted-foreground/40 group-hover:text-primary transition-colors duration-300">
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          )}
          
          <div className="flex items-center gap-2 overflow-hidden">
            {label && (
              <span className="json-token-key font-bold whitespace-nowrap text-[13px] tracking-tight">
                {highlightText(label)}
              </span>
            )}
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.15em] bg-muted/40 text-muted-foreground/60 px-2 py-0.5 rounded-full border border-border/30">
              {isArray ? (
                <>
                  <Hash className="w-2.5 h-2.5" />
                  ARRAY[{keys.length}]
                </>
              ) : (
                "OBJECT"
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-auto translate-x-2 group-hover:translate-x-0">
            <button 
              onClick={(e) => { e.stopPropagation(); copyToClipboard(path); }}
              title={`Copy path: ${path}`}
              className="p-1.5 bg-background shadow-sm hover:bg-primary hover:text-primary-foreground rounded-lg transition-all active:scale-90"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        {!isCollapsed && !isEmpty && (
          <div className="mt-2 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-300">
            {keys.map((key) => (
              <JsonNode 
                key={key} 
                label={key} 
                value={typedValue[key]} 
                path={path === "root" ? key : `${path}.${key}`} 
                depth={depth + 1} 
                searchResults={searchResults}
                searchQuery={searchQuery}
                onHover={onHover}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className="ml-5 border-l-2 border-border/20 pl-6 py-1.5 group flex items-center gap-3 hover:bg-primary/5 rounded-[0.75rem] px-3 transition-all duration-300"
      onMouseEnter={(e) => { e.stopPropagation(); onHover?.(path); }}
      onMouseLeave={() => onHover?.(null)}
    >
      {label && <span className="json-token-key font-bold text-[13px] tracking-tight whitespace-nowrap">{highlightText(label)}</span>}
      <div className="font-mono text-[13px] tracking-tight">{renderValue()}</div>
      
      <button 
        onClick={() => copyToClipboard(String(value))}
        title="Copy value"
        className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-1.5 bg-background shadow-sm hover:bg-primary hover:text-primary-foreground rounded-lg ml-auto translate-x-2 group-hover:translate-x-0 active:scale-90"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default JsonNode;
