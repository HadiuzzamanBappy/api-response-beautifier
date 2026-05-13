import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const MAX_JSON_SIZE = 2 * 1024 * 1024; // 2MB limit for performance

async function init(force = false) {
  // Ensure body exists (important for document_start)
  if (!document.body) return;

  // If already injected, don't do it again
  if (document.getElementById("api-beautifier-root")) return;

  const isJsonType = document.contentType === "application/json";
  const isPlainText = document.contentType === "text/plain";
  const rawContent = document.body.innerText ? document.body.innerText.trim() : "";

  // Basic check: Must exist and have a minimum length
  if (!rawContent || rawContent.length < 2) return;

  // Size check to prevent browser freeze
  if (rawContent.length > MAX_JSON_SIZE) {
    console.debug("API Beautifier: File too large to beautify (>2MB), skipping.");
    return;
  }

  // Sniffing logic
  if (!force) {
    if (isJsonType) {
      // Auto-run on explicit JSON
    } else if (isPlainText) {
      // Only auto-run on plain text if it strictly looks like a JSON object/array
      const looksLikeJson = (rawContent.startsWith("{") && rawContent.endsWith("}")) ||
        (rawContent.startsWith("[") && rawContent.endsWith("]"));
      if (!looksLikeJson) return;
    } else {
      // Don't auto-run on HTML or other types
      return;
    }
  }

  try {
    // Validate JSON
    const parsed = JSON.parse(rawContent);

    // If valid JSON, request CSS injection from background
    await chrome.runtime.sendMessage({ type: "INJECT_CSS" });

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
    if (force) {
      alert("API Beautifier: This page does not contain valid JSON.");
    }
    console.debug("API Beautifier: Content is not valid JSON, skipping.", e);
  }
}

// Listen for manual trigger from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "BEAUTIFY_PAGE") {
    init(true);
    sendResponse({ success: true });
  }
});

