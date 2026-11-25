# Blinkrouter

Blinkrouter is the renamed CPU / Blinkrouter product preview for an AI model router and dedicated cloud GPUs. It keeps the existing model catalog, pricing, GPU Cloud and docs pages, with an interactive routing preview, featured model filters and an API quickstart on the homepage.

## Run locally

Use Node.js 22.12 or later.

```sh
npm ci
npm run dev -- --hostname 127.0.0.1 --port 4175
```

Blinkrouter uses the Next.js App Router. Use `npm run build` to export the five pages to `out/`, then `npm run preview -- --port 4175` to serve a root-path export locally.

The GitHub Pages workflow reads the site's base path from Pages and sets `NEXT_PUBLIC_BASE_PATH` before the build. To reproduce the project-path export, run `NEXT_PUBLIC_BASE_PATH=/cpu npm run build` and serve `out/` at `/cpu/`.

## Motion

The routing preview shows how the request path changes for each output. Its animation runs once on entry and replays when visitors choose an output or use the replay button. The homepage uses Taste Skill’s entrance animation and iris reveal for the quickstart and related tools. The tools are static on phones and when reduced motion is active. Supported browsers show reading progress below the header.

The routing preview loads a Three.js model when it enters view. The chip tilts on pointer hover and lights up as a request passes through. Visitors without WebGL2 or with data saver enabled see the supplied logo. Reduced motion keeps the chip still.
