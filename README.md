# AI-Powered Code Review Assistant

A modern web application that enables developers to get AI-powered code review feedback on specific code selections using Anthropic's Claude AI.

## Features

✨ **Intelligent Code Review** - Get contextual feedback from Claude AI on selected code
📝 **Multi-threaded Conversations** - Create and manage multiple independent review threads
🎨 **Monaco Editor** - Industry-standard code editor with syntax highlighting
🌊 **Streaming AI Responses** - Real-time streaming for immediate feedback
🎯 **Context-Aware** - AI receives surrounding code context for better understanding
🎨 **Dark Theme** - Beautiful dark theme optimized for developers
💾 **Local Storage** - All data stays in your browser (privacy-first)

## Tech Stack

- **Frontend**: React 18.3 + TypeScript 5.6
- **Build Tool**: Vite 6.x
- **Styling**: Tailwind CSS 3.4
- **Code Editor**: Monaco Editor 0.52 (VSCode engine)
- **State Management**: Zustand 5.0
- **AI Integration**: Anthropic Claude 3.5 Sonnet via official SDK
- **Type Safety**: Strict TypeScript mode enabled

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

Preview the production build locally:
```bash
npm run preview
```

## Usage

### Basic Workflow

1. **Paste or type code** into the Monaco editor
2. **Select lines** you want to review by clicking line numbers (hold Shift to select multiple)
3. **Click "Ask AI"** button that appears in the thread panel
4. **Type your question** about the selected code
5. **Get streaming AI feedback** with suggestions and improvements
6. **Continue conversation** with follow-up questions

### Thread Management

- **Create threads** on specific code ranges
- **Multiple threads** - Up to 50 independent threads
- **Color-coded** - 8 distinct colors for easy identification
- **Resolve threads** - Mark conversations as complete
- **Delete threads** - Remove threads you no longer need

## Configuration

Access settings via the ⚙️ icon in the header:

- **API Key**: Your Anthropic API key
- **Font Size**: 10-24px (default: 14px)
- **Context Lines**: 5-50 lines (default: 10)

Settings are persisted in browser localStorage.

## Security Considerations

⚠️ **Important**: This is a client-side application. API keys are stored in your browser and should be **your personal keys only**, not shared team keys.

## Architecture

This application follows the architecture defined in `docs/architecture.md`:

- **Component-Based**: Modular React components
- **Type-Safe**: Complete TypeScript coverage
- **State Management**: Zustand stores for editor, threads, and configuration
- **AI Service Layer**: Abstracted Anthropic API client with streaming

## License

MIT License

---

**Note**: This application was implemented as part of the BMad Method demonstration, showcasing AI-assisted software development.
