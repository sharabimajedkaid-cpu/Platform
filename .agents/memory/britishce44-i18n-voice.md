---
name: Bilingual i18n + voice welcome
description: How the EN/AR translation engine, the Basic-4+ English lock, and the login voice welcome are wired in the britishce44 web app.
---

# Bilingual i18n engine

- Lives in `artifacts/britishce44/src/lib/i18n.tsx`. Custom, dependency-free (no react-i18next).
- `LanguageProvider` is nested **inside** `AuthProvider` in `App.tsx` (it reads `useAuth()` to enforce the English lock). Order: QueryClient → AuthProvider → LanguageProvider → AppContent.
- `useI18n()` returns `{ lang, dir, isRTL, locked, setLang, toggleLang, t }`. `t(key)` falls back to the raw key when a translation is missing, so partial page coverage is safe — translate page bodies incrementally.
- Provider sets `document.documentElement.dir`/`lang` and toggles a `lang-ar` class for Arabic fonts (Cairo/Tajawal already loaded).
- Persists choice in `localStorage` key `b44_lang` ('en' | 'ar').

## Basic-4-and-above English lock
- `isEnglishLocked(user)` + `BASIC_ENGLISH_LOCK_LEVEL = 4` in i18n.tsx. Applies only to `role === 'student'` with `grade >= 4`.
- **Why:** the centre requires students at Basic 4 and above to study English-only — the platform disables the Arabic translator for them on login.
- **Assumption to confirm with user:** "Basic 4" is mapped to `User.grade >= 4`. The User model only has numeric `grade`; tune the threshold/mapping if the centre's level numbering differs.
- When locked, the topbar shows a `🔒 EN` badge instead of the language toggle, and `setLang`/`toggleLang` are no-ops.

# Voice welcome on login
- `artifacts/britishce44/src/lib/welcome-voice.ts` → `playWelcomeVoice(lang)`. Triggered in `login-page.tsx` `handleLogin` right after `await login(...)` (inside the click gesture, so autoplay is allowed).
- Plays a random clip from a pre-generated pool, avoiding immediate repeats, so users hear varied inspiring words each login.
- Clips live in `artifacts/britishce44/public/welcome/` as `en-1.mp3 … en-10.mp3` and `ar-1.mp3 … ar-6.mp3` (counts hard-coded in `CLIP_COUNT`). Referenced root-relative (`/welcome/...`), matching the existing image convention.
- Generated via the media-generation `textToSpeech` callback, model `eleven_multilingual_v2`, voice **Eleanor** (`2qQJWjw5XdG80GreshqG`, British, warm). No native Arabic voice exists in the catalog — Arabic uses the multilingual model with the same voice. To regenerate, re-run textToSpeech to the same output paths.
