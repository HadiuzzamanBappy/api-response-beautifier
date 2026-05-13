import React, { useState } from "react";
import { ChevronRight, ChevronDown, Copy } from "lucide-react";
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

  // Auto-expand on search match during render (official React pattern)
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
        ? <span key={i} className="bg-yellow-400/30 text-yellow-600 dark:text-yellow-300 px-0.5 rounded">{part}</span> 
        : part
    );
  };

  const renderValue = (): React.JSX.Element => {
    if (value === null) return <span className="text-muted-foreground/60">null</span>;
    if (type === "string") return <span className="text-emerald-500 dark:text-emerald-400">"{highlightText(value as string)}"</span>;
    if (type === "number") return <span className="text-blue-500 dark:text-blue-400">{highlightText(String(value))}</span>;
    if (type === "boolean") return <span className="text-violet-500 dark:text-violet-400">{String(value)}</span>;
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
        className={cn("ml-2 py-0.5", depth > 0 && "ml-4 border-l border-border/50 pl-4")}
        onMouseEnter={(e) => { e.stopPropagation(); onHover?.(path); }}
        onMouseLeave={() => onHover?.(null)}
      >
        <div 
          className="flex items-center gap-2 cursor-pointer group hover:bg-accent/50 rounded-lg px-2 py-1 transition-all duration-200"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isEmpty && (
            <div className="text-muted-foreground group-hover:text-foreground transition-colors">
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          )}
          
          <div className="flex items-center gap-1.5 overflow-hidden">
            {label && (
              <span className="text-primary font-semibold whitespace-nowrap">
                {highlightText(label)}:
              </span>
            )}
            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider whitespace-nowrap bg-muted/50 px-1.5 py-0.5 rounded">
              {isArray ? `Array(${keys.length})` : `Object`}
            </span>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto pl-4">
            <button 
              onClick={(e) => { e.stopPropagation(); copyToClipboard(path); }}
              title={`Copy path: ${path}`}
              className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-primary transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        {!isCollapsed && !isEmpty && (
          <div className="mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
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
      className="ml-4 border-l border-border/50 pl-4 py-0.5 group flex items-center gap-2 hover:bg-accent/30 rounded-lg px-2 transition-all duration-200"
      onMouseEnter={(e) => { e.stopPropagation(); onHover?.(path); }}
      onMouseLeave={() => onHover?.(null)}
    >
      {label && <span className="text-primary/90 font-medium whitespace-nowrap">{highlightText(label)}:</span>}
      <div className="font-mono break-all">{renderValue()}</div>
      
      <button 
        onClick={() => copyToClipboard(String(value))}
        title="Copy value"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded text-muted-foreground hover:text-primary ml-auto"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default JsonNode;
