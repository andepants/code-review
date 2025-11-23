# AI-Powered Code Review Assistant - Epic Breakdown

**Author:** BMad
**Date:** 2025-11-21
**Project Level:** Low Complexity
**Target Scale:** MVP - Individual Developer Tool

---

## Overview

This document provides the complete epic and story breakdown for AI-Powered Code Review Assistant, decomposing the requirements from the [PRD](./prd.md) into implementable stories.

**Living Document Notice:** This epic breakdown incorporates requirements from PRD, UX Design, and Architecture documents to provide comprehensive, implementation-ready stories with full technical and interaction details.

---

## Functional Requirements Inventory

Based on PRD analysis, all 65 functional requirements organized by category:

### Code Editor & Input (FR1-FR8)
- FR1: Users can paste code into the editor interface
- FR2: Users can manually type or edit code in the editor
- FR3: System automatically detects programming language from code syntax
- FR4: Users can manually select programming language from supported list
- FR5: System applies syntax highlighting appropriate to detected/selected language
- FR6: System displays line numbers for all code in editor
- FR7: System supports common programming languages (JavaScript, Python, TypeScript, Go, Java, C++)
- FR8: Users can clear all code from editor

### Code Selection & Thread Creation (FR9-FR15)
- FR9: Users can select specific lines of code by clicking line numbers
- FR10: Users can select a range of lines by clicking and dragging across line numbers
- FR11: System highlights selected code block visually
- FR12: Users can create a comment thread on selected code block
- FR13: System displays thread creation UI contextually near selected code
- FR14: Users can cancel thread creation without saving
- FR15: System associates each thread with specific line range in code

### Thread Management (FR16-FR26)
- FR16: System displays visual indicators showing which lines have active threads
- FR17: Users can view list of all threads in current session
- FR18: Users can expand individual threads to view conversation history
- FR19: Users can collapse individual threads to minimize UI clutter
- FR20: Users can delete threads
- FR21: System maintains thread state (expanded/collapsed) during session
- FR22: Users can mark threads as resolved
- FR23: System distinguishes visually between resolved and active threads
- FR24: Users can navigate between threads using keyboard shortcuts
- FR25: System supports multiple independent threads on different code sections
- FR26: Threads remain associated with their code ranges even if code is edited

### AI Conversation (FR27-FR36)
- FR27: Users can type questions or comments in thread
- FR28: System sends user message + selected code + surrounding context to AI API
- FR29: System includes metadata (language, code structure) in AI context
- FR30: System displays AI response within thread
- FR31: Users can send follow-up messages in same thread
- FR32: System maintains conversation history for each thread independently
- FR33: System displays loading indicator while waiting for AI response
- FR34: Users can view full conversation history for a thread
- FR35: System handles AI API errors gracefully with user-friendly messages
- FR36: Users can retry failed AI requests

### Context Assembly for AI (FR37-FR41)
- FR37: System includes selected code block in AI prompt
- FR38: System includes surrounding code (configurable context window) in AI prompt
- FR39: System includes programming language information in AI prompt
- FR40: System formats context to optimize AI understanding
- FR41: System limits context size to respect AI API token limits

### Configuration & Settings (FR42-FR48)
- FR42: Users can provide AI API key for service integration
- FR43: Users can select AI provider (OpenAI, Anthropic, or mock for demo)
- FR44: System validates AI API key on configuration
- FR45: Users can switch between light and dark color themes
- FR46: System persists theme preference during session
- FR47: Users can adjust code editor font size
- FR48: Users can configure context window size for AI prompts

### Session Management (FR49-FR51)
- FR49: System clears all data on page refresh (no persistence in MVP)
- FR50: Users can manually clear entire session (all code and threads)
- FR51: System warns users before clearing session if threads exist

### Accessibility (FR52-FR56)
- FR52: Users can perform all primary actions via keyboard shortcuts
- FR53: System provides ARIA labels for screen reader compatibility
- FR54: System displays clear focus indicators on interactive elements
- FR55: Users can navigate thread list with keyboard
- FR56: System supports high contrast mode

### Error Handling & Feedback (FR57-FR61)
- FR57: System displays clear error messages when AI API calls fail
- FR58: System displays validation errors for invalid configurations
- FR59: System shows success feedback for completed actions
- FR60: Users can dismiss error messages
- FR61: System provides helpful guidance when no AI API key configured

### Performance & Responsiveness (FR62-FR65)
- FR62: System applies syntax highlighting within 100ms for typical code files
- FR63: System creates/deletes threads with < 50ms UI response time
- FR64: System displays AI responses progressively (streaming) when supported
- FR65: System remains responsive during AI API calls (non-blocking UI)

---

## Epic Structure Summary

This project is organized into 5 epics that deliver incremental user value:

1. **Epic 1: Foundation & Project Setup** - Establishes technical foundation for all subsequent work
2. **Epic 2: Code Editor Interface** - Users can input and view code with syntax highlighting
3. **Epic 3: Thread Management System** - Users can create, view, and manage comment threads on code
4. **Epic 4: AI Integration & Conversations** - Users can ask AI questions about code and get contextual responses
5. **Epic 5: Polish & Production Readiness** - System is performant, accessible, and production-ready

---

## FR Coverage Map

**Epic 1 (Foundation):** Infrastructure foundation that enables all FRs
**Epic 2 (Code Editor):** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8
**Epic 3 (Thread Management):** FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26
**Epic 4 (AI Integration):** FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR36, FR37, FR38, FR39, FR40, FR41, FR42, FR43, FR44
**Epic 5 (Polish):** FR45, FR46, FR47, FR48, FR49, FR50, FR51, FR52, FR53, FR54, FR55, FR56, FR57, FR58, FR59, FR60, FR61, FR62, FR63, FR64, FR65

---

## Epic 1: Foundation & Project Setup

**Epic Goal:** Establish the technical foundation and core project infrastructure that enables all subsequent development work. Set up the React + TypeScript + Vite application with essential tooling, project structure, and base configuration.

**User Value:** While this epic doesn't deliver user-facing features, it creates the necessary foundation for rapid feature development in subsequent epics. Without this foundation, no features can be built.

**FRs Addressed:** Infrastructure foundation for all 65 functional requirements

---

### Story 1.1: Project Initialization and Base Configuration

As a developer,
I want to initialize the React + TypeScript project with Vite,
So that I have a modern, fast development environment ready for feature implementation.

**Acceptance Criteria:**

**Given** I am starting a new project
**When** I run the project initialization commands
**Then** I should have a fully configured React + TypeScript + Vite project with:
- Vite 6.x configured with React and TypeScript
- TypeScript 5.6.x in strict mode
- ESLint and Prettier configured
- Basic project structure (src/, public/, tests/)
- Development server running on http://localhost:5173
- Hot module replacement (HMR) working correctly

**And** package.json includes all essential dependencies:
- react@18.3.x
- react-dom@18.3.x
- typescript@5.6.x
- vite@6.x
- @vitejs/plugin-react
- Development tooling (ESLint, Prettier, @types/*)

**And** TypeScript is configured with:
- Strict mode enabled
- Path aliases (@/ for src/)
- React JSX support
- ES2020 target

**Prerequisites:** None (first story)

**Technical Notes:**
- Follow Architecture doc exact versions
- Use `npm create vite@latest` with react-ts template
- Configure tsconfig.json per Architecture specifications
- Set up .env.example with placeholder for API keys
- Create .gitignore excluding node_modules, dist, .env.local

---

### Story 1.2: Tailwind CSS Setup and Design System Foundation

As a developer,
I want to configure Tailwind CSS with the dark theme design tokens,
So that I can build UI components with consistent styling using the "Developer Dark Pro" theme.

**Acceptance Criteria:**

**Given** the base project is initialized
**When** I configure Tailwind CSS
**Then** the system should have:
- Tailwind CSS 3.4.x installed and configured
- PostCSS configured for Tailwind processing
- tailwind.config.js with custom design tokens from UX Design spec

**And** the custom theme includes:
- Background colors: `background` (#1e1e1e), `surface` (#252526), `surfaceElevated` (#2d2d30)
- Text colors: `primary` (#d4d4d4), `secondary` (#a0a0a0), `muted` (#6a6a6a)
- Accent colors: `primary` (#007acc), `success` (#4caf50), `warning` (#ff9800), `error` (#f44336)
- 8 thread colors at full opacity and 15% opacity variants
- Typography: Fira Code for code, Inter for UI
- Spacing scale: 4px base unit (xs, sm, md, lg, xl, 2xl, 3xl, 4xl)
- Border radius: sm (4px), md (6px), lg (8px), xl (12px), full (9999px)

**And** global styles are configured:
- Dark mode enabled by default (class strategy)
- Base font families applied
- Smooth scrolling enabled
- Focus ring utilities configured

**Prerequisites:** Story 1.1 (Project Initialization)

**Technical Notes:**
- Install: tailwindcss, postcss, autoprefixer
- Configure content paths to scan src/**/*.{ts,tsx}
- Add @tailwind directives to index.css
- Create design tokens matching UX Design specification exactly
- Test dark theme renders correctly

---

### Story 1.3: Project Structure and Core Directories

As a developer,
I want to establish the complete project directory structure,
So that code is organized logically and consistently as defined in the Architecture document.

**Acceptance Criteria:**

**Given** I have the base Vite project
**When** I create the full directory structure
**Then** the project should have these directories:
- src/components/ (with subdirs: editor/, threads/, ui/, layout/)
- src/hooks/
- src/store/
- src/services/ (with subdirs: ai/, storage/)
- src/types/
- src/utils/
- src/config/
- tests/ (with subdirs: unit/, integration/)

**And** each directory contains:
- An index.ts file for clean exports (where applicable)
- README.md explaining directory purpose
- .gitkeep for empty directories (prevents git from ignoring)

**And** barrel export files are created:
- src/components/index.ts
- src/hooks/index.ts
- src/types/index.ts
- src/utils/index.ts

**Prerequisites:** Story 1.1 (Project Initialization)

**Technical Notes:**
- Follow exact structure from Architecture document
- Create placeholder index.ts files with comments
- Add path aliases in tsconfig.json and vite.config.ts
- Alias @/ to src/ for clean imports
- Document import conventions in README

---

### Story 1.4: Type Definitions for Core Domain Models

As a developer,
I want to define TypeScript interfaces for all core domain models,
So that the entire codebase has strict type safety and clear data contracts.

**Acceptance Criteria:**

**Given** the project structure is established
**When** I create type definition files
**Then** I should have complete TypeScript interfaces for:

**CodeDocument** (src/types/editor.ts):
- id: string (UUID)
- content: string
- language: string
- fileName?: string
- createdAt: Date
- updatedAt: Date

**CodeSelection** (src/types/editor.ts):
- startLine: number (1-based)
- startColumn: number (1-based)
- endLine: number
- endColumn: number
- selectedText: string
- contextBefore: string
- contextAfter: string

**Thread** (src/types/thread.ts):
- id: string (UUID)
- documentId: string
- selection: CodeSelection
- messages: Message[]
- status: 'active' | 'resolved'
- createdAt: Date
- updatedAt: Date

**Message** (src/types/thread.ts):
- id: string (UUID)
- threadId: string
- role: 'user' | 'assistant'
- content: string
- timestamp: Date
- metadata?: { model?: string; tokens?: number; streamComplete?: boolean }

**AppConfig** (src/types/config.ts):
- apiKey: string
- theme: 'light' | 'dark'
- editorTheme: string
- defaultLanguage: string
- maxContextLines: number
- autoSave: boolean

**And** all interfaces are exported from src/types/index.ts

**Prerequisites:** Story 1.3 (Project Structure)

**Technical Notes:**
- Use interfaces (not types) for extensibility
- Add JSDoc comments explaining each field
- Create type guards for runtime validation
- Export all types from central index.ts
- Ensure 100% TypeScript strict mode compliance

---

### Story 1.5: Development Tooling and Scripts

As a developer,
I want to configure development tools and scripts,
So that I have a productive development workflow with linting, formatting, and testing.

**Acceptance Criteria:**

**Given** the project foundation is set up
**When** I configure development tooling
**Then** package.json should include these scripts:
- `npm run dev` - Start development server
- `npm run build` - Production build with type checking
- `npm run preview` - Preview production build
- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run lint` - ESLint check
- `npm run format` - Prettier format all files

**And** ESLint is configured with:
- @typescript-eslint/recommended rules
- React hooks rules
- Accessibility rules (eslint-plugin-jsx-a11y)
- Import order rules
- No console.log in production code (warning in dev)

**And** Prettier is configured with:
- Single quotes
- 2-space indentation
- Trailing commas (es5)
- Print width: 100
- Integration with ESLint (no conflicts)

**And** Git hooks are configured:
- Pre-commit: Run lint and format
- Pre-push: Run tests
- Using Husky (optional for MVP)

**Prerequisites:** Story 1.1 (Project Initialization)

**Technical Notes:**
- Install: @typescript-eslint/*, prettier, eslint-config-prettier
- Create .eslintrc.cjs and .prettierrc files
- Add .vscode/settings.json for editor integration
- Configure editor.formatOnSave in VS Code settings
- Document all scripts in README.md

---

### Story 1.6: Environment Configuration and Secrets Management

As a developer,
I want to configure environment variables and secure secrets handling,
So that sensitive data like API keys are never committed to version control.

**Acceptance Criteria:**

**Given** I need to store configuration and API keys
**When** I set up environment management
**Then** the project should have:

**Environment Files:**
- .env.example (template, committed to git)
- .env.local (actual values, gitignored)
- .gitignore includes .env.local

**And** .env.example contains:
```
# Anthropic AI API Key (required for AI features)
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here

# Optional: Custom API endpoint (for proxy pattern)
# VITE_API_ENDPOINT=https://your-proxy.com/api
```

**And** Vite configuration:
- Environment variables prefixed with VITE_ are exposed to client
- Type definitions for import.meta.env created
- Validation that required env vars are present

**And** Documentation includes:
- README section on environment setup
- Security warnings about client-side API keys
- Instructions for obtaining Anthropic API key
- Recommendation to use proxy pattern in production

**Prerequisites:** Story 1.1 (Project Initialization)

**Technical Notes:**
- Create src/config/env.ts with typed environment access
- Add runtime validation for required env vars
- Never commit actual API keys
- Add security notice in comments
- Consider implementing mock mode for testing without API key

---

## Epic 2: Code Editor Interface

**Epic Goal:** Enable users to input, edit, and view code with professional syntax highlighting and language support. Users can paste or type code and see it rendered beautifully with Monaco Editor.

**User Value:** Users can work with their code in a familiar, IDE-like environment with syntax highlighting, making code review natural and comfortable.

**FRs Addressed:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8

---

### Story 2.1: Monaco Editor Integration and Basic Setup

As a developer,
I want to integrate Monaco Editor into the application,
So that users have a professional code editing experience with syntax highlighting.

**Acceptance Criteria:**

**Given** the foundation is established
**When** I integrate Monaco Editor
**Then** the application should have:
- @monaco-editor/react@4.6.0 installed
- CodeEditor component created in src/components/editor/CodeEditor.tsx
- Monaco editor renders in the main content area (60% width per UX spec)
- Editor has dark theme (vs-dark) applied by default
- Basic editor options configured:
  - Line numbers visible
  - Minimap enabled (toggleable)
  - Font: Fira Code with ligatures
  - Font size: 14px
  - Tab size: 2 spaces
  - Word wrap: off by default

**And** Monaco loads efficiently:
- Editor lazy-loaded to reduce initial bundle size
- Loading state shown while Monaco initializes (<2 seconds)
- Error boundary catches Monaco loading failures

**And** the editor is accessible:
- ARIA label: "Code editor"
- Keyboard focus management
- Screen reader announces editor region

**Prerequisites:** Story 1.1-1.6 (Foundation complete)

**Technical Notes:**
- Use @monaco-editor/react wrapper for React integration
- Configure Monaco worker for syntax highlighting
- Set up TypeScript language features
- Implement useMonaco hook for editor instance access
- Handle Monaco's ESM loading in Vite

---

### Story 2.2: Code Input and Content Management

As a user,
I want to paste or type code into the editor,
So that I can get the code ready for AI review.

**Acceptance Criteria:**

**Given** the Monaco editor is loaded
**When** I interact with the editor
**Then** I can:
- Paste code using Cmd/Ctrl+V and it appears immediately
- Type code directly with full Monaco editing features (autocomplete, bracket matching)
- Use standard editing shortcuts (Cmd/Ctrl+Z undo, Cmd/Ctrl+Y redo, Cmd/Ctrl+A select all)
- See changes reflected in real-time with <50ms latency

**And** content is managed in Zustand store:
- EditorStore.content updates on every change (debounced 300ms)
- Content persists in localStorage automatically
- Initial content loaded from localStorage on app start
- Maximum file size: 1MB (validation with user-friendly error)

**And** the editor displays:
- Line numbers (1-based) on the left gutter
- Current line highlighting (#2a2a2a background)
- Cursor position indicator (line:column) in status bar

**And** performance is maintained:
- No lag when typing (60fps interaction)
- Debounced state updates don't block editor
- Large pastes (>5000 lines) handled gracefully

**Prerequisites:** Story 2.1 (Monaco Editor Integration)

**Technical Notes:**
- Use Monaco's onDidChangeModelContent event
- Implement debouncing for store updates
- Store content in EditorStore (Zustand)
- Add content validation (size limits)
- Handle empty state with placeholder text

---

### Story 2.3: Programming Language Detection and Selection

As a user,
I want the system to automatically detect my code's language,
So that I get appropriate syntax highlighting without manual configuration.

**Acceptance Criteria:**

**Given** I have pasted code into the editor
**When** the system analyzes the content
**Then** it should:
- Auto-detect language from common patterns:
  - `function`, `const`, `=>` → JavaScript
  - `def`, `:`, indentation → Python  
  - `public class`, `void` → Java
  - `package`, `func` → Go
  - `import`, `interface`, `type` → TypeScript
  - `#include`, `int main` → C/C++
- Apply detected language to Monaco editor model
- Update syntax highlighting immediately (<100ms)
- Show detected language in toolbar badge

**And** I can manually override:
- Language selector dropdown in EditorToolbar
- Dropdown shows supported languages: JavaScript, Python, TypeScript, Go, Java, C++, Ruby, PHP, Rust
- Selection updates Monaco language mode immediately
- Manual selection persists during session (overrides auto-detect)

**And** language metadata is available:
- Language stored in EditorStore
- Language included in AI prompts (for context)
- Language-specific features enabled (linting, formatting available for future)

**Prerequisites:** Story 2.2 (Code Input)

**Technical Notes:**
- Create src/utils/languageDetection.ts with pattern matching
- Use Monaco's setModelLanguage() API
- Implement LanguageSelector component (UX spec page 1187-1213)
- Support Monaco language IDs (javascript, python, typescript, etc.)
- Fallback to 'plaintext' if detection fails

---

### Story 2.4: Syntax Highlighting and Theme Configuration

As a user,
I want my code to have beautiful syntax highlighting,
So that I can easily read and understand the code structure.

**Acceptance Criteria:**

**Given** code is entered in the editor with a detected language
**When** Monaco applies syntax highlighting
**Then** the code should display with:
- Language-appropriate token colors (keywords, strings, comments, etc.)
- Dark theme colors matching "Developer Dark Pro" palette:
  - Keywords: #569cd6 (blue)
  - Strings: #ce9178 (orange)
  - Comments: #6a9955 (green)  
  - Functions: #dcdcaa (yellow)
  - Variables: #9cdcfe (light blue)
  - Numbers: #b5cea8 (light green)
- Syntax highlighting applies within 100ms (FR62 requirement)
- No visible flash or flicker when changing languages

**And** theme configuration:
- Monaco uses custom vs-dark theme with our color tokens
- Theme defined in src/config/monaco.ts
- Colors match Tailwind theme exactly
- Theme switches to light mode when user toggles (future story)

**And** edge cases handled:
- Invalid syntax doesn't crash editor (shows as plain text)
- Mixed-language code (e.g., JSX with HTML) highlights both
- Very long lines (>500 chars) remain performant

**Prerequisites:** Story 2.3 (Language Detection)

**Technical Notes:**
- Use Monaco's defineTheme() API
- Load language grammars for all supported languages
- Configure TextMate grammar support
- Test highlighting performance with 5000+ line files
- Implement theme switching hook (for future light mode)

---

### Story 2.5: Editor Toolbar and Actions

As a user,
I want quick access to editor actions and settings,
So that I can control the editor without leaving the interface.

**Acceptance Criteria:**

**Given** the editor is active
**When** I view the editor toolbar
**Then** I should see:
- Language selector dropdown (current language displayed)
- Clear code button (icon: trash, tooltip: "Clear all code")
- Theme toggle button (icon: sun/moon, for future light mode)
- File name input (optional, for context)
- Status info: Line count, current language

**And** actions work correctly:
- Clear code button:
  - Shows confirmation modal if code length >100 characters
  - Modal: "Clear all code? This cannot be undone."
  - Options: "Clear" (destructive red) / "Cancel" (gray)
  - Clears editor content and resets state
  - Shows success toast: "Code cleared"
- Language selector:
  - Opens dropdown with search
  - Updates language on selection
  - Syntax re-highlights immediately

**And** toolbar styling (per UX spec):
- Fixed at top of editor panel
- Height: 48px
- Background: #252526 (surface color)
- Border-bottom: 1px solid #3e3e42
- Items spaced with 12px gaps (md spacing)
- Buttons use ghost variant (transparent background)

**Prerequisites:** Story 2.4 (Syntax Highlighting)

**Technical Notes:**
- Create EditorToolbar component (UX spec mentions this)
- Use Tailwind for consistent styling
- Implement confirmation modal with shadcn/ui Dialog
- Connect to EditorStore for state management
- Add keyboard shortcuts (Cmd/Ctrl+K for clear)

---

### Story 2.6: Empty State and User Guidance

As a first-time user,
I want clear guidance when the editor is empty,
So that I know what to do next.

**Acceptance Criteria:**

**Given** the editor has no content
**When** I view the editor
**Then** I should see:
- Empty state message in center of editor:
  - Icon: Code snippet icon
  - Heading: "Paste code or start typing to begin"
  - Subtext: "Supports JavaScript, Python, TypeScript, Go, Java, C++, and more"
  - CTA button: "Import File" (for future file upload)
- Message styled subtly:
  - Text color: #6a6a6a (muted)
  - Not intrusive or distracting
  - Disappears when user types first character

**And** optional import file action:
- Button opens file picker (if browser supports File API)
- Accepts common code file extensions (.js, .py, .ts, .go, .java, .cpp, etc.)
- Reads file content and populates editor
- Detects language from file extension
- Shows error if file >1MB

**And** the empty state is accessible:
- Screen reader announces: "Code editor is empty. Paste code or start typing to begin."
- Focus moves to editor when user starts typing
- Empty state doesn't interfere with keyboard navigation

**Prerequisites:** Story 2.2 (Code Input)

**Technical Notes:**
- Render empty state conditionally when EditorStore.content is empty
- Use Monaco's overlayWidget API for centered message
- Implement file import with File API (window.showOpenFilePicker)
- Validate file size and type before reading
- Remove empty state on first change event

---

## Epic 3: Thread Management System

**Epic Goal:** Enable users to create, view, and manage multiple independent comment threads tied to specific code selections. Users can select any code range and associate conversations with it, with clear visual indicators of thread locations.

**User Value:** Users can organize their code review feedback by creating focused threads on different code sections, each maintaining its own conversation context without interfering with others.

**FRs Addressed:** FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26

---

### Story 3.1: Code Selection Mechanism

As a user,
I want to select specific lines of code by clicking line numbers,
So that I can indicate exactly which code I want to discuss.

**Acceptance Criteria:**

**Given** code is displayed in the editor
**When** I click on a line number
**Then** that entire line is selected with:
- Blue selection highlight (#264f78 background, 30% opacity per UX spec)
- Selection persists until I click elsewhere or create a thread
- Line number indicator shows selected state (bold, brighter color)

**And** when I click and drag across multiple line numbers:
- All lines in the range are selected
- Selection expands/contracts as I drag
- Visual highlight covers all selected lines
- Selection range displayed in toolbar: "Lines 5-12 selected"

**And** keyboard selection works:
- Shift + Arrow keys extends selection
- Cmd/Ctrl + Shift + L selects current line
- Selection announced to screen readers: "Selected lines 5 to 12"

**And** selection state is managed:
- useSelection hook tracks current selection
- Selection stored with CodeSelection interface (1-based line numbers)
- Selection cleared on: Create thread, click elsewhere, press Escape
- Maximum selection: 100 lines (UX constraint, shows warning if exceeded)

**Prerequisites:** Story 2.2 (Code Input complete)

**Technical Notes:**
- Use Monaco's onDidChangeCursorSelection event
- Create custom gutter decorations for clickable line numbers
- Implement useSelection hook in src/hooks/
- Store selection in EditorStore (currentSelection)
- Handle edge cases: empty lines, partial selections

---

### Story 3.2: Floating Action Button for Thread Creation

As a user,
I want to see a clear action button when I select code,
So that I can easily create a thread for that selection.

**Acceptance Criteria:**

**Given** I have selected lines of code
**When** the selection is active
**Then** a floating action button (FAB) appears:
- Position: Near selection, smart positioning to avoid occlusion (UX spec page 1135-1160)
- Content: "Ask AI about this" with sparkle icon (✨)
- Keyboard hint: "Cmd+Enter" displayed below button
- Button style: Primary blue (#007acc), semibold text, shadow-md

**And** the button behavior:
- Fades in 200ms with slight upward motion
- Hover: Scales to 102%, tooltip appears
- Click: Opens thread panel with input focused
- Keyboard: Cmd/Ctrl+Enter triggers same action
- Disappears when: Selection cleared, thread created, Escape pressed

**And** button is accessible:
- ARIA label: "Ask AI about selected code on lines X to Y"
- Keyboard focusable (Tab navigation)
- Announces shortcut to screen readers
- Focus moves to thread input on activation

**And** edge cases handled:
- Button repositions if selection changes
- Multiple selections: Only one FAB shown for last selection
- FAB doesn't overlap with existing thread markers

**Prerequisites:** Story 3.1 (Code Selection)

**Technical Notes:**
- Implement FloatingActionButton component (UX spec page 1135-1160)
- Use absolute positioning with smart collision detection
- Calculate position based on Monaco's getScrolledVisiblePosition()
- Connect to ThreadStore.createThread() action
- Implement entrance/exit animations with Framer Motion

---

### Story 3.3: Thread Creation and Initial Structure

As a user,
I want to create a thread on my selected code,
So that I can start a conversation about that specific code section.

**Acceptance Criteria:**

**Given** I have selected code and clicked "Ask AI"
**When** the thread is created
**Then** a new thread appears with:
- Unique thread ID (UUID)
- Associated code selection (exact line range and content)
- Thread color assigned (from 8-color palette, cycling)
- Thread marker in left gutter at selection's first line (colored dot, 12px diameter)
- Code selection gets persistent background tint (15% opacity of thread color)
- Left border accent on selected code (2px solid, thread color 100% opacity)

**And** the thread panel opens:
- Slides in from right (250ms ease-out animation per UX spec)
- Panel width: 40% of viewport (resizable via drag handle)
- Thread panel shows:
  - Header: "Thread 1" with thread color badge
  - Code context section: Selected code snippet (read-only, syntax highlighted)
  - Empty conversation area with placeholder: "Ask a question about this code..."
  - Input box at bottom, auto-focused

**And** thread data is managed:
- Thread stored in ThreadStore.threads array
- Thread includes: id, documentId, selection, messages: [], status: 'active'
- Thread count updates: "1 thread" in sidebar
- Thread marked as activeThreadId in store

**And** cancellation is possible:
- Before typing: Escape key or click outside closes panel without saving
- Thread not created if panel closed before first message
- Code selection highlight removed
- No persistent state if cancelled

**Prerequisites:** Story 3.2 (Floating Action Button)

**Technical Notes:**
- Implement ThreadStore with createThread() action
- Create ThreadPanel component (UX spec page 1069-1103)
- Generate UUIDs with crypto.randomUUID()
- Apply Monaco decorations for code highlighting
- Implement thread color assignment (cycle through 8 colors)
- Create ThreadMarker component for gutter (UX spec page 1040-1067)

---

### Story 3.4: Thread Visual Indicators and Markers

As a user,
I want to see clear visual indicators of where threads are located,
So that I can quickly identify which code has active discussions.

**Acceptance Criteria:**

**Given** one or more threads exist
**When** I view the editor
**Then** I should see:

**Thread markers in gutter:**
- Colored circular marker (12px diameter) at first line of each thread's code range
- Thread number inside marker (1, 2, 3...) in white text
- Marker color matches thread color (from 8-color palette)
- Markers stacked vertically if multiple threads on nearby lines

**Code highlighting:**
- Persistent background tint on code ranges (thread color at 15% opacity)
- Left border accent (2px solid, thread color at 100%)
- Overlapping threads: Layered transparencies (both visible)
- Highlighting persists even when editor scrolls

**Hover interactions:**
- Hover over marker: Tooltip shows "Thread 1: Is there a clearer way?"
- Hover over highlighted code: Cursor changes to pointer
- Hover brightens code highlight slightly (from 15% to 20% opacity)

**And** visual system supports:
- Up to 8 simultaneous threads with distinct colors
- Thread 9+: Colors recycle (with warning toast: "Consider resolving old threads")
- Resolved threads: Checkmark icon replaces number, muted color (#6a6a6a)

**And** indicators are accessible:
- Thread markers have ARIA labels: "Thread 1 at line 45: [first message]"
- Markers keyboard navigable (Tab to focus)
- Screen reader announces thread location when focused

**Prerequisites:** Story 3.3 (Thread Creation)

**Technical Notes:**
- Use Monaco's editor.deltaDecorations() API for highlights
- Implement gutter decorations with custom HTML
- Create ThreadMarker component (UX spec defines this)
- Store decoration IDs to update/remove later
- Handle overlapping ranges with transparent layering
- Implement thread color palette from UX spec (#4fc3f7, #81c784, #ffb74d, etc.)

---

### Story 3.5: Thread Panel Layout and Navigation

As a user,
I want to view and navigate between multiple threads,
So that I can manage conversations about different code sections.

**Acceptance Criteria:**

**Given** multiple threads exist
**When** I interact with the thread panel
**Then** I can navigate threads via:

**Thread tabs (if 2-3 threads):**
- Horizontal tabs in panel header
- Tab shows: Thread number + first 20 chars of first message
- Active tab: Thread color border-bottom (2px)
- Click tab: Switches to that thread instantly
- Tabs scroll horizontally if >3 threads

**Thread dropdown (if 4+ threads):**
- Dropdown button in panel header: "Thread 2 of 5"
- Opens list showing all threads:
  - Thread number and color badge
  - Code snippet preview (first line)
  - First message preview (truncated to 40 chars)
  - Status badge: Active or Resolved
- Select thread: Switches panel content
- List sorted by: Line number (default), Recent activity, Unresolved first

**Keyboard navigation:**
- Cmd/Ctrl + 1-9: Jump to thread 1-9
- Cmd/Ctrl + ]: Next thread
- Cmd/Ctrl + [: Previous thread
- Tab: Navigate within thread panel
- Escape: Close thread panel

**And** thread switching behavior:
- Panel content updates instantly (<50ms)
- Scroll position preserved per thread
- Active thread: Editor scrolls to its code range
- Thread marker: Active thread brighter (100% opacity), others dimmed (60%)

**Prerequisites:** Story 3.4 (Thread Visual Indicators)

**Technical Notes:**
- Implement thread tabs using Tailwind components
- Create ThreadDropdown with keyboard navigation
- Store active thread ID in ThreadStore
- Implement scroll-to-thread logic with Monaco's revealLineInCenter()
- Add keyboard shortcut handlers
- Use Framer Motion for smooth transitions

---

### Story 3.6: Thread State Management (Expand/Collapse/Resolve)

As a user,
I want to manage thread states (expand, collapse, resolve),
So that I can focus on active discussions and archive completed ones.

**Acceptance Criteria:**

**Given** a thread exists
**When** I manage its state
**Then** I can:

**Collapse/Expand thread:**
- Click thread header: Toggles collapsed state
- Collapsed: Shows only code snippet + first message
- Expanded: Shows full conversation history + input
- State persists during session (FR21)
- Collapse icon: Chevron down (expanded) / right (collapsed)

**Resolve thread:**
- Click "Resolve" button (checkmark icon) in thread header
- Confirmation: "Mark this thread as resolved?"
- Resolved threads:
  - Marker shows checkmark icon instead of number
  - Marker color changes to muted gray (#6a6a6a)
  - Code highlight remains but muted (50% opacity)
  - Thread header shows "Resolved" badge (green)
  - Thread moved to bottom of thread list
- Unresolve action available: Click "Reopen" button

**Navigate between threads:**
- Previous/Next buttons in thread header
- Buttons disabled at boundaries (first/last thread)
- Keyboard shortcuts work (Cmd+] / Cmd+[)

**And** state is managed:
- Thread.status: 'active' | 'resolved'
- Collapsed state tracked per thread
- ThreadStore.resolveThread() updates status + timestamp
- Visual updates propagate to all thread displays (marker, list, panel)

**And** filtering threads:
- Sidebar shows: All (default), Active only, Resolved only
- Filter persists during session
- Empty state when filter shows no threads

**Prerequisites:** Story 3.5 (Thread Panel Navigation)

**Technical Notes:**
- Add status field to Thread interface
- Implement resolveThread() and reopenThread() actions
- Update Monaco decorations when status changes
- Create resolve/collapse UI controls
- Use localStorage middleware to persist state
- Implement thread filtering logic

---

### Story 3.7: Thread Deletion and Confirmation

As a user,
I want to delete threads I no longer need,
So that I can keep my workspace clean and focused.

**Acceptance Criteria:**

**Given** a thread exists
**When** I attempt to delete it
**Then** the system should:

**Show confirmation modal:**
- Triggered by: Delete button (trash icon) in thread header
- Modal content:
  - Title: "Delete this thread?"
  - Preview: Shows thread's code snippet + first message
  - Warning: "This action cannot be undone."
  - Buttons: "Delete" (destructive red) / "Cancel" (gray)
- Modal uses shadcn/ui Dialog component
- Escape key or click outside: Closes modal without deleting

**On confirmation:**
- Thread removed from ThreadStore.threads array
- Thread marker removed from gutter (fade out animation)
- Code highlight removed (fade out 400ms)
- Thread panel: Shows next thread or empty state
- Success toast: "Thread deleted" (auto-dismiss 3 seconds)
- Action logged: console.log('[ThreadStore] Thread deleted:', threadId)

**Edge cases:**
- Deleting active thread: Switches to next available thread (or closes panel if last)
- Deleting only thread: Shows empty state in panel
- Deleted thread not recoverable (no undo in MVP)

**And** alternative action offered:
- Modal footer suggestion: "Consider resolving instead of deleting" with link
- Link: Resolves thread and closes modal (preserves thread)

**Prerequisites:** Story 3.6 (Thread State Management)

**Technical Notes:**
- Implement deleteThread() action in ThreadStore
- Create confirmation modal with shadcn/ui
- Remove Monaco decorations when thread deleted
- Update thread count in sidebar
- Handle edge case: activeThreadId references deleted thread
- Consider soft delete for future undo feature

---

### Story 3.8: Thread-to-Code Synchronization

As a user,
I want threads to stay associated with their code even if I edit,
So that I don't lose context when making changes.

**Acceptance Criteria:**

**Given** active threads exist on code
**When** I edit the code
**Then** the system should handle:

**Minor edits (typos, formatting):**
- Thread remains attached to same line numbers
- Highlights update if line content changes
- No warning or notification needed
- Thread context snapshot preserved (original code saved)

**Significant edits (add/remove lines):**
- Thread line numbers adjust automatically:
  - Insert line above: All line numbers shift down
  - Delete line above: All line numbers shift up  
  - Insert within thread range: Expand range to include
  - Delete within range: Contract range
- Thread shows warning badge: "Code has changed since thread created"
- Thread panel displays:
  - "⚠️ Code modified" notice at top
  - Option to "Update context" or "View original"
  - Original code snapshot preserved in Thread.selection.originalCode

**Deleted lines:**
- If all thread lines deleted: Thread becomes "detached"
- Detached thread:
  - Marker moves to nearest remaining line (or file top)
  - Marker shown with alert icon
  - Thread header: "Original code deleted"
  - Code snapshot shows original (preserved)
  - User options: Delete thread or Keep as reference

**And** synchronization is robust:
- Line tracking uses Monaco's model change events
- Decorations update automatically when lines shift
- Thread.selection updated with new line numbers
- originalSelection preserved for comparison

**Prerequisites:** Story 3.7 (Thread Deletion)

**Technical Notes:**
- Listen to Monaco's onDidChangeModelContent
- Implement line shift calculation based on change delta
- Preserve original selection in Thread.selection.originalSnapshot
- Update decoration ranges when lines shift
- Create "code modified" warning UI component
- Handle edge case: Multiple simultaneous edits

---

## Epic 4: AI Integration & Conversations

**Epic Goal:** Integrate Anthropic Claude AI to provide intelligent, contextual code review responses. Users can ask questions about selected code and receive streaming AI responses with full conversation history maintained per thread.

**User Value:** Users receive instant, intelligent feedback on their code from an AI that understands the surrounding context, enabling rapid learning and improvement.

**FRs Addressed:** FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34, FR35, FR36, FR37, FR38, FR39, FR40, FR41, FR42, FR43, FR44

---

### Story 4.1: Anthropic API Client Setup

As a developer,
I want to integrate the Anthropic Claude API,
So that the application can send code review requests and receive AI responses.

**Acceptance Criteria:**

**Given** the project foundation is complete
**When** I set up the Anthropic API client
**Then** the system should have:

**Anthropic SDK installed:**
- @anthropic-ai/sdk@0.30.1 in package.json
- SDK configured in src/services/ai/anthropicClient.ts
- TypeScript types for all API interactions

**API client implementation:**
- AnthropicService class with these methods:
  - `streamCodeReview(request: CodeReviewRequest): AsyncGenerator<string>`
  - `getCodeReview(request: CodeReviewRequest): Promise<string>`
- API key loaded from environment or ConfigStore
- Model: claude-3-5-sonnet-20241022 (latest per Architecture doc)
- Max tokens: 4096
- Stream support enabled for better UX

**Error handling:**
- Try/catch around all API calls
- Specific error types: NetworkError, AuthError, RateLimitError, QuotaError
- User-friendly error messages
- Retry logic with exponential backoff (3 attempts)
- Timeout handling (30 second max per request)

**And** security measures:
- API key never logged or displayed
- API key obfuscated in localStorage (base64 encoding)
- Clear warnings about client-side key storage
- Recommendation for proxy pattern in production

**Prerequisites:** Story 1.6 (Environment Configuration)

**Technical Notes:**
- Follow Architecture doc API client pattern exactly
- Use Anthropic SDK's streaming API
- Implement error classes in src/services/ai/errors.ts
- Create typed interfaces for request/response
- Add API key validation before requests
- Consider mock mode for demo without API key

---

### Story 4.2: AI Context Assembly and Prompt Engineering

As a developer,
I want to build intelligent prompts that include code context,
So that AI responses are accurate and contextual.

**Acceptance Criteria:**

**Given** a user asks a question about selected code
**When** the system builds the AI prompt
**Then** the prompt should include:

**Code context (FR37-41):**
- Selected code block (exact text from selection)
- Surrounding context (10 lines before/after, configurable)
- Full file content (if <2000 lines, otherwise truncated)
- Programming language name
- File name (if provided)

**Metadata:**
- Language for syntax awareness
- Line numbers for reference
- Code structure hints (function/class names in context)

**Conversation history:**
- All previous messages in this thread
- Formatted as conversation: User: / Assistant:
- Limited to last 10 messages (prevent token overflow)

**Prompt template:**
```
You are a code review assistant. Analyze the following code and provide feedback.

LANGUAGE: {language}
FILE: {fileName}

SELECTED CODE (lines {startLine}-{endLine}):
{selectedText}

CONTEXT BEFORE (lines {contextStartLine}-{selectionStartLine-1}):
{contextBefore}

CONTEXT AFTER (lines {selectionEndLine+1}-{contextEndLine}):
{contextAfter}

USER QUESTION:
{userMessage}

{conversationHistory}

Provide specific, actionable feedback focusing on:
- Code quality and best practices
- Potential bugs or issues  
- Performance considerations
- Suggestions for improvement

Be concise and reference specific line numbers when applicable.
```

**And** prompt optimization:
- Token limit respected: Max 8000 tokens for prompt (leaves 4096 for response)
- If context too large: Truncate context, preserve selection
- Warning to user if context truncated: "Context limited to fit API constraints"

**Prerequisites:** Story 4.1 (API Client Setup)

**Technical Notes:**
- Create promptBuilder.ts in src/services/ai/
- Implement buildPrompt(request: CodeReviewRequest): string
- Use utils/codeContext.ts to extract surrounding lines
- Calculate token count (rough estimate: 1 token ≈ 4 chars)
- Implement context truncation algorithm
- Add unit tests for prompt building edge cases

---

### Story 4.3: Thread Message Input and User Interaction

As a user,
I want to type questions in a thread and send them to AI,
So that I can get feedback on my selected code.

**Acceptance Criteria:**

**Given** a thread is active and panel is open
**When** I interact with the thread input
**Then** I should see:

**Input component:**
- Multi-line textarea at bottom of thread panel
- Placeholder: "Ask a question about this code..."
- Auto-resize as I type (min 2 lines, max 6 lines)
- Character count: "0 / 2000" (max 2000 chars per FR validation)
- Send button: Primary blue, disabled if empty

**Sending message:**
- Click Send button or press Enter (Shift+Enter for new line)
- Input validates: Not empty, <2000 chars
- Input clears after send
- Message added to thread immediately (optimistic UI)
- Loading indicator appears in thread conversation area

**User message display:**
- Message appears as chat bubble:
  - Right-aligned
  - User avatar/icon (generic user icon)
  - Timestamp: "Just now" or "2 minutes ago"
  - Content: Plain text with line breaks preserved
- Message stored in Thread.messages array:
  - role: 'user'
  - content: message text
  - timestamp: new Date()

**And** keyboard shortcuts:
- Enter: Send message (if not empty)
- Shift+Enter: New line in textarea
- Cmd/Ctrl+Enter: Send message (alternative)
- Escape: Clear input (if no content) or close panel

**Prerequisites:** Story 3.3 (Thread Creation complete)

**Technical Notes:**
- Create ThreadInput component (UX spec page 1104-1120)
- Implement character count validation
- Use Zustand action: addMessage(threadId, message)
- Handle optimistic UI updates
- Disable send button during AI response
- Add ARIA labels for accessibility

---

### Story 4.4: AI Streaming Response Display

As a user,
I want to see AI responses appear in real-time as they're generated,
So that I get immediate feedback without waiting for the complete response.

**Acceptance Criteria:**

**Given** I have sent a message to AI
**When** the AI begins responding
**Then** I should see:

**Loading state:**
- Typing indicator (3 pulsing dots) appears immediately
- Text: "AI is thinking..." below dots
- Duration: <2 seconds before stream starts

**Streaming response:**
- AI message bubble appears (left-aligned)
- Text streams in word-by-word or character-by-character
- Cursor blinks at end of streaming text
- Smooth scrolling keeps latest text visible
- Markdown rendered as it streams (code blocks, lists, bold, etc.)

**Message display:**
- AI avatar/icon (Anthropic or AI icon)
- Timestamp updated on completion
- Content formatted:
  - Code blocks: Syntax highlighted (use same Monaco theme)
  - Line breaks preserved
  - Links clickable
  - Lists and formatting supported

**And** response handling:
- Partial content stored in real-time
- On error mid-stream: Preserve partial content + error message
- On completion: Message.metadata.streamComplete = true
- Response stored in Thread.messages:
  - role: 'assistant'
  - content: full response text
  - metadata: { model: 'claude-3-5-sonnet', tokens: count }

**And** user experience:
- Panel scrolls automatically to show new content
- User can scroll up during streaming (auto-scroll pauses)
- Stream cancellation: Escape key stops stream, preserves partial response
- Loading indicator remains non-blocking (user can navigate away)

**Prerequisites:** Story 4.3 (Message Input)

**Technical Notes:**
- Implement useAI hook with streaming support
- Use Anthropic SDK's stream API: client.messages.stream()
- Create streamHandler.ts to process chunks
- Render Markdown with react-markdown + remark-gfm
- Implement auto-scroll logic with ref.scrollIntoView()
- Handle stream errors gracefully
- Add Monaco syntax highlighting to code blocks in messages

---

### Story 4.5: Conversation History and Follow-ups

As a user,
I want to send follow-up questions in a thread,
So that I can have a complete conversation about the code.

**Acceptance Criteria:**

**Given** a thread has AI responses
**When** I send a follow-up message
**Then** the system should:

**Maintain conversation history:**
- All previous messages (user + AI) displayed in chronological order
- Messages scrollable if conversation is long (>5 exchanges)
- Latest message always visible (auto-scroll to bottom)
- Conversation history included in next AI prompt
- Maximum 10 message pairs (20 messages total) to manage token limits

**Display full history:**
- Message thread shows all exchanges:
  - User messages: Right-aligned, user color
  - AI messages: Left-aligned, AI color
  - Alternating pattern clear and easy to follow
- Timestamps on all messages (relative time)
- Read-only after sent (no editing in MVP)

**Handle long conversations:**
- If >10 message pairs: Truncate oldest from AI context (keep in UI)
- Warning shown: "Conversation is long. Older messages excluded from AI context."
- Option to "Start New Thread" suggested

**And** follow-up behavior:**
- Follow-up uses same context (selected code, language)
- AI remembers previous conversation (context maintained)
- New question can reference previous answers
- Each response builds on conversation

**And** thread management:
- View full conversation: Scroll up in thread panel
- Conversation persists during session (no loss on page navigation)
- Thread.messages array grows with each exchange
- Storage limit: 50 messages per thread (warning at 40)

**Prerequisites:** Story 4.4 (Streaming Response)

**Technical Notes:**
- Implement conversation history in prompt builder
- Create ThreadMessage component for display (UX spec page 1104-1133)
- Use virtualized list for long conversations (react-window)
- Manage message array in ThreadStore
- Add message truncation logic for AI context
- Style user vs AI messages distinctly

---

### Story 4.6: API Configuration and Key Management

As a user,
I want to configure my Anthropic API key,
So that I can use the AI features with my own account.

**Acceptance Criteria:**

**Given** I want to use AI features
**When** I access settings
**Then** I should see:

**Settings modal:**
- Triggered by: Settings icon in header
- Modal title: "Configuration"
- Tabs: "API Settings", "Editor Settings"

**API Settings tab:**
- API provider selector: Anthropic (default), OpenAI (disabled in MVP), Mock (for demo)
- API key input:
  - Type: password (masked text)
  - Placeholder: "sk-ant-..."
  - Validation: Starts with "sk-ant-" for Anthropic
  - Show/Hide toggle button (eye icon)
- Save button: Validates and stores key
- Test connection button: Makes test API call to verify key

**Key storage:**
- Key stored in ConfigStore (Zustand)
- Persisted to localStorage (base64 encoded for obfuscation)
- Never logged to console or displayed unmasked
- Key validated on input (format check)
- Warning displayed: "API keys are stored in your browser and never sent to our servers."

**Mock mode:**
- If "Mock" provider selected:
  - No API key required
  - AI responses are pre-defined demo responses
  - Notice: "Using mock responses for demonstration. Configure an API key for real AI."
- Mock responses: Generic but helpful code review feedback

**And** error handling:
- Invalid key format: Show error immediately
- Connection test failure: Show specific error (auth failure, network, etc.)
- Missing key on AI request: Prompt to configure key with link to settings

**Prerequisites:** Story 4.1 (API Client Setup)

**Technical Notes:**
- Create Settings modal with shadcn/ui Dialog
- Implement ConfigStore with API key management
- Add API key validation logic
- Create test connection endpoint call
- Implement mock AI responses for demo mode
- Add security notices and best practices in UI

---

### Story 4.7: Error Handling and Retry Mechanisms

As a user,
I want clear feedback when AI requests fail,
So that I understand what went wrong and can take corrective action.

**Acceptance Criteria:**

**Given** an AI request is made
**When** an error occurs
**Then** the system should display:

**Error messages:**
- **Network error**: "Unable to reach AI service. Check your internet connection." + Retry button
- **Auth error**: "Invalid API key. Please check your configuration." + Settings button
- **Rate limit**: "Too many requests. Please wait a moment and try again." + Countdown timer
- **Quota exceeded**: "API quota exceeded. Please check your Anthropic account." + Anthropic link
- **Timeout**: "Request timed out. The code context may be too large." + Try smaller selection suggestion
- **Unknown error**: "An unexpected error occurred. Please try again." + Error details (collapsible)

**Error display:**
- Error appears in thread as system message (amber background)
- Error icon (⚠️) and clear message
- Action buttons contextual to error type
- Option to copy error details for support

**Retry mechanism:**
- Retry button appears on transient errors (network, timeout, rate limit)
- Retry uses exponential backoff: 1s, 2s, 4s delays
- Maximum 3 retry attempts
- Retry counter shown: "Retry 2 of 3"
- After 3 failures: Suggest checking settings or contact support

**And** error recovery:
- Failed message preserved (user doesn't lose question)
- Retry sends same message + context
- User can edit message before retry
- Cancel retry option available

**And** partial response handling:
- If stream fails mid-response: Preserve partial AI response
- Show error: "Response incomplete. [Retry]"
- Partial content marked with indicator: "Response truncated"

**Prerequisites:** Story 4.5 (Conversation History)

**Technical Notes:**
- Implement error classes: NetworkError, AuthError, RateLimitError, etc.
- Create error handler in useAI hook
- Add retry logic with exponential backoff
- Store failed request for retry
- Display errors as special message type in thread
- Log errors to console for debugging (not in production)

---


## Epic 5: Polish & Production Readiness

**Epic Goal:** Enhance the application with theme switching, accessibility features, performance optimizations, and production-ready error handling to create a polished, professional user experience.

**User Value:** Users have a fully functional, accessible, and performant code review tool that works smoothly across devices and meets professional standards for web applications.

**FRs Addressed:** FR45, FR46, FR47, FR48, FR49, FR50, FR51, FR52, FR53, FR54, FR55, FR56, FR57, FR58, FR59, FR60, FR61, FR62, FR63, FR64, FR65

---

### Story 5.1: Theme Switching (Light and Dark Mode)

As a user,
I want to switch between light and dark themes,
So that I can use the application comfortably in different environments.

**Acceptance Criteria:**

**Given** the application supports theme switching
**When** I toggle the theme
**Then** the system should:

**Provide theme toggle:**
- Theme switcher in header toolbar (sun/moon icon)
- Click toggles between light and dark
- Current theme indicated (filled icon for active)
- Keyboard shortcut: Cmd/Ctrl+Shift+T

**Apply light theme:**
- Background: #ffffff (white)
- Surface: #f5f5f5 (light gray)
- Text: #1e1e1e (dark) for contrast
- Code editor: vs theme (Monaco's light theme)
- All colors inverted to maintain WCAG AA contrast
- Thread colors adjusted for dark text (darker shades)

**Theme persistence:**
- Selected theme stored in ConfigStore
- Persisted to localStorage
- Theme restored on app reload
- Default: Dark mode (per UX spec)

**Smooth transitions:**
- Theme change applies instantly (<50ms)
- All components re-render with new theme
- No flash or flicker during switch
- Monaco editor theme updates smoothly

**And** accessibility:**
- Respects system preference: prefers-color-scheme
- Option to "Use System Theme" (auto-switches with OS)
- Theme announced to screen readers: "Switched to light theme"

**Prerequisites:** Story 2.4 (Syntax Highlighting configured)

**Technical Notes:**
- Add light theme colors to Tailwind config
- Use Tailwind's dark: variant strategy
- Create ThemeProvider context
- Update Monaco theme with defineTheme()
- Store theme in ConfigStore
- Implement system theme detection with window.matchMedia

---

### Story 5.2: Editor Font Size and Context Window Configuration

As a user,
I want to adjust editor font size and context window,
So that I can customize the interface to my preferences.

**Acceptance Criteria:**

**Given** I access editor settings
**When** I adjust configuration
**Then** I can modify:

**Font size:**
- Range: 10px - 24px (default 14px)
- Slider control with live preview
- Applies to both editor and thread code snippets
- Stored in ConfigStore.config.fontSize
- Persisted across sessions

**Context window size:**
- Range: 5 - 50 lines before/after (default 10)
- Number input with +/- buttons
- Help text: "More context helps AI but uses more tokens"
- Affects AI prompts (more context = better but pricier)
- Stored in ConfigStore.config.maxContextLines

**Settings UI:**
- Settings panel accessible via header icon
- Section: "Editor Settings"
- Real-time preview shows changes
- Reset button: Restore defaults
- Save button: Apply and persist

**And** setting effects:
- Font size: Monaco editor and thread snippets resize immediately
- Context: Next AI request uses new context window size
- Changes don't affect existing threads (only new ones)

**Prerequisites:** Story 4.6 (API Configuration complete)

**Technical Notes:**
- Add font size and context settings to ConfigStore
- Update Monaco options when font size changes
- Modify prompt builder to use configurable context window
- Create settings UI with slider and number inputs
- Add validation (min/max enforcement)
- Store settings in localStorage

---

### Story 5.3: Session Management and Clear Actions

As a user,
I want to manually clear my session or understand data persistence,
So that I can manage my workspace and data.

**Acceptance Criteria:**

**Given** I have active work in the application
**When** I want to clear or reset
**Then** I can:

**Clear all code:**
- Action in editor toolbar: "Clear Code" button
- If threads exist: Confirmation modal
  - "Clear all code? This will also delete {n} threads."
  - Options: "Clear All" (destructive) / "Cancel"
- If confirmed: Clears editor + deletes all threads
- Success toast: "Workspace cleared"

**Clear specific thread:**
- Delete button per thread (covered in Story 3.7)
- Clears just that thread, preserves code and others

**Understand data persistence:**
- On first use: Info banner
  - "Your code and threads are saved in your browser. They'll be cleared when you refresh the page."
  - Dismiss button (don't show again)
- FAQ section in about/help
- Clear explanation: No server storage, localStorage only (MVP constraint)

**Handle page refresh:**
- Warning if user tries to refresh with unsaved work:
  - Browser's beforeunload dialog
  - "You have active threads. Leaving will lose your work."
- On refresh: All data cleared (per FR49 MVP constraint)

**And** export before clear (future enhancement noted):
- Before clearing: Suggest export option
- Quick export to JSON or Markdown
- User can save work before destroying it

**Prerequisites:** Story 3.7 (Thread Deletion)

**Technical Notes:**
- Implement clear actions in EditorStore
- Add beforeunload event listener for refresh warning
- Create confirmation modals with shadcn/ui
- Add info banner component (dismissible)
- Document MVP limitations clearly
- Plan for future: Persistent storage option

---

### Story 5.4: Accessibility - Keyboard Navigation

As a user who relies on keyboard navigation,
I want to perform all actions with keyboard shortcuts,
So that I can use the application without a mouse.

**Acceptance Criteria:**

**Given** I am navigating with keyboard only
**When** I use keyboard shortcuts
**Then** all features should be accessible:

**Global shortcuts:**
- Cmd/Ctrl+K: Open command palette
- Cmd/Ctrl+/: Show keyboard shortcuts help
- Cmd/Ctrl+,: Open settings
- Esc: Close modal/panel/dropdown
- Tab: Move focus forward
- Shift+Tab: Move focus backward

**Editor shortcuts:**
- Standard editing (Cmd/Ctrl+C/V/Z/A/F)
- Cmd/Ctrl+Enter: Create thread from selection
- Arrow keys + Shift: Select code lines

**Thread navigation:**
- Cmd/Ctrl+1-9: Jump to thread N
- Cmd/Ctrl+]: Next thread
- Cmd/Ctrl+[: Previous thread
- Enter: Send message (in input)
- Shift+Enter: New line (in input)

**Focus management:**
- Logical tab order (left to right, top to bottom)
- Skip links: "Skip to code", "Skip to threads"
- Focus indicators visible (2px blue outline)
- Focus trap in modals (can't tab outside)
- Focus returns to trigger on modal close

**And** visual feedback:
- All focusable elements have clear focus ring
- Focus ring: 2px solid #007acc, 2px offset
- Never remove with outline: none
- Hover states also on focus (keyboard users see same feedback)

**Prerequisites:** All core features complete

**Technical Notes:**
- Implement keyboard event listeners at app level
- Create useKeyboardShortcuts hook
- Add focus management utilities
- Use roving tabindex for complex components
- Add skip links in header
- Test with keyboard only (no mouse)
- Document all shortcuts in help modal

---

### Story 5.5: Accessibility - Screen Reader Support

As a user who relies on screen readers,
I want full screen reader compatibility,
So that I can use all features independently.

**Acceptance Criteria:**

**Given** I am using a screen reader
**When** I navigate the application
**Then** all elements should be properly announced:

**ARIA labels on all components:**
- CodeEditor: role="textbox", aria-multiline="true", aria-label="Code editor"
- ThreadMarker: role="button", aria-label="Thread 1 at line 45: [preview]"
- ThreadPanel: role="complementary", aria-label="Code review thread"
- ThreadMessage: role="article", aria-label="Message from [You/AI]"
- Buttons: Clear aria-label describing action

**Live regions for dynamic content:**
- Thread panel: aria-live="polite" for AI responses
- Toast notifications: aria-live="assertive"
- Announcements:
  - "AI is thinking..."
  - "AI response received"
  - "Thread created"
  - "Thread resolved"

**Landmarks for navigation:**
- <main>: Code editor area
- <complementary>: Thread panel
- <navigation>: Header toolbar
- Screen reader can jump between landmarks

**Hidden content handled correctly:**
- Visually hidden text for context: "Thread marker", "Resolved"
- Decorative icons: aria-hidden="true" when label exists
- Interactive content never hidden from SR

**And** semantic HTML:**
- Correct elements: <button> not <div onclick>
- Heading hierarchy: h1 → h2 → h3
- Lists use <ul>/<ol>/<li>
- Forms use <label> elements

**Prerequisites:** Story 5.4 (Keyboard Navigation)

**Technical Notes:**
- Add ARIA labels to all custom components
- Use semantic HTML throughout
- Implement live regions with aria-live
- Add visually hidden class for SR-only text
- Test with NVDA (Windows), VoiceOver (Mac), JAWS
- Follow WAI-ARIA Authoring Practices

---

### Story 5.6: Performance Optimization

As a user working with code files,
I want the application to remain fast and responsive,
So that my workflow is never interrupted by lag.

**Acceptance Criteria:**

**Given** I am using the application
**When** I perform common actions
**Then** performance should meet these targets:

**Loading performance:**
- Initial page load: <2 seconds on broadband
- Time to interactive: <3 seconds
- Monaco editor ready: <2 seconds after page load
- First syntax highlight: <100ms (FR62)

**Interaction performance:**
- Code typing: 60fps, no input lag
- Thread create/delete: <50ms UI response (FR63)
- Theme switch: <50ms for all components
- Thread navigation: <50ms to switch threads
- Selection highlight: <16ms (60fps smooth)

**Streaming performance:**
- AI response starts: <2 seconds after request
- Streaming display: Smooth, no stuttering
- Streaming doesn't block UI: Can still navigate

**Optimization techniques implemented:**
- **Code splitting**: Monaco lazy-loaded
- **Debouncing**: Editor content updates debounced 300ms
- **Memoization**: Expensive computations memoized
- **Virtualization**: Long thread lists virtualized
- **Selective re-renders**: Only affected components update

**And** performance for large content:
- Files up to 5000 lines: No degradation
- Up to 50 threads: Smooth navigation
- Up to 100 messages per thread: Scrollable without lag

**Prerequisites:** All features complete

**Technical Notes:**
- Use React.memo for components
- Implement useMemo/useCallback hooks
- Use react-window for virtualized lists
- Lazy load Monaco with React.lazy
- Monitor with React DevTools Profiler
- Run Lighthouse audits (target 90+ performance score)
- Implement debouncing with lodash.debounce

---

### Story 5.7: Error Boundaries and Global Error Handling

As a user,
I want the application to handle errors gracefully,
So that I don't lose my work if something goes wrong.

**Acceptance Criteria:**

**Given** an error occurs in the application
**When** the error is caught
**Then** the system should:

**Handle component errors:**
- ErrorBoundary wraps App component
- Catches React component errors
- Displays fallback UI:
  - Error icon and message
  - "Something went wrong"
  - "Refresh page" button
  - "Report issue" link (future)
- Logs error to console for debugging

**Handle network errors:**
- API errors caught and displayed inline (covered in 4.7)
- Network offline: Banner at top
  - "You're offline. Some features won't work."
  - Auto-dismisses when connection restored
- Retry mechanisms for transient failures

**Preserve user data:**
- localStorage writes wrapped in try/catch
- If write fails: Warning shown, data kept in memory
- On critical error: Attempt to save current state
- User can export before refresh

**User-friendly messages:**
- No technical jargon in user-facing errors
- Actionable guidance: "Try...", "Check...", "Contact..."
- Error details available: Collapsible "Technical Details"
- Copy error button for support

**And** error logging:**
- console.error for all caught errors
- Error context: Component, action, user state
- No PII logged (user code not logged)
- Production: Integrate error tracking (e.g., Sentry) - future

**Prerequisites:** All features complete

**Technical Notes:**
- Create ErrorBoundary component
- Implement error logging utility
- Add network status detection with navigator.onLine
- Wrap API calls in try/catch
- Create user-friendly error messages
- Add error recovery logic where possible
- Consider integrating Sentry for production

---

### Story 5.8: Success Feedback and User Notifications

As a user,
I want clear confirmation when actions complete successfully,
So that I know my actions were processed.

**Acceptance Criteria:**

**Given** I complete an action
**When** the action succeeds
**Then** I should see:

**Success feedback patterns:**
- Thread created: Toast "Thread created on lines X-Y" (3s auto-dismiss)
- Thread resolved: Badge updated + toast "Thread marked as resolved"
- Thread deleted: Toast "Thread deleted"
- Settings saved: Toast "Settings saved"
- Code cleared: Toast "Workspace cleared"
- API key validated: Green checkmark + "Connection successful"

**Toast notifications:**
- Position: Bottom-right of screen
- Duration: 3 seconds auto-dismiss
- Style: Green background (#4caf50), white text
- Icon: Checkmark
- Stacking: Max 3 toasts, oldest dismissed first
- Dismissible: Click to dismiss immediately

**Inline feedback:**
- AI response complete: Subtle highlight flash on message
- Input cleared: Smooth fade-out
- Selection made: Immediate highlight
- Button pressed: Ripple effect (subtle)

**And** feedback is accessible:
- Success toasts: aria-live="assertive"
- Screen reader announces: "Thread created successfully"
- Visual feedback doesn't rely on color alone (icons + text)

**And** feedback is subtle:**
- No modal dialogs for success (only errors/confirmations)
- No disruptive animations
- Professional, minimal style
- Doesn't interrupt user flow

**Prerequisites:** All features complete

**Technical Notes:**
- Create Toast component with shadcn/ui
- Implement toast manager with queueing
- Add success feedback to all actions
- Use Framer Motion for smooth animations
- Keep animations <300ms
- Make dismissible by default

---

### Story 5.9: Responsive Design and Mobile Considerations

As a user on different devices,
I want the application to work well on my screen size,
So that I can use it on laptop, desktop, or tablet.

**Acceptance Criteria:**

**Given** I access the application on different screen sizes
**When** I view the interface
**Then** it should adapt:

**Desktop (>1200px) - Primary experience:**
- Side-by-side: Code 60%, Thread panel 40%
- All features available
- Resizable split pane
- Full keyboard shortcuts

**Laptop (900-1200px) - Adjusted:**
- Code 55%, Thread panel 45%
- Minimap off by default
- Slightly reduced spacing
- All features functional

**Tablet (600-900px) - Adapted:**
- Bottom sheet pattern for threads
- Code takes full width
- Thread panel slides up from bottom
- Swipe gestures: Up to expand, down to collapse
- Touch-friendly targets (48x48px minimum)

**Mobile (<600px) - Limited:**
- View-only mode recommended
- Toggle between code view and thread view
- Simplified UI, fewer options
- Warning: "For best experience, use desktop"

**And** responsive behaviors:
- Fluid layout adapts to viewport
- No horizontal scrolling (except code)
- Text remains readable (no tiny fonts)
- Touch targets adequate (44x44px minimum)

**And** tested on:**
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Desktop, laptop, tablet screen sizes
- Works without JavaScript? No (app requires JS)

**Prerequisites:** All features complete

**Technical Notes:**
- Use Tailwind responsive breakpoints (sm, md, lg, xl)
- Test with browser DevTools responsive mode
- Implement bottom sheet for tablet (Framer Motion)
- Add touch event handlers for mobile
- Disable complex features on mobile (create threads)
- Add viewport meta tag for mobile
- Test on real devices (iPad, MacBook, desktop monitor)

---

### Story 5.10: High Contrast Mode Support

As a user with visual impairments,
I want high contrast mode support,
So that I can see all interface elements clearly.

**Acceptance Criteria:**

**Given** I use high contrast mode
**When** I enable it in my system or browser
**Then** the application should:

**Detect high contrast preference:**
- Use prefers-contrast: high media query
- Auto-apply high contrast styles
- User can manually enable: Settings toggle

**High contrast adjustments:**
- Increased contrast ratios:
  - Text: 7:1 minimum (AAA level)
  - UI components: 4.5:1 minimum
- Stronger borders (2px instead of 1px)
- More distinct colors (no subtle grays)
- Focus indicators extra bold (3px instead of 2px)

**Maintained functionality:**
- All features work in high contrast
- Thread colors still distinguishable (use patterns too)
- Icons remain visible
- No information lost (color not sole indicator)

**Color alternatives:**
- Thread markers: Use number + pattern, not just color
- Status indicators: Icons + color
- Success/error: Icons + color + text

**And** user control:**
- Settings: "Enable High Contrast" toggle
- Overrides auto-detection
- Persists across sessions

**Prerequisites:** Story 5.1 (Theme Switching)

**Technical Notes:**
- Add prefers-contrast media query
- Create high contrast color variants in Tailwind
- Increase border widths in high contrast mode
- Test with Windows High Contrast themes
- Ensure WCAG AAA contrast ratios
- Add patterns/textures for thread distinction

---

### Story 5.11: Production Build and Deployment Readiness

As a developer,
I want to create an optimized production build,
So that the application can be deployed efficiently.

**Acceptance Criteria:**

**Given** development is complete
**When** I run the production build
**Then** the system should:

**Build optimization:**
- `npm run build` creates optimized dist/
- TypeScript compilation passes (no errors)
- Code splitting by route
- Tree shaking removes unused code
- Minification + compression (gzip/brotli)
- Source maps generated for debugging

**Bundle size targets:**
- Initial bundle: <500KB gzipped (per Architecture)
- Monaco Editor: Lazy-loaded separately
- Total assets: <2MB

**Build verification:**
- No console errors in production build
- All environment variables resolved
- API calls work with production config
- Favicon and manifest present

**Deployment config:**
- vercel.json or netlify.toml configured
- SPA routing: All routes redirect to index.html
- CORS headers if needed
- HTTPS enforced
- Cache headers: Static assets 1 year, index.html no cache

**And** documentation:**
- README.md with:
  - Setup instructions
  - Build commands
  - Deployment steps
  - Environment variable setup
  - Troubleshooting section
- CONTRIBUTING.md for developers
- LICENSE file (if open source)

**Prerequisites:** All stories complete

**Technical Notes:**
- Configure Vite build settings
- Optimize bundle with rollup-plugin-visualizer
- Add compression in vite.config.ts
- Create deployment config files
- Test production build locally with `npm run preview`
- Prepare for Vercel/Netlify deployment
- Document deployment process

---

## FR Coverage Matrix

This matrix shows which epic and story addresses each functional requirement:

| FR | Description | Epic | Story |
|----|-------------|------|-------|
| FR1 | Paste code into editor | 2 | 2.2 |
| FR2 | Type/edit code in editor | 2 | 2.2 |
| FR3 | Auto-detect language | 2 | 2.3 |
| FR4 | Manual language selection | 2 | 2.3 |
| FR5 | Apply syntax highlighting | 2 | 2.4 |
| FR6 | Display line numbers | 2 | 2.1, 2.2 |
| FR7 | Support multiple languages | 2 | 2.3 |
| FR8 | Clear all code | 2 | 2.5, 5.3 |
| FR9 | Select lines by clicking | 3 | 3.1 |
| FR10 | Select range by dragging | 3 | 3.1 |
| FR11 | Highlight selected code | 3 | 3.1 |
| FR12 | Create thread on selection | 3 | 3.3 |
| FR13 | Show thread creation UI contextually | 3 | 3.2 |
| FR14 | Cancel thread creation | 3 | 3.3 |
| FR15 | Associate thread with line range | 3 | 3.3 |
| FR16 | Visual indicators for active threads | 3 | 3.4 |
| FR17 | View list of all threads | 3 | 3.5 |
| FR18 | Expand individual threads | 3 | 3.6 |
| FR19 | Collapse individual threads | 3 | 3.6 |
| FR20 | Delete threads | 3 | 3.7 |
| FR21 | Maintain thread state | 3 | 3.6 |
| FR22 | Mark threads as resolved | 3 | 3.6 |
| FR23 | Distinguish resolved vs active | 3 | 3.6 |
| FR24 | Navigate threads with keyboard | 3 | 3.5, 5.4 |
| FR25 | Multiple independent threads | 3 | 3.3, 3.4 |
| FR26 | Threads stay with code on edit | 3 | 3.8 |
| FR27 | Type questions in thread | 4 | 4.3 |
| FR28 | Send message + code + context to AI | 4 | 4.2, 4.4 |
| FR29 | Include metadata in AI context | 4 | 4.2 |
| FR30 | Display AI response in thread | 4 | 4.4 |
| FR31 | Send follow-up messages | 4 | 4.5 |
| FR32 | Maintain conversation history | 4 | 4.5 |
| FR33 | Loading indicator for AI | 4 | 4.4 |
| FR34 | View full conversation history | 4 | 4.5 |
| FR35 | Handle AI API errors gracefully | 4 | 4.7 |
| FR36 | Retry failed AI requests | 4 | 4.7 |
| FR37 | Include selected code in prompt | 4 | 4.2 |
| FR38 | Include surrounding context in prompt | 4 | 4.2 |
| FR39 | Include language in prompt | 4 | 4.2 |
| FR40 | Format context for AI understanding | 4 | 4.2 |
| FR41 | Limit context size for token limits | 4 | 4.2 |
| FR42 | Provide AI API key | 4 | 4.6 |
| FR43 | Select AI provider | 4 | 4.6 |
| FR44 | Validate API key | 4 | 4.6 |
| FR45 | Switch light/dark themes | 5 | 5.1 |
| FR46 | Persist theme preference | 5 | 5.1 |
| FR47 | Adjust editor font size | 5 | 5.2 |
| FR48 | Configure context window size | 5 | 5.2 |
| FR49 | Clear data on page refresh (MVP) | 5 | 5.3 |
| FR50 | Manually clear session | 5 | 5.3 |
| FR51 | Warn before clearing session | 5 | 5.3 |
| FR52 | Keyboard shortcuts for all actions | 5 | 5.4 |
| FR53 | ARIA labels for screen readers | 5 | 5.5 |
| FR54 | Focus indicators on elements | 5 | 5.4 |
| FR55 | Navigate thread list with keyboard | 5 | 5.4 |
| FR56 | High contrast mode support | 5 | 5.10 |
| FR57 | Clear error messages for AI failures | 4 | 4.7, 5.7 |
| FR58 | Validation errors for config | 4 | 4.6, 5.7 |
| FR59 | Success feedback for actions | 5 | 5.8 |
| FR60 | Dismiss error messages | 5 | 5.7 |
| FR61 | Guidance when no API key | 4 | 4.6 |
| FR62 | Syntax highlighting <100ms | 2 | 2.4, 5.6 |
| FR63 | Thread operations <50ms | 3 | 3.3, 5.6 |
| FR64 | Progressive AI response display | 4 | 4.4 |
| FR65 | Non-blocking UI during AI calls | 4 | 4.4, 5.6 |

---

## Summary

**Epic Breakdown Complete!**

This document provides a comprehensive breakdown of the AI-Powered Code Review Assistant into 5 epics and 38 implementable stories.

**Epic Summary:**
- **Epic 1: Foundation** (6 stories) - Technical foundation and project setup
- **Epic 2: Code Editor** (6 stories) - Monaco editor integration and code input
- **Epic 3: Thread Management** (8 stories) - Multi-thread system with visual indicators
- **Epic 4: AI Integration** (7 stories) - Anthropic Claude API with streaming
- **Epic 5: Polish** (11 stories) - Accessibility, performance, and production readiness

**Total Stories:** 38 vertically-sliced, independently deployable stories

**FR Coverage:** All 65 functional requirements from PRD mapped to specific stories

**Context Incorporated:**
- PRD requirements (all 65 FRs)
- UX Design specifications (component designs, interaction patterns, theme)
- Architecture decisions (tech stack, data models, API patterns)

**Ready for Phase 4:** This epic breakdown is ready for sprint planning and implementation by development agents.

---

_For implementation: Each story is sized for single dev agent completion and includes detailed acceptance criteria, technical notes, and prerequisites._

_Next Steps: Run Sprint Planning workflow to create implementation schedule._

