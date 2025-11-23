# Architecture Document - AI-Powered Code Review Assistant

## Executive Summary

This architecture defines a modern, component-based web application that enables developers to get AI-powered code review feedback on specific code selections. The system uses React with TypeScript for the frontend, Monaco Editor for code editing capabilities, and integrates with Anthropic's Claude API for intelligent code analysis. The architecture prioritizes developer experience, maintainability, and clear separation of concerns to enable consistent implementation by AI agents.

## Project Initialization

This project uses Vite as the build tool for optimal development experience and performance.

**First Implementation Story: Project Initialization**

```bash
npm create vite@latest ai-code-review-assistant -- --template react-ts
cd ai-code-review-assistant
npm install
```

This establishes the base architecture with:
- React 18.x (latest stable)
- TypeScript for type safety
- Vite for fast development and optimized builds
- ESLint for code quality

## Decision Summary

| Category | Decision | Version | Rationale | Provided By |
|----------|----------|---------|-----------|-------------|
| Framework | React | 18.3.x | Component-based architecture, excellent ecosystem, Monaco integration | Starter |
| Language | TypeScript | 5.6.x | Type safety critical for complex state management, better DX | Starter |
| Build Tool | Vite | 6.x | Fast HMR, optimized builds, modern tooling | Starter |
| Code Editor | Monaco Editor | 0.52.x | Industry-standard, VSCode engine, excellent language support | Manual |
| UI Library | Tailwind CSS | 3.4.x | Utility-first, rapid development, consistent styling | Manual |
| State Management | Zustand | 5.0.x | Lightweight, simple API, TypeScript support | Manual |
| AI API | Anthropic Claude | 3.x SDK | Superior code understanding, streaming support | Manual |
| HTTP Client | Anthropic SDK | Built-in | Official SDK with streaming, retries, type safety | Manual |
| Routing | React Router | 6.x | Standard routing solution, code splitting support | Manual |
| Testing | Vitest + Testing Library | Latest | Vite integration, fast, React best practices | Manual |
| Code Quality | ESLint + Prettier | Latest | Consistent code style, catch errors | Starter |
| Deployment | Vercel | N/A | Zero-config Next.js/Vite support, edge network | Manual |

## Technology Stack Details

### Core Technologies

**Frontend Framework: React 18.3.x**
- Component-based architecture for reusable UI elements
- Hooks for state and lifecycle management
- Context API for theme and configuration sharing
- Concurrent features for improved UX

**TypeScript 5.6.x**
- Strict mode enabled for maximum type safety
- Interfaces for all data models
- Type guards for runtime validation
- Utility types for DRY code

**Monaco Editor 0.52.x (@monaco-editor/react)**
- Full-featured code editor with syntax highlighting
- Language services for autocomplete and validation
- Custom decorations for comment threads
- Selection and range management APIs
- Support for 100+ programming languages

**State Management: Zustand 5.0.x**
- Single store for code content and editor state
- Separate store for comment threads
- Middleware for localStorage persistence
- DevTools integration for debugging

**Styling: Tailwind CSS 3.4.x**
- Utility-first approach for rapid UI development
- Custom design tokens for consistency
- Dark mode support via class strategy
- Component extraction for complex patterns

**AI Integration: Anthropic Claude API**
- SDK: @anthropic-ai/sdk v0.30.x
- Model: claude-3-5-sonnet (latest)
- Streaming responses for better UX
- Prompt engineering for code context

### Development Tools

**Build & Dev Server: Vite 6.x**
- Lightning-fast HMR (<50ms)
- Optimized production builds
- Code splitting by route
- Asset optimization

**Testing Framework: Vitest + React Testing Library**
- Unit tests for utilities and hooks
- Component tests for UI elements
- Integration tests for workflows
- E2E with Playwright (future)

**Code Quality**
- ESLint with TypeScript support
- Prettier for formatting
- Husky for pre-commit hooks
- Conventional commits

## Project Structure

```
ai-code-review-assistant/
├── public/
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── editor/
│   │   │   ├── CodeEditor.tsx          # Monaco editor wrapper
│   │   │   ├── EditorToolbar.tsx       # Actions (language select, theme)
│   │   │   ├── SelectionHighlighter.tsx # Visual selection indicators
│   │   │   └── LineGutter.tsx          # Custom gutter with thread markers
│   │   ├── threads/
│   │   │   ├── ThreadPanel.tsx         # Container for all threads
│   │   │   ├── ThreadItem.tsx          # Single thread display
│   │   │   ├── ThreadMessage.tsx       # Individual message (user/AI)
│   │   │   ├── ThreadInput.tsx         # User input for new messages
│   │   │   └── ThreadMarker.tsx        # Inline marker in gutter
│   │   ├── ui/
│   │   │   ├── Button.tsx              # Reusable button component
│   │   │   ├── Input.tsx               # Form input component
│   │   │   ├── Select.tsx              # Dropdown component
│   │   │   ├── Card.tsx                # Container component
│   │   │   ├── Badge.tsx               # Status/label component
│   │   │   ├── LoadingSpinner.tsx      # Loading states
│   │   │   └── ErrorBoundary.tsx       # Error handling wrapper
│   │   └── layout/
│   │       ├── AppLayout.tsx           # Main layout wrapper
│   │       ├── Header.tsx              # App header
│   │       └── Sidebar.tsx             # Thread list sidebar
│   ├── hooks/
│   │   ├── useEditor.ts                # Monaco editor management
│   │   ├── useSelection.ts             # Code selection tracking
│   │   ├── useThreads.ts               # Thread CRUD operations
│   │   ├── useAI.ts                    # AI API interactions
│   │   └── useLocalStorage.ts          # Persistence helper
│   ├── store/
│   │   ├── editorStore.ts              # Code content, language, theme
│   │   ├── threadStore.ts              # Threads and messages
│   │   └── configStore.ts              # API keys, preferences
│   ├── services/
│   │   ├── ai/
│   │   │   ├── anthropicClient.ts      # Claude API wrapper
│   │   │   ├── promptBuilder.ts        # Context-aware prompts
│   │   │   └── streamHandler.ts        # Streaming response handler
│   │   └── storage/
│   │       ├── localStorage.ts         # Browser storage wrapper
│   │       └── persistence.ts          # State serialization
│   ├── types/
│   │   ├── editor.ts                   # Editor-related types
│   │   ├── thread.ts                   # Thread and message types
│   │   ├── ai.ts                       # AI request/response types
│   │   └── index.ts                    # Exported type aggregation
│   ├── utils/
│   │   ├── codeContext.ts              # Extract surrounding context
│   │   ├── rangeHelpers.ts             # Monaco range utilities
│   │   ├── languageDetection.ts        # Auto-detect language
│   │   └── validation.ts               # Input validation
│   ├── config/
│   │   ├── constants.ts                # App-wide constants
│   │   ├── monaco.ts                   # Monaco configuration
│   │   └── theme.ts                    # Tailwind theme config
│   ├── App.tsx                          # Root component
│   ├── main.tsx                         # Entry point
│   └── index.css                        # Global styles
├── tests/
│   ├── unit/
│   │   ├── utils/
│   │   └── hooks/
│   ├── integration/
│   │   └── workflows/
│   └── setup.ts
├── .env.example                         # Environment template
├── .env.local                           # Local environment (gitignored)
├── .gitignore
├── .prettierrc
├── .eslintrc.cjs
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Functional Requirement to Architecture Mapping

Based on the PROJECT_OVERVIEW.md requirements:

| Requirement | Implementation Location | Components |
|-------------|------------------------|------------|
| Code editor interface | `src/components/editor/` | CodeEditor, EditorToolbar |
| Syntax highlighting | Monaco Editor (built-in) | CodeEditor with language support |
| Selection-based interaction | `src/hooks/useSelection.ts` | SelectionHighlighter, useEditor |
| Contextual AI responses | `src/services/ai/` | anthropicClient, promptBuilder |
| Inline conversation threads | `src/components/threads/` | ThreadPanel, ThreadItem, ThreadMarker |
| Multiple conversation threads | `src/store/threadStore.ts` | Thread state management, unique IDs |
| Language detection | `src/utils/languageDetection.ts` | Auto-detect from file extension/content |
| AI API integration | `src/services/ai/` | Anthropic SDK wrapper with streaming |

## Data Architecture

### Core Data Models

**CodeDocument**
```typescript
interface CodeDocument {
  id: string;                    // UUID
  content: string;                // Full code content
  language: string;               // Monaco language ID
  fileName?: string;              // Optional file name
  createdAt: Date;
  updatedAt: Date;
}
```

**CodeSelection**
```typescript
interface CodeSelection {
  startLine: number;              // 1-based line number
  startColumn: number;            // 1-based column
  endLine: number;
  endColumn: number;
  selectedText: string;           // Extracted text
  contextBefore: string;          // Lines before selection
  contextAfter: string;           // Lines after selection
}
```

**Thread**
```typescript
interface Thread {
  id: string;                     // UUID
  documentId: string;             // Reference to CodeDocument
  selection: CodeSelection;       // Original code selection
  messages: Message[];            // Conversation history
  status: 'active' | 'resolved';  // Thread state
  createdAt: Date;
  updatedAt: Date;
}
```

**Message**
```typescript
interface Message {
  id: string;                     // UUID
  threadId: string;               // Parent thread reference
  role: 'user' | 'assistant';     // Message sender
  content: string;                // Message text
  timestamp: Date;
  metadata?: {
    model?: string;               // AI model used
    tokens?: number;              // Token count
    streamComplete?: boolean;     // Streaming status
  };
}
```

**AppConfig**
```typescript
interface AppConfig {
  apiKey: string;                 // Anthropic API key (encrypted in storage)
  theme: 'light' | 'dark';        // UI theme
  editorTheme: string;            // Monaco theme name
  defaultLanguage: string;        // Default code language
  maxContextLines: number;        // Context window size (default: 10)
  autoSave: boolean;              // Auto-save to localStorage
}
```

### State Management Structure

**Editor Store (Zustand)**
```typescript
interface EditorStore {
  // State
  document: CodeDocument | null;
  currentSelection: CodeSelection | null;

  // Actions
  setDocument: (doc: CodeDocument) => void;
  updateContent: (content: string) => void;
  setSelection: (selection: CodeSelection | null) => void;
  setLanguage: (language: string) => void;
  reset: () => void;
}
```

**Thread Store (Zustand)**
```typescript
interface ThreadStore {
  // State
  threads: Thread[];
  activeThreadId: string | null;

  // Actions
  createThread: (selection: CodeSelection) => Thread;
  addMessage: (threadId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  setActiveThread: (threadId: string | null) => void;
  resolveThread: (threadId: string) => void;
  deleteThread: (threadId: string) => void;
  getThreadsByLine: (lineNumber: number) => Thread[];
}
```

**Config Store (Zustand)**
```typescript
interface ConfigStore {
  // State
  config: AppConfig;

  // Actions
  setApiKey: (key: string) => void;
  updateConfig: (updates: Partial<AppConfig>) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}
```

### Data Flow

1. **Code Input Flow**
   - User types/pastes code → EditorStore.updateContent()
   - Content persisted to localStorage
   - Monaco editor updates with new content

2. **Selection to Thread Flow**
   - User selects code → useSelection hook captures range
   - User clicks "Ask AI" → ThreadStore.createThread()
   - Selection stored with context (lines before/after)
   - Thread panel shows new thread

3. **AI Interaction Flow**
   - User types message → ThreadStore.addMessage() (user message)
   - useAI hook builds prompt with code context
   - Anthropic API call with streaming
   - Stream chunks → ThreadStore.updateMessage() (AI message)
   - Completion → Mark message as complete

4. **Persistence Flow**
   - All store changes → Zustand middleware
   - Debounced write to localStorage
   - On app load → Restore from localStorage

## AI Integration Architecture

### Prompt Engineering Strategy

**Prompt Template**
```
You are a code review assistant. Analyze the following code and provide feedback.

LANGUAGE: {language}

FULL CODE:
{fullCodeContent}

SELECTED CODE (lines {startLine}-{endLine}):
{selectedText}

CONTEXT BEFORE:
{contextBefore}

CONTEXT AFTER:
{contextAfter}

USER QUESTION:
{userMessage}

CONVERSATION HISTORY:
{previousMessages}

Provide specific, actionable feedback focusing on:
- Code quality and best practices
- Potential bugs or issues
- Performance considerations
- Suggestions for improvement

Be concise and reference specific line numbers when applicable.
```

### API Client Architecture

**Service Layer: anthropicClient.ts**
```typescript
class AnthropicService {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async *streamCodeReview(request: CodeReviewRequest): AsyncGenerator<string> {
    const prompt = buildPrompt(request);

    const stream = await this.client.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        yield chunk.delta.text;
      }
    }
  }

  // Non-streaming fallback
  async getCodeReview(request: CodeReviewRequest): Promise<string> {
    // Implementation with full response
  }
}
```

### Error Handling & Fallbacks

**API Error Strategy**
1. Network errors → Retry with exponential backoff (3 attempts)
2. Rate limiting → Show user-friendly message, suggest retry
3. Invalid API key → Prompt for new key
4. Quota exceeded → Clear error message with upgrade link
5. Timeout → Cancel stream, allow retry

**Fallback Responses**
- If streaming fails mid-response, preserve partial content
- Allow user to regenerate response
- Store failed requests for retry

### Security - API Key Management

**Storage Strategy**
1. API key never committed to git (.env.local in .gitignore)
2. Keys stored in localStorage with base64 encoding (obfuscation, not encryption)
3. Option to use environment variable for deployment
4. Clear warning about client-side storage limitations
5. Recommend proxy pattern for production

**Recommended Production Pattern**
```
Frontend → Your Backend Proxy → Anthropic API
           (adds auth, rate limiting, key rotation)
```

## Component Architecture

### Editor Component Hierarchy

```
<CodeEditor>
  ├── <EditorToolbar>
  │   ├── Language selector
  │   ├── Theme toggle
  │   └── Clear button
  ├── <Monaco Editor>
  │   └── Custom decorations for thread ranges
  └── <SelectionHighlighter>
      └── Visual indicators for active selection
```

### Thread System Architecture

```
<AppLayout>
  ├── <Header />
  ├── <CodeEditor /> (left 60%)
  └── <ThreadPanel> (right 40%)
      ├── <ThreadList>
      │   └── [<ThreadItem> ...]
      │       ├── Code snippet preview
      │       ├── <ThreadMessage> (user)
      │       ├── <ThreadMessage> (AI)
      │       └── <ThreadInput>
      └── <NewThreadButton>
```

### State Synchronization

**Thread ↔ Editor Sync**
1. Thread selection → Highlight in editor
2. Click thread → Scroll editor to selection
3. Click line in editor → Show associated threads
4. Delete code range → Optionally resolve threads

## Implementation Patterns

### Naming Conventions

**Files & Components**
- React components: PascalCase (e.g., `CodeEditor.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useSelection.ts`)
- Utilities: camelCase (e.g., `codeContext.ts`)
- Types: PascalCase (e.g., `Thread.ts`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `MAX_CONTEXT_LINES`)

**Code Style**
- Interfaces for object shapes (prefer over types for extensibility)
- Named exports (no default exports except for components)
- Descriptive variable names (avoid abbreviations)
- Comments for "why", not "what"

**API & Data**
- REST-like naming for services: `getThreads()`, `createThread()`, `updateThread()`
- Async functions with `async/await` (no raw promises)
- Error objects with `{ error: string; code: string }` structure

### File Organization

**Co-location Strategy**
- Tests next to source: `CodeEditor.test.tsx` alongside `CodeEditor.tsx`
- Types in dedicated folder but mirrored structure
- One component per file (except tightly coupled sub-components)

**Import Order**
1. React & external libraries
2. Internal components
3. Hooks
4. Utils & helpers
5. Types
6. Styles

### Error Handling Pattern

**Global Error Boundary**
```typescript
<ErrorBoundary fallback={<ErrorScreen />}>
  <App />
</ErrorBoundary>
```

**Component-Level Errors**
```typescript
try {
  await aiService.getReview(request);
} catch (error) {
  if (error instanceof AnthropicError) {
    // Handle API-specific errors
  }
  throw new AppError('Failed to get AI review', { cause: error });
}
```

### Loading States

**Standard Pattern**
```typescript
const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
```

**AI Streaming State**
```typescript
const [streamState, setStreamState] = useState<{
  status: 'idle' | 'streaming' | 'complete' | 'error';
  content: string;
  error?: string;
}>({ status: 'idle', content: '' });
```

### Consistency Rules

**Date Handling**
- All dates stored as ISO 8601 strings
- Display with `Intl.DateTimeFormat` for localization
- Relative time for recent items (<24h): "2 minutes ago"

**Logging Strategy**
```typescript
// Development: console with context
console.log('[ThreadStore] Creating thread:', { selection, threadId });

// Production: Structured logging service (future)
logger.info('thread.created', { threadId, userId, timestamp });
```

**Component Props Pattern**
```typescript
interface ComponentProps {
  // Required props first
  id: string;
  content: string;

  // Optional props
  className?: string;
  onAction?: () => void;

  // Children last
  children?: React.ReactNode;
}
```

## Testing Strategy

### Test Coverage Targets

**Unit Tests (80% coverage)**
- All utility functions (100%)
- All hooks (90%)
- Store actions and state updates (90%)
- Prompt builder logic (100%)

**Component Tests (60% coverage)**
- User interactions (click, type, select)
- Conditional rendering
- Error states
- Loading states

**Integration Tests (Key Flows)**
- Complete code review workflow
- Thread creation and conversation
- State persistence and restoration
- Error recovery

### Testing Patterns

**Hook Testing**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useThreads } from './useThreads';

test('creates thread with selection', () => {
  const { result } = renderHook(() => useThreads());

  act(() => {
    result.current.createThread(mockSelection);
  });

  expect(result.current.threads).toHaveLength(1);
  expect(result.current.threads[0].selection).toEqual(mockSelection);
});
```

**Component Testing**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeEditor } from './CodeEditor';

test('shows selection toolbar on code selection', async () => {
  render(<CodeEditor />);

  // Simulate code selection
  const editor = screen.getByRole('textbox');
  fireEvent.select(editor, { startLine: 1, endLine: 3 });

  expect(screen.getByText('Ask AI')).toBeInTheDocument();
});
```

**Mock Strategy**
- Mock Anthropic API with MSW (Mock Service Worker)
- Mock Monaco Editor with lightweight fake
- Mock localStorage with in-memory implementation

## Performance Considerations

### Code Splitting

**Route-based Splitting**
```typescript
const App = lazy(() => import('./App'));
const Settings = lazy(() => import('./pages/Settings'));
```

**Component Splitting**
- Monaco Editor lazy-loaded (large bundle)
- AI service loaded on first use
- Thread history virtualized for large lists

### Optimization Strategies

**Monaco Performance**
- Debounce content updates (300ms)
- Limit decorations to visible range
- Use worker for large files (>10k lines)

**State Updates**
- Immer for immutable updates in Zustand
- Selective subscriptions to store slices
- Memoization for expensive computations

**Network Optimization**
- Stream AI responses (perceived performance)
- Batch thread updates to localStorage
- Cancel in-flight requests on navigation

### Memory Management

**Large Code Files**
- Virtual scrolling for files >5000 lines
- Truncate context to 50 lines before/after
- Clear old threads after 7 days (configurable)

**Thread Management**
- Archive old threads to separate storage
- Limit active threads to 50
- Warn user when approaching limits

## Security Architecture

### API Key Security

**Client-Side Considerations**
⚠️ **Important**: This is a client-side application. API keys stored in browser are accessible to users and should only be their personal keys, not shared team keys.

**Storage Approach**
```typescript
// Obfuscation (not encryption) for localStorage
const storeApiKey = (key: string) => {
  const encoded = btoa(key); // Base64 encode
  localStorage.setItem('ai_code_review_api_key', encoded);
};
```

**Production Recommendations**
1. Use backend proxy for enterprise deployments
2. Implement rate limiting per user
3. Use environment variables for deployment
4. Add API key rotation support
5. Monitor for leaked keys

### Input Validation

**Code Content**
- Sanitize before display (XSS prevention)
- Limit file size to 1MB
- Validate language selection against whitelist

**User Messages**
- Limit message length to 2000 characters
- Strip HTML/script tags
- Rate limit API calls (max 10/minute)

### Data Privacy

**Local-First Approach**
- All data stored in browser (localStorage)
- No backend database
- Code never leaves user's machine except to AI API
- Clear data option in settings

**GDPR Considerations**
- User controls all data (can export/delete)
- No tracking or analytics by default
- API calls log minimal data (Anthropic's privacy policy applies)

## Deployment Architecture

### Build Configuration

**Production Build**
```bash
npm run build
# Generates optimized build in dist/

# Build stats:
# - Code splitting by route
# - Tree shaking enabled
# - Minification + compression
# - Source maps for debugging
```

**Environment Variables**
```
# .env.local (development)
VITE_ANTHROPIC_API_KEY=sk-ant-...

# .env.production (optional proxy endpoint)
VITE_API_ENDPOINT=https://your-proxy.com/api
```

### Deployment Platforms

**Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

**Configuration**: `vercel.json`
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

**Alternative Platforms**
- Netlify: Zero-config Vite support
- GitHub Pages: Static hosting (requires base path config)
- Cloudflare Pages: Edge deployment
- AWS S3 + CloudFront: Enterprise option

### Environment Setup

**Static Hosting Requirements**
- Single-page application (SPA) routing
- Redirect all routes to index.html
- CORS headers for API calls
- HTTPS required (for localStorage security)

**CDN Configuration**
- Cache static assets (js, css) for 1 year
- Cache index.html for 0 seconds (no cache)
- Gzip/Brotli compression enabled

## Development Environment

### Prerequisites

```bash
# Required
Node.js >= 18.0.0
npm >= 9.0.0

# Recommended
VS Code with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense
```

### Setup Commands

```bash
# 1. Create project
npm create vite@latest ai-code-review-assistant -- --template react-ts
cd ai-code-review-assistant

# 2. Install dependencies
npm install

# 3. Install additional packages
npm install @monaco-editor/react@4.6.0
npm install @anthropic-ai/sdk@0.30.1
npm install zustand@5.0.0
npm install react-router-dom@6.26.2
npm install -D tailwindcss@3.4.1 postcss autoprefixer
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @types/node

# 4. Initialize Tailwind
npx tailwindcss init -p

# 5. Create environment file
cp .env.example .env.local
# Add your Anthropic API key to .env.local

# 6. Start development server
npm run dev

# Access at http://localhost:5173
```

### Development Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\""
  }
}
```

## Architecture Decision Records (ADRs)

### ADR-001: Use Monaco Editor over CodeMirror

**Decision**: Use Monaco Editor as the code editor component.

**Rationale**:
- Powers VS Code, proven at scale
- Excellent TypeScript/language support out-of-box
- Rich API for decorations and annotations
- Active maintenance by Microsoft
- Better WebAssembly support for language services

**Alternatives Considered**:
- CodeMirror 6: Good but less feature-complete
- Ace Editor: Older, less active development
- Plain textarea: Insufficient features

**Trade-offs**:
- Bundle size: Monaco is larger (~4MB initial load)
- Mitigation: Lazy load, use CDN option for monaco

### ADR-002: Use Zustand over Redux for State Management

**Decision**: Use Zustand for state management.

**Rationale**:
- Simple API with minimal boilerplate
- Excellent TypeScript support
- Built-in middleware (persistence, devtools)
- Smaller bundle size than Redux
- Easier for AI agents to understand and extend

**Alternatives Considered**:
- Redux Toolkit: More boilerplate, steeper learning curve
- Jotai/Recoil: Atomic state might be over-engineered
- Context API: Performance concerns for frequent updates

**Trade-offs**:
- Less ecosystem tooling than Redux
- Newer library (but stable and well-maintained)

### ADR-003: Use Anthropic Claude over OpenAI GPT

**Decision**: Use Anthropic's Claude API for code review.

**Rationale**:
- Superior code understanding and context handling
- Larger context window (200k tokens)
- Strong focus on safety and accuracy
- Excellent streaming support
- Better at following specific instructions

**Alternatives Considered**:
- OpenAI GPT-4: Good but smaller context window
- Google Gemini: Less proven for code review
- Local models: Performance and setup complexity

**Trade-offs**:
- API costs (Claude is premium priced)
- Requires Anthropic account
- Mitigation: Allow mock responses for demo mode

### ADR-004: Client-Side Only Architecture (No Backend)

**Decision**: Build as a pure client-side application with no backend server.

**Rationale**:
- Simpler deployment (static hosting)
- Faster development iteration
- No server costs or maintenance
- User owns their data and API keys
- Privacy-first: code stays on device

**Alternatives Considered**:
- Backend proxy: Better security but added complexity
- Serverless functions: Hybrid approach, considered for future

**Trade-offs**:
- API keys visible in browser (use personal keys only)
- No user accounts or cloud sync
- Limited rate limiting options
- Mitigation: Clear documentation, optional backend proxy pattern

### ADR-005: LocalStorage for Persistence (No Database)

**Decision**: Use browser localStorage for all data persistence.

**Rationale**:
- Zero infrastructure required
- Instant reads/writes
- Works offline
- User controls their data
- No privacy concerns

**Alternatives Considered**:
- IndexedDB: More complex API, overkill for current needs
- Cloud database: Requires backend, cost, privacy concerns

**Trade-offs**:
- Storage limits (~5-10MB)
- No cross-device sync
- Data loss on cache clear
- Mitigation: Export/import functionality, migration to IndexedDB if needed

### ADR-006: Vite over Create React App

**Decision**: Use Vite as the build tool instead of Create React App.

**Rationale**:
- 10-100x faster HMR than Webpack
- Optimized production builds with Rollup
- Native ES modules in development
- Better developer experience
- Active development, modern tooling
- CRA is no longer actively maintained

**Alternatives Considered**:
- Create React App: Deprecated, slow builds
- Next.js: Over-engineered for SPA needs
- Custom Webpack: Too much configuration

**Trade-offs**:
- Newer ecosystem (but mature enough)
- Less Stack Overflow answers than CRA

### ADR-007: Tailwind CSS for Styling

**Decision**: Use Tailwind CSS for component styling.

**Rationale**:
- Rapid UI development
- Consistent design system
- Excellent dark mode support
- No CSS naming conflicts
- Purging removes unused styles
- AI agents can easily apply consistent styling

**Alternatives Considered**:
- CSS Modules: More verbose, harder for AI agents
- Styled Components: Runtime overhead, bundle size
- Plain CSS: Naming conflicts, maintenance burden

**Trade-offs**:
- Learning curve for utility-first approach
- Verbose className attributes
- Mitigation: Extract components for complex patterns

---

## Implementation Notes for AI Agents

### Critical Consistency Points

1. **All Monaco ranges are 1-based**: Line and column numbers start at 1, not 0
2. **Thread IDs must be UUIDs**: Use `crypto.randomUUID()` consistently
3. **Always include context**: When creating threads, capture 10 lines before/after selection
4. **Streaming updates**: All AI responses must use streaming API for better UX
5. **Error handling**: Every async operation must have try/catch with user-friendly messages

### Common Pitfalls to Avoid

❌ **Don't**: Store API keys in code or commit them
✅ **Do**: Use environment variables and .gitignore

❌ **Don't**: Mutate Zustand state directly
✅ **Do**: Use store actions that return new state

❌ **Don't**: Make blocking API calls without loading states
✅ **Do**: Always show loading indicators for async operations

❌ **Don't**: Use `any` types in TypeScript
✅ **Do**: Define explicit interfaces for all data structures

### Code Quality Checklist

Before completing any implementation:
- [ ] All TypeScript strict mode checks passing
- [ ] Component has associated test file
- [ ] Error boundaries handle failures gracefully
- [ ] Loading states shown for async operations
- [ ] Accessibility: proper ARIA labels and keyboard navigation
- [ ] Responsive design: works on mobile and desktop
- [ ] Dark mode: colors adapt to theme
- [ ] Comments explain complex logic

---

_Generated by BMAD Architecture Workflow_
_Date: 2025-11-21_
_Project: AI-Powered Code Review Assistant_
_Architecture Version: 1.0_
