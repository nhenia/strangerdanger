# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- New interaction script categories: **Humorous** and **Mysterious**.
- Expanded scripts for existing categories (Conversation, Silent, Activity).
- FIFO logic for interaction type selection (replaces oldest when limit of 3 is reached).

### Changed
- Refined proximity matching simulation with granular states: `Scanning`, `Pinging`, and `Matching`.
- Updated `Radar` component to visualize different matching states with varying pulse speeds and status text.
- Optimized `HomeScreen` component by moving static configuration outside the component body.

### Fixed
- Aligned React version to 19.1.0 to ensure compatibility with Expo.
- Improved unit tests to cover new granular matching states.
