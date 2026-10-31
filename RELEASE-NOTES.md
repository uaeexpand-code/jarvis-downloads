JARVIS 1.12.1 — Windows and Apple Silicon Mac

Fixes the first recording timing out and slow first replies after opening the app.

- Voice transcription and speech use direct ElevenLabs HTTP requests, avoiding a large SDK import on the first voice request.
- PC tools and the ChatGPT connection initialize in the background. Ordinary conversation can respond while PC services start; PC tasks wait for tool discovery when needed.
- Completed replies no longer wait for the four-second progress timer.
- Conversations, brain notes, saved connections and automatic backups stay in the existing workspace.

Both platform builds run cold-start, voice-contract, data-safety and updater regression tests. Mac desktop control still requires macOS Accessibility, Screen Recording and Automation permissions when used.
