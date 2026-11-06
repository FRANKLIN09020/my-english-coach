create table if not exists learner_profile (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now()
);

create table if not exists assessment_session (
  id uuid primary key,
  learner_id uuid references learner_profile(id) on delete set null,
  status text not null check (status in ('in_progress', 'completed', 'abandoned')),
  cefr_level text check (cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  confidence smallint check (confidence between 0 and 100),
  result jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists assessment_turn (
  id bigint generated always as identity primary key,
  session_id uuid not null references assessment_session(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists assessment_turn_session_id_idx on assessment_turn(session_id, id);
