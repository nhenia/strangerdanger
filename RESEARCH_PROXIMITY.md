# Research: Real Proximity Implementation Strategy (Phase 3)

## Objective
To transition from simulated proximity to actual peer-to-peer detection while maintaining the core principles of **Total Anonymity** and **Zero Data Storage**.

## Technology Comparison (2025 Landscape)

### 1. Web Bluetooth API (BLE)
- **Pros:** True P2P, no server required, high accuracy for short-range (0-30m), low power.
- **Cons:**
  - **iOS Support:** Still non-existent in Safari/WebKit (requires Bluefy or similar specialized browsers).
  - **Android Support:** Excellent in Chrome/Edge.
  - **UX:** Requires user interaction to initiate a scan every time.
- **Verdict:** Ideal for Android-first or "Pro" users, but fails the "Low Friction" goal for the general iOS population.

### 2. Geolocation API (Ephemeral Matching)
- **Pros:** Universal support (iOS & Android), works in background (with limitations), no specialized hardware needed.
- **Cons:**
  - **Privacy:** Requires a central relay to match coordinates.
  - **Battery:** Frequent polling drains battery.
  - **Accuracy:** GPS can be inaccurate indoors (where PERMISSION is most useful).
- **Verdict:** Best for wide reach, but requires a very clever "Zero-Knowledge" relay server.

### 3. Web NFC
- **Pros:** Extremely low friction ("Tap to Permission").
- **Cons:** Very short range (centimeters), Android only, not suitable for "proximity" in a room.
- **Verdict:** Good for a secondary "Hard Handshake" but not for discovery.

---

## Proposed Technical Strategy: The "Ephemeral Relay" Hybrid

Since PERMISSION is a PWA first, and iOS is a significant part of the target audience, we recommend a **Hybrid Approach** for Phase 3:

### Step A: Ephemeral Proximity Relay (The "Whisper" Server)
Implement a lightweight, stateless WebSocket relay (e.g., using Bun or Go) that:
1.  **Accepts:** Encrypted location hashes (H3 or S2 cells) + a temporary public key from the PWA.
2.  **Matches:** Users within the same small geographic cell (e.g., 10m-20m radius).
3.  **Bridges:** Forwards handshake offers between matched peers.
4.  **Forgets:** All data is kept only in RAM and deleted after 60 seconds or upon disconnection.

### Step B: Bluetooth LE via Expo/Native (Optional)
For users who install the **Native Android APK** (already in the roadmap), we can implement `react-native-ble-plx`.
- This allows background discovery without a central server for Android users.
- PWA users will fallback to the Ephemeral Relay.

### Step C: Secure Handshake Protocol
Regardless of the discovery method (BLE or Geolocation), the actual handshake should use **Diffie-Hellman** key exchange:
1.  Peer A sends a public key via the relay/BLE.
2.  Peer B responds with their public key.
3.  Both derive a shared secret to decrypt the Visual Anchor script.
4.  **Zero Persistence:** The relay never sees the unencrypted scripts or anchors.

## Next Logical Steps for Implementation
1.  **Feasibility Prototype:** Create a small Node/Bun script using `socket.io` to test coordinate-based room joining.
2.  **Privacy Audit:** Ensure the coordinate hashing (e.g., GeoHash) is coarse enough to prevent tracking but fine enough for proximity.
3.  **Theme Integration:** Update the "Zen" and "Vapor" themes with real "Live" indicators when the relay is connected.
