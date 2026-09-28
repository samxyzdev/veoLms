# Backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Architecture

The API uses an MVC-style layout:

- `routes/` maps HTTP method, path, and middleware to a controller only.
- `controllers/` owns request validation, application flow, and JSON responses.
- Models are the Drizzle schemas and database client in the shared
  `@repo/database` package, so frontend and backend share one canonical data
  model without duplicating table definitions.
- `middleware/` provides cross-cutting request guards such as session and admin
  authorization; `utilities/` contains infrastructure helpers such as OTP and
  email delivery.

This is a JSON API, so each controller's serialized JSON response is its view
representation rather than a server-rendered template.

## Video uploads

The admin Courses screen uploads videos directly to Cloudflare R2 through a
short-lived presigned URL, then stores the public media URL as a course lecture.
Set these values in `apps/backend/.env` before using video uploads:

```env
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
R2_BUCKET=your-bucket
R2_PUBLIC_URL=https://media.example.com
```

Configure CORS on that R2 bucket to allow `PUT` requests from the frontend
origin. This is separate from the Express API CORS configuration because the
browser uploads the video directly to R2. In the Cloudflare dashboard, open
the bucket's **Settings → CORS Policy** and use a rule such as this (replace
the production URL with the exact frontend origin):

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://app.example.com"
    ],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Origins must match exactly: include the protocol and development port, but do
not add a trailing slash or a path. The application signs each URL with the
video's `Content-Type`, so that same `Content-Type` header must remain allowed
by the bucket policy.
