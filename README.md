# 💎 API Response Beautifier (Studio Executive Edition)

A premium, high-performance Chrome extension that transforms raw JSON API responses into a stunning, interactive, and type-safe tree view. Built with **React 19**, **TypeScript**, and **Tailwind CSS**.

![Extension Preview](public/icons/icon-128.png)

## 🚀 Features

### 🌲 Interactive JSON Tree

* **Recursive Rendering**: Handles infinite JSON depth with high performance.
* **Type-Aware Highlighting**: Different color palettes for Strings, Numbers, Booleans, and Nulls.
* **Collapsible Nodes**: Quickly collapse/expand objects and arrays to stay focused.

### 🔍 Advanced Search & Navigation

* **Real-time Filtering**: Highlight matches across keys and values as you type.
* **Auto-Expansion**: Search automatically expands the branches where matches are found.
* **Live Match Count**: Stay informed about the total number of search results.

### 📍 Intelligent Path Tracking

* **Hover-to-Path**: Mouse over any key to see the full JSON path (e.g., `root.user.data[0].id`) in the status bar.
* **Copy Logic**: Copy raw JSON, specific values, or object paths with a single click.

### 🌗 Premium UI/UX

* **System-Aware Theme**: Automatically syncs with your OS Dark/Light mode.
* **Theme Persistence**: Remembers your preferred theme across sessions.
* **Glassmorphic Design**: A sleek, modern aesthetic with subtle micro-animations.
* **Raw Mode Toggle**: Switch back to original source text instantly whenever needed.

## 🛠️ Technical Stack

* **Frontend**: React 19 + TypeScript
* **Styling**: Tailwind CSS + Lucide Icons
* **Build Tool**: Vite 6 (Optimized for Extension Interception)
* **Architecture**: Content-Script Injection at `document_start`

## 📦 Installation

### Development Setup

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

### Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top right toggle).
3. Click **Load unpacked**.
4. Select the `dist` folder in this project directory.

## 🎯 Usage

Simply visit any URL that returns an `application/json` or `text/plain` payload. The extension will automatically detect the content and beautify it for you.

---
**Built for developers who demand a premium debugging experience.**
