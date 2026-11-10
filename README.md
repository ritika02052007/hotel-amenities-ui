# Boutique Hotel Amenities UI

Static, responsive amenities desk for hotel floor staff. Pure HTML5, vanilla CSS and JavaScript.

## Run
- `npm install`
- `npm test` runs the Vitest suite
- `npm run lint` runs ESLint with zero warnings allowed
- `npm start` serves the site locally (or open `index.html` through any static server)
## Test the edge cases
- Search for `zzzz` to see the empty state
- Add `?fail=1` to the URL to see the error state and Retry button
- Submit the empty form to see red field errors

## Deploy
Push to GitHub, then import the repo in Vercel or Netlify. Leave the build command empty and publish the root directory.
