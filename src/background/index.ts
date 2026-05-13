async function injectAndBeautify(tabId: number) {
  try {
    // 1. Try to send a message first (in case it's already injected)
    try {
      const response = await chrome.tabs.sendMessage(tabId, { type: "BEAUTIFY_PAGE" });
      if (response?.success) return;
    } catch {
      // Message failed, need to inject
    }

    // 2. Inject JS FIRST (without CSS)
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"]
    });

    // 3. Trigger beautification check
    // We send a message. The content script will check if it's JSON.
    // If it IS JSON, it will ask the background to inject the CSS.
    chrome.tabs.sendMessage(tabId, { type: "BEAUTIFY_PAGE" });

  } catch (error) {
    console.error("Failed to inject API Beautifier:", error);
  }
}

// Listener for the content script to request CSS injection
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "INJECT_CSS" && sender.tab?.id) {
    chrome.scripting.insertCSS({
      target: { tabId: sender.tab.id },
      files: ["popup.css"]
    });
    sendResponse({ success: true });
  }

  if (message.type === "TRIGGER_BEAUTIFY") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        injectAndBeautify(tabs[0].id);
        sendResponse({ success: true });
      }
    });
    return true; 
  }
});

// Handle Keyboard Shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "beautify-page") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        injectAndBeautify(tabs[0].id);
      }
    });
  }
});
