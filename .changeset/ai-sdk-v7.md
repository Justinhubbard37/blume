---
"blume": minor
---

Upgrade the AI SDK to v7. The generated Ask AI endpoint now passes `instructions` instead of the deprecated `system` option, and the optional provider peer dependencies moved to their AI SDK 7-compatible majors: `@openrouter/ai-sdk-provider@^3` and `@ai-sdk/openai-compatible@^3`. If your Ask AI backend uses one of those providers, upgrade the provider package when you update Blume; gateway-backed setups need no changes.
