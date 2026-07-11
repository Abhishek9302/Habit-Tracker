# Habit Tracker

A full-stack Habit Tracker app built as a monorepo and ready to deploy on Railway.

## Stack

- **Frontend:** Next.js 14 + React + Tailwind CSS
- **Backend:** Express + TypeScript + PostgreSQL (via `pg`)
- **Auth:** JWT + bcryptjs
- **Deploy:** Railway (frontend + backend services)

## Features

- User registration & login
- Create, edit, and delete habits
- Daily check-ins with color-coded habit cards
- Calendar view for habit history
- Responsive dashboard

## Project Structure

```
├── apps/
│   ├── frontend/   # Next.js app
│   └── backend/    # Express API
├── database/
│   └── schema.sql  # PostgreSQL schema
├── .zero-human/
│   └── DEPLOY_MANIFEST.json
└── README.md
```

## Environment Variables

### Frontend

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

### Backend

| Variable | Description |
|----------|-------------|
| `PORT` | Server port |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWTs |

## Local Development

1. Start PostgreSQL and run `database/schema.sql`.
2. In `apps/backend`:
   - `npm install`
   - `npm run dev`
3. In `apps/frontend`:
   - `npm install`
   - `npm run dev`

## Deploy

Import the repo into Railway, add the environment variables above, and deploy the frontend and backend services.

Co-Authored-By: Paperclip <noreply@paperclip.ing>
