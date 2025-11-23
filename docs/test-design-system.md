# System-Level Test Design: AI-Powered Code Review Assistant

**Date:** 2025-11-21
**Author:** TEA (Test Engineer Architect)
**Status:** Draft
**Project:** AI-Powered Code Review Assistant
**Project Type:** Greenfield
**Design Level:** System-Level (Phase 3 - Testability Review)

---

## Executive Summary

**Scope:** System-level testability assessment for the AI-Powered Code Review Assistant before implementation readiness gate check.

**Risk Summary:**
- Total risks identified: 12
- High-priority risks (≥6): 4
- Critical categories: SEC (2), PERF (1), TECH (1), DATA (0), BUS (0), OPS (0)

**Testability Assessment:**
- Controllability: **PASS** (with recommendations)
- Observability: **CONCERNS** (AI response determinism)
- Reliability: **PASS** (with recommendations)

**Test Levels Strategy:**
- Unit: 30% (business logic, validation)
- Integration: 40% (API contracts, AI integration)
- E2E: 30% (critical user journeys)

**Recommended Effort for Sprint 0:**
- Framework setup: 16 hours (2 days)
- CI pipeline configuration: 8 hours (1 day)
- Test data factories: 8 hours (1 day)
- NFR baseline tests: 16 hours (2 days)
- **Total Sprint 0**: 48 hours (6 days)

---

## Testability Assessment

### Controllability: PASS (with recommendations)

**Definition:** Can we control system state for testing?

**Assessment:**

✅ **STRENGTHS:**
- **API seeding possible**: Code editor content, conversation threads, AI responses can be seeded via API/fixtures
- **External dependencies mockable**: AI API (OpenAI/Anthropic) can be mocked with deterministic responses
- **State isolation**: Multiple conversation threads are independent, supporting parallel test execution
- **Fault injection possible**: Error conditions (AI API failures, network timeouts) can be triggered via mocking

✅ **RECOMMENDATIONS:**
1. **AI Response Mocking Strategy**: Implement response fixtures for common AI scenarios (good feedback, refactoring suggestion, error detection)
2. **Code Context Factories**: Create faker-based factories for generating realistic code snippets in multiple languages
3. **Thread State Management**: Implement API endpoints for setting up complex conversation states (e.g., 5 threads with 10 messages each)
4. **Selection Range Utilities**: Helper functions to generate valid code selection ranges (start line, end line, column ranges)

**Implementation Notes:**
```typescript
// Example: AI Response Mock Pattern
const mockAIResponses = {
  'code_review_positive': 'This looks good! The function is well-structured.',
  'code_review_refactor': 'Consider extracting this logic into a separate function for better readability.',
  'code_review_security': 'WARNING: This code is vulnerable to SQL injection. Use parameterized queries.',
};

// Test setup
await context.route('**/api/ai/analyze', (route) => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ response: mockAIResponses['code_review_security'] })
  });
});
```

---

### Observability: CONCERNS (AI response determinism)

**Definition:** Can we inspect system state and validate results?

**Assessment:**

⚠️ **CONCERNS:**
- **AI response non-determinism**: Real AI API responses vary even with identical input, making assertions difficult
- **Context window validation**: Hard to verify "enough context" was provided to AI without inspecting API payloads
- **Performance metrics**: No explicit SLOs defined for AI response latency (sub-second? 5 seconds? 10 seconds?)

✅ **STRENGTHS:**
- **UI state observable**: Code editor content, thread positions, conversation history are DOM-inspectable
- **API contracts testable**: Request/response payloads for AI integration can be captured and validated
- **Visual indicators**: Comment threads are visually tied to code sections (observable via screenshots)

✅ **RECOMMENDATIONS:**
1. **AI Telemetry Headers**: Add `X-AI-Model`, `X-AI-Tokens-Used`, `X-Response-Time` headers to AI API responses for observability
2. **Deterministic Test Mode**: Implement `MOCK_AI=true` environment variable to use fixture responses (eliminates non-determinism)
3. **Context Logging**: Log the exact code context sent to AI (surrounding lines, language detected) for debugging
4. **SLO Definition**: Define explicit performance targets (e.g., "90% of AI responses in <3 seconds")
5. **Structured Error Responses**: AI API errors should return structured JSON with error codes, not just status 500

**Implementation Notes:**
```typescript
// Example: Telemetry validation
test('AI response includes telemetry headers', async ({ request }) => {
  const response = await request.post('/api/ai/analyze', {
    data: { code, selection, language: 'javascript' }
  });

  expect(response.headers()['x-ai-model']).toBeTruthy(); // e.g., 'gpt-4'
  expect(response.headers()['x-ai-tokens-used']).toMatch(/\d+/);
  expect(response.headers()['x-response-time']).toMatch(/\d+ms/);
});
```

---

### Reliability: PASS (with recommendations)

**Definition:** Are tests isolated, reproducible, and components loosely coupled?

**Assessment:**

✅ **STRENGTHS:**
- **Parallel-safe design**: Multiple conversation threads are independent (no shared state)
- **Stateless interactions**: Each AI request is independent (no session-based context)
- **Loosely coupled components**: Code editor, AI service, thread manager can be tested independently

✅ **RECOMMENDATIONS:**
1. **Retry Logic**: Implement exponential backoff for transient AI API failures (3 attempts with backoff)
2. **Circuit Breaker**: If AI API fails 5 times in 1 minute, show graceful degradation UI ("AI temporarily unavailable")
3. **Offline Mode**: Allow users to continue editing/selecting code even when AI API is down
4. **Test Data Cleanup**: Auto-delete conversation threads created during tests (fixture teardown)
5. **HAR Capture**: Capture network traffic (HAR files) for failed AI requests to debug non-deterministic issues

**Implementation Notes:**
```typescript
// Example: Circuit breaker test
test('circuit breaker opens after 5 AI failures', async ({ page, context }) => {
  let failureCount = 0;

  await context.route('**/api/ai/analyze', (route) => {
    failureCount++;
    route.fulfill({ status: 503, body: JSON.stringify({ error: 'Service Unavailable' }) });
  });

  await page.goto('/editor');
  await page.getByText('Select code to analyze').fill('const x = 1;');
  await page.getByText('Ask AI').click();

  // Wait for circuit breaker to open
  await expect(page.getByText('AI temporarily unavailable')).toBeVisible({ timeout: 10000 });

  // Verify stopped retrying after threshold
  expect(failureCount).toBeLessThanOrEqual(5);
});
```

---

## Architecturally Significant Requirements (ASRs)

### ASR-1: AI Integration Security (Score: 9 - CRITICAL)

**Requirement:** AI API keys must never be exposed to client-side code or logs.

**Rationale:** API keys in browser DevTools or client-side code = security breach + cost abuse.

**Probability:** 3 (Likely - common mistake in demos/prototypes)
**Impact:** 3 (Critical - compromised API keys = financial loss + security breach)
**Score:** 9 (CRITICAL BLOCKER)

**Testability Challenge:** Hard to validate "never logged" across all failure scenarios.

**Mitigation:**
- **Backend Proxy**: AI API calls MUST go through backend proxy, never directly from browser
- **Security Tests**: Validate API keys never appear in browser console, network tab, or error messages
- **Secret Scanning**: Add pre-commit hook to detect hardcoded API keys (gitleaks, truffleHog)

**Verification Test:**
```typescript
test('API keys never exposed to client', async ({ page }) => {
  const consoleLogs: string[] = [];
  page.on('console', (msg) => consoleLogs.push(msg.text()));

  // Trigger AI API error
  await context.route('**/api/ai/analyze', (route) => {
    route.fulfill({ status: 500, body: JSON.stringify({ error: 'Internal Error' }) });
  });

  await page.goto('/editor');
  await page.getByRole('button', { name: 'Ask AI' }).click();

  // Verify API key never appears in console or DOM
  const pageContent = await page.content();
  expect(pageContent).not.toContain('sk-'); // OpenAI key prefix
  expect(pageContent).not.toContain('api_key');
  expect(consoleLogs.join('\n')).not.toContain('sk-');
});
```

---

### ASR-2: AI Response Latency (Score: 6 - HIGH)

**Requirement:** AI responses should provide feedback within 5 seconds (p95).

**Rationale:** Slow AI responses degrade UX; users expect near-real-time feedback like Copilot.

**Probability:** 2 (Possible - GPT-4 can be slow, especially for large contexts)
**Impact:** 3 (Critical - users abandon tool if too slow)
**Score:** 6 (HIGH PRIORITY)

**Testability Challenge:** AI latency varies based on model load, token count, context size.

**Mitigation:**
- **Performance Budget**: p95 AI response < 5 seconds (measure with k6 load tests)
- **Streaming Responses**: Consider streaming AI responses (tokens arrive incrementally, not all-at-once)
- **Loading Indicators**: Show progress spinner with "AI is thinking..." message
- **Timeout Handling**: 10-second timeout with retry option ("Request timeout. Try again?")

**Verification Test (k6):**
```javascript
// tests/nfr/performance-ai.k6.js
import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

const aiResponseTime = new Trend('ai_response_time');

export const options = {
  thresholds: {
    'ai_response_time': ['p(95)<5000'], // 95th percentile < 5 seconds
  },
  stages: [
    { duration: '2m', target: 10 }, // 10 concurrent users
  ],
};

export default function () {
  const payload = {
    code: 'function calculateTotal(items) { /* 50 lines of code */ }',
    selection: { start: 1, end: 50 },
    language: 'javascript',
    prompt: 'Is there a clearer way to write this?',
  };

  const response = http.post(`${__ENV.BASE_URL}/api/ai/analyze`, JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,
  });

  aiResponseTime.add(response.timings.duration);
}
```

---

### ASR-3: Multi-Language Syntax Highlighting (Score: 6 - HIGH)

**Requirement:** Code editor must support syntax highlighting for JavaScript, Python, TypeScript, Go, Rust, Java, C++.

**Rationale:** Poor syntax highlighting = degraded UX; users won't use tool if their language isn't supported.

**Probability:** 2 (Possible - depends on chosen editor library)
**Impact:** 3 (Critical - blocks adoption if primary languages unsupported)
**Score:** 6 (HIGH PRIORITY)

**Testability Challenge:** Visual regression testing required (screenshots of syntax highlighting).

**Mitigation:**
- **Editor Library Selection**: Use Monaco (VS Code) or CodeMirror (battle-tested, multi-language)
- **Language Auto-Detection**: Detect language from file extension or first line (`#!/usr/bin/python`)
- **Visual Regression Tests**: Capture screenshots of code samples in each language, compare pixel diffs
- **Accessibility**: Ensure syntax colors have sufficient contrast (WCAG AA)

**Verification Test:**
```typescript
test('syntax highlighting works for JavaScript', async ({ page }) => {
  await page.goto('/editor');

  const jsCode = `function hello() {\n  console.log('Hello');\n}`;
  await page.locator('.code-editor').fill(jsCode);

  // Wait for syntax highlighting to apply
  await page.waitForTimeout(500);

  // Verify keywords are highlighted (check CSS class applied)
  const functionKeyword = page.locator('.code-editor .keyword').first();
  await expect(functionKeyword).toHaveText('function');

  // Visual regression (pixel-perfect screenshot)
  await expect(page.locator('.code-editor')).toHaveScreenshot('js-syntax-highlight.png');
});
```

---

### ASR-4: Conversation Thread State Management (Score: 4 - MEDIUM)

**Requirement:** Support multiple independent comment threads on different code sections without conflict.

**Rationale:** Core feature differentiator ("inline comments meet AI assistant").

**Probability:** 2 (Possible - complex state management)
**Impact:** 2 (Degraded - thread collision = confusing UX but not blocking)
**Score:** 4 (MEDIUM PRIORITY)

**Testability Challenge:** Need to test thread isolation (thread A edits don't affect thread B).

**Mitigation:**
- **Thread ID Mapping**: Each thread has unique ID tied to code range (start line, end line)
- **State Isolation Tests**: Create 10 threads, verify updates to thread #3 don't affect thread #7
- **Visual Indicators**: Highlight code ranges with different colors per thread
- **Thread Overlap Handling**: Decide behavior if user creates overlapping selections

**Verification Test:**
```typescript
test('multiple threads remain isolated', async ({ page, apiRequest }) => {
  // Create 3 conversation threads via API
  const threads = [
    { id: 't1', range: { start: 1, end: 5 }, messages: ['Thread 1 message'] },
    { id: 't2', range: { start: 10, end: 15 }, messages: ['Thread 2 message'] },
    { id: 't3', range: { start: 20, end: 25 }, messages: ['Thread 3 message'] },
  ];

  for (const thread of threads) {
    await apiRequest.post('/api/threads', { data: thread });
  }

  await page.goto('/editor');

  // Update thread 2
  await page.getByTestId('thread-t2').click();
  await page.getByPlaceholder('Reply').fill('New message for thread 2');
  await page.getByRole('button', { name: 'Send' }).click();

  // Verify thread 1 and thread 3 unchanged
  const thread1Messages = await page.getByTestId('thread-t1').locator('.message').count();
  const thread3Messages = await page.getByTestId('thread-t3').locator('.message').count();

  expect(thread1Messages).toBe(1); // Still 1 message (unchanged)
  expect(thread3Messages).toBe(1); // Still 1 message (unchanged)

  // Verify thread 2 has 2 messages now
  const thread2Messages = await page.getByTestId('thread-t2').locator('.message').count();
  expect(thread2Messages).toBe(2);
});
```

---

## Test Levels Strategy

### Rationale for 30/40/30 Split (Unit/Integration/E2E)

**Why NOT 70/20/10 (typical API-heavy apps)?**
- This is a **UI-heavy application** with complex editor interactions and visual state
- Critical user journeys require full E2E validation (select code → ask AI → see response)
- AI integration is the core value prop, requiring significant integration testing

**Why NOT 40/30/30 (typical UI-heavy apps)?**
- Business logic is relatively simple (mostly pass-through to AI API)
- More focus on integration (AI API mocking, editor state management) than pure unit logic

**Recommended Distribution:**
- **Unit (30%)**: Input validation, code selection utils, text parsing, error handling logic
- **Integration (40%)**: AI API contracts, editor state management, thread persistence, auth flows
- **E2E (30%)**: Critical user journeys, visual regression, multi-thread interactions

---

### Unit Tests (30%)

**What to test:**
- **Input validation**: Valid code ranges (start < end), non-empty prompts, language detection
- **Text utilities**: Extract code context (surrounding lines), calculate token counts
- **Error formatters**: Convert AI API errors to user-friendly messages
- **Selection logic**: Validate overlapping ranges, merge adjacent selections

**Example scenarios:**
```typescript
// Unit test: Code range validation
describe('CodeRangeValidator', () => {
  it('should reject invalid ranges (start > end)', () => {
    const result = validateCodeRange({ start: 10, end: 5 });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Start line must be before end line');
  });

  it('should accept valid ranges', () => {
    const result = validateCodeRange({ start: 5, end: 10 });
    expect(result.valid).toBe(true);
  });
});
```

**Tools:** Jest/Vitest (fast, no framework dependencies)

---

### Integration Tests (40%)

**What to test:**
- **AI API contracts**: Request format, response structure, error handling (401, 429, 500)
- **Editor state management**: Code changes, selection ranges, thread positions persist correctly
- **Thread persistence**: Create/update/delete threads via API, verify database state
- **Authentication**: API key validation, rate limiting, unauthorized access handling

**Example scenarios:**
```typescript
// Integration test: AI API contract
test('AI API returns structured response', async ({ request }) => {
  const response = await request.post('/api/ai/analyze', {
    data: {
      code: 'const x = 1;',
      selection: { start: 1, end: 1 },
      language: 'javascript',
      prompt: 'Is this good?',
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toHaveProperty('response'); // AI text response
  expect(body).toHaveProperty('suggestions'); // Optional suggestions array
  expect(body.response).toBeTruthy();
});
```

**Tools:** Playwright API testing, Supertest (for Express APIs)

---

### E2E Tests (30%)

**What to test:**
- **Critical user journeys**: Paste code → select lines → ask AI → receive feedback → iterate
- **Visual regression**: Syntax highlighting, thread indicators, code range highlights
- **Multi-thread interactions**: Create 3 threads, verify visual indicators don't overlap
- **Error scenarios**: AI API timeout, network failure, invalid input handling

**Example scenarios:**
```typescript
// E2E test: Complete user journey
test('user can get AI feedback on selected code', async ({ page }) => {
  await page.goto('/editor');

  // Paste code
  const code = `function calculate(a, b) {\n  return a + b;\n}`;
  await page.locator('.code-editor').fill(code);

  // Select lines 1-3
  await page.locator('.code-editor').click();
  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.up('Shift');

  // Ask AI
  await page.getByRole('button', { name: 'Ask AI' }).click();
  await page.getByPlaceholder('What do you want to know?').fill('Is this clear?');
  await page.getByRole('button', { name: 'Submit' }).click();

  // Wait for AI response (mock or real)
  await expect(page.getByText('AI Response:')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.ai-response')).toContainText(/clear|good|readable/i);
});
```

**Tools:** Playwright E2E, Cypress

---

## NFR Testing Approach

### Security (SEC)

**Key Risks:**
- **R-001**: API keys exposed in client-side code (Score: 9 - CRITICAL)
- **R-002**: XSS via malicious AI responses (Score: 6 - HIGH)

**Testing Approach:**
- **Playwright E2E**: Validate API keys never appear in console, DOM, network tab
- **Security Tools**: OWASP ZAP scan, npm audit for dependency vulnerabilities
- **Manual Testing**: Attempt XSS injection in AI prompts (`<script>alert('XSS')</script>`)

**Validation Criteria:**
- ✅ PASS: API keys never exposed, XSS blocked, no critical vulnerabilities
- ⚠️ CONCERNS: Non-critical vulnerabilities with mitigation plan
- ❌ FAIL: API keys exposed or XSS successful

**Example Test:**
```typescript
test('AI responses are sanitized (XSS blocked)', async ({ page }) => {
  await page.goto('/editor');

  // Mock AI response with XSS payload
  await context.route('**/api/ai/analyze', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ response: '<script>alert("XSS")</script>' })
    });
  });

  await page.getByRole('button', { name: 'Ask AI' }).click();
  await page.getByPlaceholder('Prompt').fill('Test');
  await page.getByRole('button', { name: 'Submit' }).click();

  // Wait for response
  await expect(page.locator('.ai-response')).toBeVisible();

  // Verify XSS is escaped (not executed)
  const responseText = await page.locator('.ai-response').textContent();
  expect(responseText).toContain('&lt;script&gt;'); // Escaped
  expect(responseText).not.toContain('<script>'); // Raw HTML
});
```

---

### Performance (PERF)

**Key Risks:**
- **R-003**: AI response latency > 5s (Score: 6 - HIGH)

**Testing Approach:**
- **k6 Load Testing**: Simulate 10 concurrent users, measure p95 AI response time
- **Lighthouse**: Validate Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **Profiling**: Use Chrome DevTools to identify slow editor rendering

**Validation Criteria:**
- ✅ PASS: p95 AI response < 5s, LCP < 2.5s
- ⚠️ CONCERNS: p95 approaching 5s (4.8s) or missing baselines
- ❌ FAIL: p95 > 5s or LCP > 2.5s

**Example Test (k6):**
```javascript
// See ASR-2 for full k6 test
export const options = {
  thresholds: {
    'ai_response_time': ['p(95)<5000'],
  },
};
```

---

### Reliability (Reliability)

**Key Risks:**
- **R-004**: AI API outages crash application (Score: 4 - MEDIUM)

**Testing Approach:**
- **Playwright E2E**: Mock AI API failures (500, 503), verify graceful degradation
- **Circuit Breaker**: Validate app stops retrying after 5 failures
- **Retry Logic**: Validate exponential backoff (1s, 2s, 4s delays)

**Validation Criteria:**
- ✅ PASS: Graceful error messages, circuit breaker works, retries have backoff
- ⚠️ CONCERNS: Missing circuit breaker or no telemetry
- ❌ FAIL: App crashes on API failure or infinite retries

**Example Test:**
```typescript
// See Reliability section for circuit breaker test
```

---

### Maintainability (Maintainability)

**Key Risks:**
- None identified (low code complexity)

**Testing Approach:**
- **CI Tools (GitHub Actions)**: Test coverage ≥80%, code duplication <5%, no critical vulnerabilities
- **Playwright (Observability)**: Validate error tracking (Sentry capture), structured logging

**Validation Criteria:**
- ✅ PASS: Coverage ≥80%, duplication <5%, error tracking validated
- ⚠️ CONCERNS: Coverage 60-79% or duplication 5-10%
- ❌ FAIL: Coverage <60% or no error tracking

**Example CI Job:**
```yaml
# .github/workflows/quality.yml
- name: Check test coverage
  run: |
    npm run test:coverage
    COVERAGE=$(jq '.total.lines.pct' coverage/coverage-summary.json)
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "❌ FAIL: Coverage $COVERAGE% below 80%"
      exit 1
    fi
```

---

## Test Environment Requirements

### Local Development
- **Code Editor Library**: Monaco Editor or CodeMirror (choose based on licensing)
- **AI API Mock Server**: MSW (Mock Service Worker) for deterministic responses
- **Database**: SQLite for local thread persistence (if needed)
- **Browser**: Chromium (Playwright default)

### CI/CD (GitHub Actions)
- **Playwright**: Headless browser tests with video capture on failure
- **k6**: Performance tests (Docker container)
- **Security Scans**: npm audit, OWASP ZAP (scheduled weekly)

### Staging Environment
- **AI API**: Real OpenAI/Anthropic API with test account (rate limits)
- **Database**: PostgreSQL (if threads persist across sessions)
- **Monitoring**: Sentry for error tracking, Datadog for APM

---

## Testability Concerns

### Concern 1: AI Response Non-Determinism

**Issue:** Real AI API responses vary, making automated assertions difficult.

**Impact:** Tests may fail randomly if asserting exact AI text.

**Recommendation:**
- Use `MOCK_AI=true` for deterministic tests (fixture responses)
- For real AI tests, use fuzzy assertions (`toContain('refactor')` instead of exact match)
- Validate structure, not content (response has `suggestions` array, not specific suggestions)

**Status:** CONCERNS (not a blocker, but requires careful test design)

---

### Concern 2: Visual Regression Testing Complexity

**Issue:** Syntax highlighting and thread indicators are visual features requiring screenshot comparisons.

**Impact:** Pixel-diff tests are brittle (font rendering varies across OS).

**Recommendation:**
- Use Playwright's `toHaveScreenshot()` with threshold tolerance (2% pixel diff allowed)
- Test visual features on single platform (Ubuntu in CI) to avoid OS rendering differences
- Supplement with structural assertions (check CSS classes applied, not just visual appearance)

**Status:** CONCERNS (manageable with proper tooling)

---

### Concern 3: Performance SLO Definition Missing

**Issue:** No explicit SLO defined for AI response latency.

**Impact:** Can't validate "fast enough" without threshold.

**Recommendation:**
- Define SLO: "95% of AI responses complete in <5 seconds"
- Validate SLO with k6 load tests in CI (block release if p95 > 5s)
- Add telemetry headers (`X-Response-Time`) for observability

**Status:** CONCERNS (can define SLO in Sprint 0)

---

## Recommendations for Sprint 0

### 1. Framework Setup (16 hours)

**Tasks:**
- Install Playwright (`npm install -D @playwright/test`)
- Configure test directory structure (`tests/e2e`, `tests/integration`, `tests/unit`)
- Set up fixtures (`playwright/support/fixtures/`)
- Configure code editor library (Monaco or CodeMirror)

**Deliverables:**
- `playwright.config.ts` with parallel execution, video on failure, retries
- Sample test demonstrating code editor interaction
- AI API mock setup (MSW)

---

### 2. CI Pipeline Configuration (8 hours)

**Tasks:**
- Create GitHub Actions workflow (`.github/workflows/test.yml`)
- Configure staged jobs: smoke tests → P0 → P1 → P2
- Set up artifact uploads (videos, screenshots, trace files)
- Add coverage reporting (Codecov or Coveralls)

**Deliverables:**
- CI pipeline runs on every PR
- Test results posted as PR comments
- Failing tests block merge

---

### 3. Test Data Factories (8 hours)

**Tasks:**
- Create code snippet factory (`createCodeSnippet()` with faker)
- Create thread factory (`createThread()` with unique IDs)
- Create AI response fixtures (10 common scenarios)
- Implement auto-cleanup fixtures (delete threads after test)

**Deliverables:**
- `tests/utils/factories.ts` with all factories
- Documentation on how to use factories in tests

---

### 4. NFR Baseline Tests (16 hours)

**Tasks:**
- Security: API key exposure test, XSS sanitization test
- Performance: k6 baseline test (measure current latency), Lighthouse test
- Reliability: Circuit breaker test, retry logic test
- Maintainability: Coverage reporting setup

**Deliverables:**
- Baseline metrics captured (current p95 latency, coverage %)
- NFR tests passing (or documented failures for future fix)

---

## Risk Assessment Matrix

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description                                   | Probability | Impact | Score | Mitigation                              | Owner | Timeline   |
| ------- | -------- | --------------------------------------------- | ----------- | ------ | ----- | --------------------------------------- | ----- | ---------- |
| R-001   | SEC      | API keys exposed in client-side code/logs     | 3           | 3      | 9     | Backend proxy, security tests           | Dev   | Sprint 0   |
| R-002   | SEC      | XSS via malicious AI responses                | 2           | 3      | 6     | Sanitize AI output, Playwright XSS test | Dev   | Sprint 0   |
| R-003   | PERF     | AI response latency > 5s (p95)                | 2           | 3      | 6     | k6 load tests, SLO monitoring           | Dev   | Sprint 1   |
| R-004   | TECH     | Multiple threads cause state conflicts        | 2           | 2      | 4     | Thread isolation tests                  | Dev   | Sprint 1   |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description                                   | Probability | Impact | Score | Mitigation                     | Owner |
| ------- | -------- | --------------------------------------------- | ----------- | ------ | ----- | ------------------------------ | ----- |
| R-005   | PERF     | Large code files (10K+ lines) crash editor    | 1           | 3      | 3     | Test with 10K-line files       | QA    |
| R-006   | DATA     | Thread data lost on browser refresh           | 1           | 3      | 3     | LocalStorage persistence tests | Dev   |
| R-007   | BUS      | Unsupported language = poor UX                | 2           | 2      | 4     | Language detection tests       | Dev   |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description                                   | Probability | Impact | Score | Action  |
| ------- | -------- | --------------------------------------------- | ----------- | ------ | ----- | ------- |
| R-008   | OPS      | Deployment fails due to env var misconfigured | 1           | 2      | 2     | Monitor |
| R-009   | BUS      | Users confused by thread UI                   | 2           | 1      | 2     | Monitor |

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100% (no exceptions)
- **P1 pass rate**: ≥95%
- **High-risk mitigations (≥6)**: 100% complete or approved waivers
- **Security tests (SEC)**: 100% pass (R-001, R-002)

### Coverage Targets

- **Critical paths**: ≥80% (code editor interactions, AI integration, thread management)
- **Security scenarios**: 100% (API key protection, XSS blocking)
- **Business logic**: ≥70% (validation, error handling)

### Non-Negotiable Requirements

- [ ] All P0 tests pass
- [ ] R-001 (API key exposure) mitigated and verified
- [ ] R-002 (XSS) mitigated and verified
- [ ] Performance SLO defined (even if not met yet)

---

## Appendix

### Knowledge Base References

- `nfr-criteria.md` - NFR validation approach
- `test-levels-framework.md` - Test levels strategy guidance
- `risk-governance.md` - Risk classification and scoring
- `test-quality.md` - Quality standards and Definition of Done

### Related Documents

- Project Overview: `/Users/andre/coding/automattic/PROJECT_OVERVIEW.md`
- Workflow Status: `/Users/andre/coding/automattic/docs/bmm-workflow-status.yaml`

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `.bmad/bmm/testarch/test-design`
**Version**: 4.0 (BMad v6)
**Date**: 2025-11-21
