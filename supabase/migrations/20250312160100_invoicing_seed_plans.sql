-- Seed default plans for subscription management (idempotent)
INSERT INTO public.plans (id, name, price_cents, currency, billing_interval, features, max_invoices, allowed_users)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Starter', 2900, 'USD', 'month', '["Up to 10 invoices/month", "1 user", "Email support"]'::jsonb, 10, 1),
  ('a0000000-0000-0000-0000-000000000002', 'Professional', 7900, 'USD', 'month', '["Unlimited invoices", "5 users", "Priority support", "Custom templates"]'::jsonb, NULL, 5),
  ('a0000000-0000-0000-0000-000000000003', 'Enterprise', 19900, 'USD', 'month', '["Unlimited everything", "Unlimited users", "Dedicated support", "API access"]'::jsonb, NULL, NULL)
ON CONFLICT (id) DO NOTHING;
