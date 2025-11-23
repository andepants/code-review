import { CodeReviewRequest } from '../../types';

export function buildPrompt(request: CodeReviewRequest): string {
  const {
    selection,
    userMessage,
    language,
    fileName,
    conversationHistory = [],
  } = request;

  let prompt = `You are a code review assistant. Analyze the following code and provide feedback.

LANGUAGE: ${language}`;

  if (fileName) {
    prompt += `\nFILE: ${fileName}`;
  }

  prompt += `

SELECTED CODE (lines ${selection.startLine}-${selection.endLine}):
\`\`\`${language}
${selection.selectedText}
\`\`\`
`;

  if (selection.contextBefore) {
    prompt += `
CONTEXT BEFORE:
\`\`\`${language}
${selection.contextBefore}
\`\`\`
`;
  }

  if (selection.contextAfter) {
    prompt += `
CONTEXT AFTER:
\`\`\`${language}
${selection.contextAfter}
\`\`\`
`;
  }

  if (conversationHistory.length > 0) {
    prompt += '\nCONVERSATION HISTORY:\n';
    conversationHistory.slice(-10).forEach((msg) => {
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      prompt += `${role}: ${msg.content}\n`;
    });
  }

  prompt += `
USER QUESTION:
${userMessage}

Provide specific, actionable feedback focusing on:
- Code quality and best practices
- Potential bugs or issues
- Performance considerations
- Suggestions for improvement

Be concise and reference specific line numbers when applicable.

FORMATTING INSTRUCTIONS:
Format your response using markdown with:
- Headers (# ##) for sections
- **Bold** text for emphasis
- Code blocks with language tags (\`\`\`javascript, \`\`\`python, etc.)
- Inline code for variable/function names (\`variableName\`)
- Bullet points for lists
- Numbered lists for sequential steps`;

  return prompt;
}
