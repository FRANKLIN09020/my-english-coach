# My English Coach

Monorepo foundation for the My English Coach application.

## Stack

- Web: React, TypeScript, Material UI
- API: Java, Spring Boot
- Data: Supabase PostgreSQL

## Repository layout

```text
apps/
  web/            React application
  api/            Spring Boot application
packages/
  contracts/      Shared API contracts and generated client types
supabase/
  migrations/     Versioned PostgreSQL schema migrations
  seed/           Local development seed data
infra/            Deployment and service configuration
docs/             Architecture and API documentation
scripts/          Repository automation
```

Feature modules will be added once the product plan is defined.

## First vertical slice: AI placement assessment

The first implemented module welcomes a learner by name, runs a friendly adaptive English conversation, then returns a CEFR estimate (A1–C2), confidence, skill scores, and a starter study plan. The API sends the conversation to Groq; the browser never receives the Groq API key.

### Run locally

1. Open `apps/api/.env` and put your Groq key in `GROQ_API_KEY` and your Supabase database password in `SUPABASE_DB_PASSWORD`. This local file is ignored by Git. Do not share or commit either value.
2. In one terminal, start the API:

   ```powershell
   cd apps/api
   mvn spring-boot:run
   ```

3. In another terminal, start the web app:

   ```powershell
   cd apps/web
   npm install
   npm run dev
   ```

Open the local URL shown by Vite (normally `http://localhost:5173`).

The backend connects to your supplied Supabase Postgres endpoint over SSL and automatically runs Flyway migrations. The initial session store is still in memory while the assessment flow is being shaped; the database schema is ready for persistent learner profiles, assessment sessions, and conversation turns.

The default Groq model is `openai/gpt-oss-120b`. Set `GROQ_MODEL` in `apps/api/.env` to another model available in your Groq account if needed.

## Learning paths

The assessment maps every learner to a CEFR path from A1 through C2. Each path has four modules: guided communication, grammar and vocabulary control, listening/speaking or writing practice, and a progress review.

| Level | Outcome |
| --- | --- |
| A1 | Everyday survival English |
| A2 | Familiar conversations and routines |
| B1 | Independent work, study, and travel communication |
| B2 | Fluent professional communication |
| C1 | Precise English in demanding contexts |
| C2 | Near-native flexibility and nuance |

See [the complete module blueprint](docs/product/learning-modules.md).

## GitHub repository description

Use this GitHub repository description:

> AI English coach with CEFR assessment, adaptive A1–C2 learning paths, Groq-powered coaching, React, Spring Boot, and Supabase.

## Push manually to GitHub

Run these commands in PowerShell after confirming that `apps/api/.env` is not listed by `git status`:

```powershell
cd "D:\My English Coach"
git add .
git commit -m "Initial AI English Coach application"
git remote add origin https://github.com/FRANKLIN09020/my-english-coach.git
git push -u origin main
```

If the remote already exists, run:

```powershell
git remote set-url origin https://github.com/FRANKLIN09020/my-english-coach.git
git push -u origin main
```
