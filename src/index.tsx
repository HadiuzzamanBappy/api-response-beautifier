import { createRoot } from "react-dom/client";
import App from "@/App";
import "@/index.css";

const MAX_JSON_SIZE = 2 * 1024 * 1024; // 2MB limit for performance

function init() {
  const isJsonType = document.contentType === "application/json";
  const isPlainText = document.contentType === "text/plain";
  const rawContent = document.body.innerText.trim();

  // Basic check: Must exist and have a minimum length
  if (!rawContent || rawContent.length < 2) return;

  // Size check to prevent browser freeze
  if (rawContent.length > MAX_JSON_SIZE) {
    console.debug("API Beautifier: File too large to beautify (>2MB), skipping.");
    return;
  }

  // Sniffing: If it's text/plain, only proceed if it looks like JSON
  if (isPlainText) {
    const looksLikeJson = (rawContent.startsWith("{") && rawContent.endsWith("}")) || 
                          (rawContent.startsWith("[") && rawContent.endsWith("]"));
    if (!looksLikeJson) return;
  } else if (!isJsonType) {
    return;
  }

  try {
    // Validate JSON
    const parsed = JSON.parse(rawContent);

    // Replace the entire body with our React app
    const rootContainer = document.createElement("div");
    rootContainer.id = "api-beautifier-root";

    // Clear original content
    document.body.innerHTML = "";
    document.body.appendChild(rootContainer);

    // Add a class for styling isolation if needed
    document.body.classList.add("api-beautifier-injected");

    const root = createRoot(rootContainer);
    root.render(<App data={parsed} raw={rawContent} />);
  } catch (e) {
    // If parsing fails (not valid JSON after all), we do nothing and leave the original view
    console.debug("API Beautifier: Content is not valid JSON, skipping.", e);
  }
}

// Some browsers might need a slight delay or wait for DOM
if (document.readyState === "complete") {
  init();
} else {
  window.addEventListener("load", init);
}
