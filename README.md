# Kytalist

Next.js frontend for Kytalist, a curated catalog of student programs, competitions, internships, and opportunities.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth for the `/admin` area
- `api-kytalist` for catalog, metadata, admin, newsletter, and testimonial data

## Local Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The API is expected to run separately at `http://localhost:3001` unless `NEXT_PUBLIC_API_BASE_URL` points elsewhere.

## Environment

```env
# Include the /api/v1 prefix.
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1

# Same Supabase project used by api-kytalist.
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Optional: competition backend merged into /competition.
NEXT_PUBLIC_CONTEST_BACKEND_API=https://kytalist-cp-backend.vercel.app/api
```

The `/admin` area uses Supabase Auth in the browser. The Supabase access token is sent to `api-kytalist` as `Authorization: Bearer <token>`, and the API verifies the user role.

## API Contract

Public listing pages call `api-kytalist` server-side:

- `GET /listings`
- `GET /listings/:id`
- `GET /listings/featured`
- `GET /listings/trending`
- `GET /meta`
- `GET /meta/counts`

`NEXT_PUBLIC_API_BASE_URL` must include the version prefix, for example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

List responses use:

```ts
{
  data: Listing[];
  meta: { total: number; limit: number; offset: number };
}
```

Item responses use:

```ts
{ data: Listing }
```

The frontend expects listing fields in camelCase, including `eventUrl`, `deadline`, `grades`, and `tags`.

## Listing Filters

The listing routes support these category values:

- `academic`
- `professional`
- `competition`
- `opportunity`
- `all`

The UI sends `type`, `cost`, `grade`, `region`, `q`, `sort`, `limit`, and `offset` as query params.

Filter option rendering intentionally merges three sources:

1. Local fallback options in `src/lib/data.ts`
2. API hints from `GET /meta`
3. Values present in the current listing payload

This avoids hiding valid listings when database rows contain values that `/meta` does not yet advertise, such as custom regions.

## Pages

- `/` home
- `/activities` all listings
- `/academic`
- `/professional`
- `/competition`
- `/opportunities`
- `/camps` legacy academic grid
- `/internships` legacy professional grid
- `/admin` admin dashboard

The `/competition` page also merges listings from `NEXT_PUBLIC_CONTEST_BACKEND_API` when showing all competitions or `type=TechContest`. Those contest records are filtered client-route-side using the same type, cost, grade, and region filters before display.

## Admin Dashboard

The admin UI calls protected `api-kytalist` endpoints for:

- listing CRUD and publish/unpublish actions
- signed listing image uploads
- user management
- testimonials
- newsletter subscribers and broadcasts
- audit logs

For local admin work, configure both the frontend `.env.local` and API `.env` with the same Supabase project. The API `CORS_ORIGIN` must include the frontend origin, usually `http://localhost:3000`.

## Verification

```bash
npm run lint
npx tsc --noEmit
```

Use these URLs to smoke-test the API-driven listing flow:

```bash
http://localhost:3000/academic
http://localhost:3000/academic?region=Local
http://localhost:3000/competition?type=TechContest
```

## Deployment Notes

- Set `NEXT_PUBLIC_API_BASE_URL` to the deployed API URL with `/api/v1`.
- Set Supabase public env vars for the same Supabase project used by the API.
- In `api-kytalist`, set `CORS_ORIGIN` to the deployed frontend URL.
- Keep service-role keys only in the API environment; never expose them through `NEXT_PUBLIC_*`.
