# AI-Powered Code Review Assistant

https://andepants.github.io/code-review/

**How to run it**
Run `npm install` to install dependencies, then `npm run dev` to start the local server. Or just got to the live link above.

You do need Claude API key to run it. You can get it from [claude](https://console.anthropic.com/settings/keys).

**Key architectural decisions**
I utilized React and Vite for a performant frontend, coupled with Zustand for lightweight global state management. The Monaco Editor was integrated to mimic a professional IDE experience. Tailwind CSS was used for styling to maintain design consistency and development speed.

**What you'd do differently with more time**
- I would build a dedicated backend service to proxy API calls, ensuring API keys remain secure (aws lambda or firebase functions)
- Add suppport for different LLMS (besides Claude)
- I would also implement a comprehensive testing suite with Vitest and add user authentication for data persistence across sessions.
- I would also add agent web search to the code review process + get up to date documentation (context7).

**How you used AI tools (if applicable)**
*What you used AI for*
- I leveraged AI (Claude Code Desktop) to generate a comprehensive PRD -> used [BMAD methodology](https://github.com/bmad-code-org/BMAD-METHOD?tab=readme-ov-file) to generate architecture, ux design, and sharding the PRD into Epics -> Stories -> Tasks.
- I use [Serena](https://github.com/oraios/serena) for semantic code retrieval + editing = faster llm code parsing in claude code.
- I started using AntiGravity as my new IDE for more UI changes in tandem w/ Claude Code.
- Then used custom AI Agents in Claude Code to execute + review code.

*How you verified or adapted its suggestions*
I manually reviewed all generated code, testing it in the browser to ensure it met requirements. I bug test, and confirm UX flow, and make corresponding changes.

*What worked well and what didn't*
- Strengths
    1. Iterating fast
    2. planning
    3. coming up with ideas/alternatives.
    4. parsing through files
- Limitations
    1. Without proper guard rails, it can start implementing or downloading files or setting up things you don’t want. Or break your app.
    2. High level understanding of the codebase
    3. resolving bugs without clear direction
    4. managing context
    5. getting into the same debugging loops
    6. critical thinking

**Trade-offs you made**
- I opted for client-side API key storage to simplify deployment. Only deployed to GitHub Pages for simplicity. If I were to deploy to a production environment, I would use a backend service to proxy API calls, ensuring API keys remain secure, MVP would most likely be a serverless function (Lambda or Firebase Fucntions).
