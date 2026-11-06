# STEM Solver AI

A React and Vite frontend for the existing Cloudflare Workers AI question-solving API. The Worker implementation remains in `woker.js` and is not part of the frontend build.

## Local development

Requirements: Node.js 18 or newer and npm.

```sh
npm install
npm run dev
```

The local `.env` points to the deployed Worker. For a different environment, copy `.env.example` to `.env` and set `VITE_API_URL` to the Worker URL. Restart Vite after changing environment variables.

```sh
npm run build
npm run preview
```

## Deployment

Deploy this repository as a Vite static site. Configure `VITE_API_URL` as a build-time environment variable in the frontend hosting provider, with the deployed Cloudflare Worker URL as its value, then run `npm run build` and publish `dist/`. Vite embeds `VITE_*` variables into the client bundle, so this URL is public configuration, not a place for secrets. The existing Worker must remain deployed separately.

Images are limited in the browser to PNG, JPG/JPEG, and WEBP files up to 5 MB. The frontend sends the chosen image as a Base64 data URL only after Analyze is selected.