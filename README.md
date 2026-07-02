# PhysioStroop

PhysioStroop is a static, dependency-free web app inspired by the Stroop test. It is designed as a rehabilitation and exercise support tool for attention, inhibition, visual discrimination and dual-task situations.

PhysioStroop is not a diagnostic or clinical measurement tool. It supports exercise and rehabilitation work, but it does not replace clinical reasoning or professional judgement.

## Current Version

- Visible app version: `1.0`
- Current service worker cache: `physiostroop-v3`
- CSS and JavaScript are not yet versioned with query strings in `index.html`; cache-busting/versioned assets should be handled in a dedicated PWA/cache PR.

## Project Structure

- `index.html`: application shell, menu, countdown screen, exercise screen, end screen, install/help/about content and service worker registration.
- `css/style.css`: visual layout, responsive basics, buttons, exercise word styling, dark mode and informational sections.
- `js/app.js`: UI language handling, screen navigation, countdown, session lifecycle, Stroop stimulus generation, manual/automatic modes, autorestart and Wake Lock.
- `service-worker.js`: PWA offline cache with `CACHE_NAME = "physiostroop-v3"`.
- `manifest.webmanifest`: installable PWA metadata, icons and app shortcuts.
- `icons/`: PWA icons.
- `README.md`: project documentation.
- `LICENCE`: licence information for code and assets.
- `CODEX.md`: contribution notes and DOM/JS contract for future small PRs.

## Features

- Automatic mode: stimuli advance after the configured display duration.
- Manual mode: tapping the session screen advances to the next stimulus.
- 4-color set: red, blue, green, yellow.
- 6-color set: red, blue, green, yellow, orange, purple/violet.
- French and English interface, with automatic language detection and `?lang=fr` / `?lang=en` support.
- Always-incongruent Stroop logic: the written word and ink color never match.
- Countdown before each session: `4`, `3`, `2`, `1`, `Go`.
- Configurable session duration.
- Optional autorestart after the end screen.
- Optional dark mode.
- PWA install support and offline use after caching.
- Wake Lock request during sessions when supported by the browser.

## PWA and Cache Notes

The app currently registers `service-worker.js` from `index.html`. The service worker precaches the app shell and uses:

- network-first behavior for navigations;
- stale-while-revalidate behavior for assets.

When changing `index.html`, `css/style.css`, `js/app.js`, `manifest.webmanifest`, icons or `service-worker.js`, verify whether `CACHE_NAME` should be incremented. Do not mix unrelated UI changes with cache/versioning changes when a small dedicated PR is possible.

## Roadmap

Already present:

- PWA manifest and service worker for offline use.
- Wake Lock request during sessions when available.
- Automatic and manual modes.
- French/English UI.
- 4-color and 6-color sets.
- Dark mode.

Possible future small PRs:

- Persist user preferences locally.
- Improve accessibility announcements for changing stimuli.
- Improve focus management between screens.
- Add explicit CSS/JS asset versioning in `index.html`.
- Improve mobile layout and stimulus sizing.
- Document manual test scenarios more thoroughly.

## Licence

- Source code: [PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0/).
- Assets and non-code contents: [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).

Non-commercial use, modification and distribution are allowed according to the terms of the respective licences.

© 2026 S. Herbaud — PhysioStroop project.
