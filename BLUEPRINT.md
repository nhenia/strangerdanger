# PERMISSION: Project Blueprint

## Vision
PERMISSION is a proximity-based interaction tool designed for total user anonymity and zero data storage. It facilitates low-friction, context-aware social interactions in physical spaces using a "Visual Anchor" handshake system.

## Core Principles
- **Total Anonymity:** No accounts, no profiles, no tracking.
- **Privacy by Design:** Interaction types are hidden from matches until a handshake is established.
- **Contextual Safety:** A "No List" allows users to set boundaries before any interaction.
- **Aesthetic Flexibility:** Multiple UI themes to suit the user's current environment or mood.

## Technical Architecture
- **Framework:** React Native with Expo (Web/PWA focus).
- **State Management:** React Context (Theme) and Local State.
- **Persistence:** `@react-native-async-storage/async-storage` for local settings (No List, Active State, Theme, Preferences).
- **Handshake System:** Uses context-aware scripts based on interaction types and visual anchors.
- **Deployment:** Automated PWA deployment via GitHub Actions to GitHub Pages.

## Feature Roadmap

### Phase 1: Foundation (Current State)
- [x] Multi-theme engine (Glass, Vapor, Retro, Zen, Pager).
- [x] Theme-specific animations and UI components.
- [x] Basic interaction type selection (up to 3).
- [x] "No List" boundary setting.
- [x] Proximity simulation (Radar).
- [x] Visual Anchor handshake generation.
- [x] Automated PWA deployment.

### Phase 2: Refinement & Robustness (Next Steps)
- [x] Modularize proximity logic into hooks.
- [x] Implement Comprehensive Test Suite (Jest & Playwright).
- [x] Refine Radar simulation with more granular states (Scanning, Pinging, Matching).
- [x] Enhance Visual Anchor script variety (Added Humor and Mysterious categories).

### Phase 3: Real Proximity (Future)
- [ ] Research and implement actual proximity detection (Bluetooth LE, Web Bluetooth, or Geolocation-based).
- [ ] Implement secure, peer-to-peer handshake protocols.

## UI/UX Themes
1. **Glassmorphism (Glass):** Modern, translucent layers with bokeh background.
2. **Vaporwave (Vapor):** 80s aesthetic with neon colors and a moving grid.
3. **Retro (Retro):** Dark theme with scanlines and high-contrast accents.
4. **Zen:** Minimalist, clean, and light.
5. **The Pager:** Simulated LCD display with plastic case aesthetic and screen flicker.

## Project Guidelines
- All new features must include unit tests (Jest) and E2E verification (Playwright).
- Frontend verification requires 390x844 (mobile) viewport screenshots.
- Adhere to the zero-data-storage architectural constraint.
