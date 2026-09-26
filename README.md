<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e275af1a-85ce-41b3-b070-6844b673ef7b

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Create or update [.env.local](.env.local) and set the required environment variables:
   - `VITE_MAPBOX_TOKEN`: required for the Mapbox map view used in the app
   - Example:
     ```env
     VITE_MAPBOX_TOKEN=your_mapbox_access_token
     ```
3. Run the app:
   `npm run dev`

> The map screen will not render correctly without a valid `VITE_MAPBOX_TOKEN` value.
