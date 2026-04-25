# Project Name

A brief description of what this project does and who it's for.

## Deployment

The project is configured with a two-stage automated deployment:
1. **PWA Deployment**: Every push to `main` builds and deploys the web app to GitHub Pages.
2. **Android Build**: After the web app is live, a separate workflow fetches the `manifest.json` from the live site and generates a signed Android APK.

### GitHub Secrets
To enable Android builds, add the following secrets to your repository:
- `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`
- `KEYSTORE_RAW` (Optional: Base64 encoded JKS if you have your own)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them.

```bash
Give examples
```

### Installing

A step by step series of examples that tell you how to get a development env running.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
