# CODEX.md

## Project Nature

PhysioStroop is a static, installable/offline PWA built with vanilla HTML, CSS and JavaScript. It has no framework and no runtime dependencies.

## Strict Rules

- Do not rename HTML ids without checking every use in `js/app.js`.
- Do not remove classes used by CSS or JavaScript.
- Keep PRs small, focused and easy to test manually.
- Do not mix UI redesign, business logic changes and PWA/cache changes in the same PR when they can be separated.
- Do not add dependencies without a strong justification.
- Do not migrate the app to a framework.

## DOM/JS Contract to Protect

These ids are used by the app and must be treated as stable unless the matching JavaScript is updated deliberately:

- `screen-menu`
- `screen-countdown`
- `screen-session`
- `screen-end`
- `lang-select`
- `mode-select`
- `colors-select`
- `session-duration`
- `stim-duration`
- `auto-only`
- `autorestart`
- `darkmode`
- `start-btn`
- `stop-btn`
- `stimulus`
- `end-autorestart`
- `restart-btn`
- `menu-btn`
- `intro-fr`
- `intro-en`
- `intro-summary`
- `about-fr`
- `about-en`
- `about-summary`

Sensitive classes:

- `screen`
- `active`
- `countdown`
- `install-note`
- `install-note-en`
- `body.dark`
- `word`
- `stop`
- `primary`
- `group`
- `group.row`
- `actions`
- `subtle`

## PWA and Cache Rules

- If `index.html`, `css/style.css`, `js/app.js`, `manifest.webmanifest` or `service-worker.js` changes, verify whether `CACHE_NAME` should be incremented.
- Avoid mixing UI PRs and cache/versioning PRs when possible.
- Keep `index.html` and `service-worker.js` aligned if assets become versioned with query strings.

## Manual Test Checklist

- Automatic mode.
- Manual mode.
- 4-color set.
- 6-color set.
- French UI.
- English UI.
- Dark mode.
- Countdown.
- Stop button.
- Autorestart.
- Offline/PWA behavior.
- Mobile viewport around 390-430 px.
- No console errors.
