# FreeTeleprompter.in

Production-ready Next.js teleprompter starter for `https://www.freeteleprompter.in/`, built with a mobile-first UI, smooth scrolling, local persistence, premium gating, and voice-controlled scrolling.

## Tech Decisions

- Frontend: Next.js App Router with React 19 for a modern deployable structure and route-handler support.
- Styling: Tailwind CSS with a custom design system layered on top of CSS variables for theme and high-contrast modes.
- State: Local React hooks because the MVP state is tightly scoped and does not need a global store yet.
- Backend choice: simple Node API via Next.js route handlers plus MongoDB.
  This keeps deployment simple on Cloud Run, avoids premature Firebase setup, and still gives a clean extension point for auth, billing, AI calls, and cloud persistence later.
- Advanced feature implemented: browser voice-controlled scrolling using the Speech Recognition API.

## MVP Features Included

- Script editor with local auto-save
- Fullscreen reading mode
- Smooth auto-scrolling driven by `requestAnimationFrame`
- Adjustable speed and font size
- Dark / light mode
- High contrast mode
- Mirror mode
- Play / pause / restart controls
- Keyboard shortcut: `Space`
- Saved scripts with free-plan limit logic
- `isPremium` flag and feature gating structure
- Ad placeholder for free users
- Google sign-in entry point and MongoDB-backed user/script/payment collections
- Protected administrator login at `/admin/login` with a MongoDB-backed stats dashboard
- Video + audio recording tied to teleprompter playback
- Download gate with a ₹99/month payment QR flow
- SEO-ready metadata, structured data, sitemap, robots, and manifest routes
- Tracking hooks for Google Analytics
- AdSense-ready script loading and slot placeholders
- Placeholders for future AI and recording features

## Project Structure

```text
app/
  api/health/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  ad-placeholder.tsx
  app-header.tsx
  control-bar.tsx
  display-panel.tsx
  feature-card.tsx
  premium-banner.tsx
  saved-scripts-panel.tsx
  script-editor.tsx
  settings-panel.tsx
  teleprompter-app.tsx
hooks/
  use-local-storage.ts
  use-speech-scroll.ts
  use-teleprompter.ts
lib/
  constants.ts
  types.ts
  utils.ts
```

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

4. Add environment variables from `.env.example` before using Google sign-in, MongoDB persistence, or payment QR flows.

### OAuth and admin setup

Set these server-only variables in your local `.env.local` or deployment secret manager:

```env
AUTH_SECRET=generate-a-long-random-value
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-rotated-google-client-secret
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB=freeteleprompter
ADMIN_USERNAME=your-private-admin-username
ADMIN_PASSWORD_HASH=your-generated-scrypt-value
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-server-only-razorpay-secret
RAZORPAY_PLAN_ID=your-razorpay-monthly-plan-id
RAZORPAY_TOTAL_COUNT=12
RAZORPAY_WEBHOOK_SECRET=your-server-only-razorpay-webhook-secret
```

Generate the password hash without putting the password in source control:

```bash
node -e 'const c=require("node:crypto");const s=c.randomBytes(16).toString("hex");console.log(`${s}:${c.scryptSync(process.argv[1],s,64).toString("hex")}`)' 'choose-a-new-admin-password'
```

The admin dashboard is available at `/admin`, with login at `/admin/login`. It is protected by a server-side NextAuth
session, marked `noindex`, and disallowed in `robots.txt`. The dashboard reports registered users and users active within
the last 15 minutes based on authenticated browser heartbeats.

For Google OAuth, configure these authorized redirect URIs in Google Cloud Console:

```text
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
https://freeteleprompter.in/api/auth/callback/google
https://www.freeteleprompter.in/api/auth/callback/google
```

Also add both local origins under **Authorized JavaScript origins**:

```text
http://localhost:3000
http://localhost:3001
```

The redirect URI must match the port in the browser exactly. If the app is open at `http://localhost:3001`, authorize
`http://localhost:3001/api/auth/callback/google`; if it is open at `http://localhost:3000`, authorize the `3000` version.

The client secret included in the request should be rotated in Google Cloud Console because it has been exposed. Never
place `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`, or `ADMIN_PASSWORD_HASH` in client-side code or `NEXT_PUBLIC_*` variables.

### Automatic downloads and billing

Authenticated users receive their first three media downloads free. Each download is authorized and counted atomically
by the server. After the allowance is exhausted, Razorpay Checkout opens a recurring ₹49/month subscription. Create a
monthly Razorpay Plan, set its ID as `RAZORPAY_PLAN_ID`, and configure the Razorpay webhook/checkout credentials in the
server environment. The browser never receives `RAZORPAY_KEY_SECRET`.

Point the Razorpay webhook to `/api/webhooks/razorpay` and subscribe to subscription activation, charge, cancellation,
completion, and halt events.

5. For production SEO and monetization, configure:

```env
NEXT_PUBLIC_SITE_URL=https://www.freeteleprompter.in
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-token
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=7364721409
```

Google Analytics uses `NEXT_PUBLIC_GA_MEASUREMENT_ID` from your GA4 web data stream and now tracks key product actions such as play, pause, stop, script save, voice toggle, premium gate opens, and reel downloads.

## Production Build

```bash
npm run build
npm run start
```

You will need valid Google OAuth credentials and a MongoDB connection string for authenticated features.
You will also need your Google Analytics, Search Console verification token, and AdSense publisher details for full SEO and ad tracking setup.

## Deploy To GCP Cloud Run

Deploy this app as a Cloud Run `service`, not a Cloud Run `job`, because it serves web traffic.

1. Use the included `Dockerfile`.

2. Build and push the image:

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/freeteleprompter
```

3. Deploy to Cloud Run:

```bash
gcloud run deploy freeteleprompter \
  --image gcr.io/PROJECT_ID/freeteleprompter \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NEXTAUTH_URL=https://YOUR_CLOUD_RUN_URL,NEXTAUTH_URL_INTERNAL=https://YOUR_CLOUD_RUN_URL,NEXT_PUBLIC_SITE_URL=https://www.freeteleprompter.in
```

4. Point your domain `freeteleprompter.in` at the Cloud Run service using a load balancer or Cloud Run domain mapping.

5. In Google Cloud Console, add the production OAuth callback URL after the first deploy:

```text
https://YOUR_CLOUD_RUN_URL/api/auth/callback/google
```

6. Prefer setting the remaining secrets in Cloud Run environment variables instead of baking them into the image:

```text
AUTH_SECRET
AUTH_GOOGLE_ID
AUTH_GOOGLE_SECRET
MONGODB_URI
MONGODB_DB
NEXT_PUBLIC_GA_MEASUREMENT_ID
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
NEXT_PUBLIC_ADSENSE_CLIENT
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
NEXT_PUBLIC_ADS_TXT_LINE
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM
NEXT_PUBLIC_UPI_ID
NEXT_PUBLIC_UPI_NAME
```

## Future Extensions

- Replace local-only script storage with authenticated cloud persistence.
- Connect `isPremium` to billing and entitlements.
- Add AI endpoints under `app/api/` for generation, coaching, and caption workflows.
- Add PWA support for installability and offline resilience.
