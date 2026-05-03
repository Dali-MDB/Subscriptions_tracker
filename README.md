# Subscriptions tracker

Express API for user accounts and subscription records, backed by MongoDB (Mongoose). Includes JWT auth, rate limiting, and scheduled jobs for subscription-related tasks.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- A running [MongoDB](https://www.mongodb.com/) instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

## Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file from the example:

   ```bash
   copy .env.example .env
   ```

   On macOS or Linux:

   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and set `DB_URL`, `JWT_SECRET_KEY`, and optionally adjust token lifetimes (see [Environment variables](#environment-variables)).

4. Start the development server (reloads on file changes via nodemon):

   ```bash
   npm run dev
   ```

The server listens on **http://localhost:3000** by default.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_URL` | Yes | MongoDB connection URI used by Mongoose. |
| `JWT_SECRET_KEY` | Yes | Secret for signing access and refresh tokens. |
| `JWT_EXP_ACCESS` | Yes | Access token expiry in **minutes** (numeric only, e.g. `15`). |
| `JWT_EXP_REFRESH` | Yes | Refresh token expiry in **days** (numeric only, e.g. `7`). |

Copy `.env.example` to `.env` and fill in the values. Do not commit `.env`; it is listed in `.gitignore`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run the app with nodemon. |
| `npm test` | Placeholder (no tests configured yet). |

## API overview

Base URL: `http://localhost:3000`

- **Auth** (`/auth`): register, login (JWTs in JSON body).
- **Users** (`/users`): list/get users; update/delete require `Authorization: Bearer <access_token>`.
- **Subscriptions** (`/subs`): CRUD and related actions; all routes require `Authorization: Bearer <access_token>`.

Global rate limiting is applied (per IP for unauthenticated requests, per user id when authenticated). Send JSON bodies with `Content-Type: application/json`.

## Project structure

- `src/app.js` — Express app, middleware, routes, server listen.
- `src/database/db.js` — MongoDB connection.
- `src/models/` — Mongoose schemas.
- `src/routers/` — Route definitions.
- `src/controllers/` — Request handlers.
- `src/middlewares/` — Auth and error handling.
- `src/jobs/` — Scheduled tasks (cron).

## License

ISC (see `package.json`).
