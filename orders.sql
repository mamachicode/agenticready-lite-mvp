create table if not exists orders (
  id uuid primary key default gen_random_uuid(),

  stripe_session_id text unique not null,
  stripe_payment_intent_id text,
  stripe_customer_email text not null,

  amount_total integer not null,
  currency text not null,

  status text not null default 'created',

  pdf_s3_key text,
  pdf_filename text,
  pdf_uploaded_at timestamptz,

  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_stripe_session
  on orders (stripe_session_id);

create index if not exists idx_orders_status
  on orders (status);

create index if not exists idx_orders_email
  on orders (stripe_customer_email);
