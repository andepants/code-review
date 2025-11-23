/**
 * Mock AI responses for deterministic testing
 * Simulates the Anthropic API with predictable responses
 */

export interface MockResponse {
  delay?: number;
  content: string;
  error?: boolean;
}

export const MOCK_RESPONSES: Record<string, MockResponse> = {
  // Code review responses
  'review-function': {
    delay: 100,
    content: 'This function looks good! Here are some suggestions:\n\n1. Consider adding error handling for edge cases\n2. Add JSDoc comments for better documentation\n3. The logic is clear and well-structured',
  },
  'review-class': {
    delay: 150,
    content: 'Nice class implementation! Some improvements:\n\n1. Consider making properties private with getters/setters\n2. Add input validation in the constructor\n3. Document the public API with comments',
  },
  'security-review': {
    delay: 200,
    content: 'Security analysis:\n\n⚠️ Potential issues found:\n1. SQL query appears vulnerable to injection\n2. Consider using parameterized queries\n3. Add input sanitization before database operations',
  },
  'performance-review': {
    delay: 150,
    content: 'Performance analysis:\n\n1. This nested loop has O(n²) complexity\n2. Consider using a hash map for O(n) lookup\n3. The current implementation may be slow with large datasets',
  },
  'explain-code': {
    delay: 100,
    content: 'This code does the following:\n\n1. Iterates through an array\n2. Filters elements based on a condition\n3. Maps the results to a new format\n4. Returns the transformed data',
  },
  // Generic responses
  'follow-up': {
    delay: 80,
    content: 'Great question! To implement that, you would need to:\n\n1. Add the necessary imports\n2. Create the helper function\n3. Integrate it into your existing code',
  },
  'default': {
    delay: 100,
    content: 'I understand your question about this code. Let me provide some insights:\n\nThe code appears to be well-structured. Consider adding tests to ensure it works as expected.',
  },
  // Error responses
  'api-error': {
    delay: 50,
    error: true,
    content: 'API Error: Rate limit exceeded',
  },
  'network-error': {
    delay: 50,
    error: true,
    content: 'Network Error: Failed to connect to AI service',
  },
};

/**
 * Get a mock response based on the question content
 */
export function getMockResponse(question: string): MockResponse {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('security') || lowerQuestion.includes('vulnerable')) {
    return MOCK_RESPONSES['security-review'];
  }
  if (lowerQuestion.includes('performance') || lowerQuestion.includes('optimize')) {
    return MOCK_RESPONSES['performance-review'];
  }
  if (lowerQuestion.includes('explain') || lowerQuestion.includes('what does')) {
    return MOCK_RESPONSES['explain-code'];
  }
  if (lowerQuestion.includes('class')) {
    return MOCK_RESPONSES['review-class'];
  }
  if (lowerQuestion.includes('function') || lowerQuestion.includes('method')) {
    return MOCK_RESPONSES['review-function'];
  }

  return MOCK_RESPONSES['default'];
}

/**
 * Mock the Anthropic API by intercepting network requests
 */
export async function setupMockAI(page: any) {
  await page.route('https://api.anthropic.com/**', async (route: any) => {
    const request = route.request();
    const postData = request.postDataJSON();

    // Extract the user's question from the request
    const messages = postData?.messages || [];
    const lastMessage = messages[messages.length - 1];
    const question = lastMessage?.content || '';

    // Get appropriate mock response
    const mockResponse = getMockResponse(question);

    if (mockResponse.error) {
      await route.abort('failed');
      return;
    }

    // Simulate streaming response
    const chunks = mockResponse.content.split(' ');
    let responseText = '';

    // Create a streaming response
    await new Promise(resolve => setTimeout(resolve, mockResponse.delay || 100));

    // Send the complete response (simplified - not actually streaming in tests)
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'msg_test_' + Date.now(),
        type: 'message',
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: mockResponse.content,
          },
        ],
        model: 'claude-3-5-haiku-20241022', // Using Haiku for testing
        stop_reason: 'end_turn',
        usage: {
          input_tokens: 100,
          output_tokens: 50,
        },
      }),
    });
  });
}
