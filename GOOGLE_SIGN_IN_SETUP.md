# Connect Google sign-in to SETU

The login page includes Google sign-in for Tourist and Vendor accounts. Until configured, it shows an unavailable message and email/password remains usable. Admin accounts use the existing password login.

## 1. Create the Google OAuth client

1. Open [Google Cloud Console](https://console.cloud.google.com/) and select or create a project.
2. Open **Google Auth Platform** (or **APIs & Services → OAuth consent screen**).
3. Under **Branding**, set the application name to SETU, provide a support email and developer contact email. For a public deployment, add your homepage, privacy policy and terms URLs, and authorized domain.
4. Under **Audience**, choose **External** for ordinary public users. While the app is in Testing, add the Google accounts you will use under **Test users**.
5. Under **Clients**, create an OAuth client with application type **Web application**.
6. Add these **Authorized JavaScript origins** for development:
   - `http://localhost`
   - `http://localhost:5173`
7. For production, also add the exact HTTPS frontend origin, such as `https://setu.example.com`. Origins have no paths or trailing slash. Add each frontend origin you actually use.
8. Copy the **Client ID**, ending in `.apps.googleusercontent.com`.

This implementation uses Google Identity Services' JavaScript callback and ID-token verification. **No client secret or authorized redirect URI is required.** Do not use a Gemini key or service-account key.

## 2. Configure SETU

In the repository root `.env`, add or update the following without overwriting existing settings:

```dotenv
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
FRONTEND_URL=http://localhost:5173
DATABASE_URL="file:./dev.db"
```

The API reads the root `.env`. The frontend gets the public client ID from `GET /api/auth/google/config`, so no `VITE_GOOGLE_CLIENT_ID` is needed. Set `FRONTEND_URL` to the exact browser origin; the Google login endpoint rejects other origins.

If applying this change to another checkout, install dependencies and update its database (stop the API first on Windows to release Prisma's DLL):

```powershell
npm install
npm --prefix apps/api run db:generate
# For this project's local SQLite database:
$env:DATABASE_URL = 'file:./dev.db'
node node_modules/prisma/build/index.js db execute --schema apps/api/prisma/schema.prisma --file apps/api/prisma/google-sign-in.sql
npm run dev
```

The SQL command is a one-time migration for an existing SQLite database that does not yet have the column. It has already been applied to this workspace; skip it here. For a fresh database, use the normal `npm --prefix apps/api run db:migrate` command instead. For an existing deployment, back up the database and apply your normal schema migration process to add the nullable, unique `User.googleSubject` column. Never reset or reseed an existing database to enable Google login.

## 3. Verify locally

1. Open `http://localhost:5173/login`. Choose Tourist or Vendor.
2. Once the API has the client ID, the official **Continue with Google** button appears.
3. Select an allowed Google test account and complete Google's consent flow.
4. Tourist login opens the homepage. Vendor login opens the appropriate vendor dashboard. Refreshing another page returns to the same role's home/dashboard.
5. Verify that language and theme preferences persist.
6. A first-time Google vendor receives a **PENDING** vendor profile and must complete business details and obtain admin approval.

## Account handling

- A new verified Google account creates the selected Tourist/Vendor account. It never creates an Admin.
- Subsequent sign-ins use Google's stable subject ID, not the display name.
- Existing Gmail/verified Google Workspace users may sign in to the matching email account if its role matches and it is active.
- For an existing account using a third-party email provider, use its email/password login; automatic linking is deliberately blocked.
- A Google-created account has no user-known password. Use Google again to sign in; password recovery is not implemented by this integration.
- Switching Tourist/Vendor does not change an existing user's permissions.

## Production

Use HTTPS with frontend and API on the same site, preferably route `/api` through the frontend origin. This integration uses HTTP-only, SameSite=Lax cookies. Set `NODE_ENV=production`, the correct `FRONTEND_URL`, a strong `JWT_SECRET`, and the same Google client ID on the API. Restart the API after environment changes.

Publish the OAuth app for the intended audience and complete any Google verification requirements shown in the console. If your host sets CSP, allow Google's GIS script at `https://accounts.google.com/gsi/client` and Google's required frame/connect endpoints. A popup deployment using Cross-Origin-Opener-Policy may need `same-origin-allow-popups`; follow Google's setup guidance.

## Troubleshooting

- **Unavailable message:** confirm `GOOGLE_CLIENT_ID` in the root `.env`, restart the API, and check `/api/auth/google/config`.
- **origin_mismatch:** register the exact frontend protocol, hostname and port in Google Cloud; use localhost consistently instead of mixing it with 127.0.0.1.
- **403 origin error:** make `FRONTEND_URL` match the browser origin.
- **Access blocked/testing:** add the account as a test user or publish the consent configuration.
- **Nonce/session expired:** reload login and try again. The nonce expires after 10 minutes.
- **Prisma EPERM:** stop the running API, regenerate Prisma, then restart it.

References: [Google client setup](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid), [official button](https://developers.google.com/identity/gsi/web/guides/display-button), [server-side verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).
