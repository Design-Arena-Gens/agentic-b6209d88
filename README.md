# Property Violations Finder

Find US properties with code violations, fetch a property image from Google Drive (or Google Street View fallback), attempt skip tracing of the owner, and check public foreclosure indicators.

## Features
- Violations search via Socrata Open Data discovery (city/state scoped)
- Image retrieval from Google Drive folder (service account), with Street View fallback
- Skip tracing stub with provider interface (demo output by default)
- Foreclosure indicator lookup using open datasets (heuristic)
- Next.js 14 + Tailwind UI

## Configuration
Copy `.env.example` to `.env.local` and set values as available:

- `GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON_BASE64`: Base64 of service account JSON. Share your Drive folder with the service account if using My Drive.
- `GOOGLE_DRIVE_FOLDER_ID`: Folder to search for images. File names should contain the address text.
- `GOOGLE_MAPS_API_KEY`: Enables Google Street View image fallback.
- `PDL_API_KEY`: Optional provider for skip tracing (scaffold only).

## Development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build && npm start
```

## Deploy to Vercel
Use the CLI as instructed externally.
