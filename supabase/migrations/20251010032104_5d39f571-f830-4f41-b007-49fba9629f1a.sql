-- Insert tax preparation services into the services table
INSERT INTO public.services (id, name, description, price_cents, duration_minutes, is_active)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Individual Tax Preparation', 'Complete tax preparation for individuals including all necessary forms and schedules', 7500, 60, true),
  ('22222222-2222-2222-2222-222222222222', 'Business Tax Preparation', 'Tax preparation for small businesses, partnerships, and LLCs', 10000, 60, true),
  ('33333333-3333-3333-3333-333333333333', 'Corporate Tax Returns', 'Complete tax return preparation for corporations including C-Corp and S-Corp', 15000, 90, true),
  ('44444444-4444-4444-4444-444444444444', 'Tax Return Review', 'Professional review of your prepared tax return before filing', 7500, 60, true),
  ('55555555-5555-5555-5555-555555555555', 'Tax Amendment Filing', 'Preparation and filing of amended tax returns (Form 1040-X)', 5000, 45, true),
  ('66666666-6666-6666-6666-666666666666', 'Quarterly Tax Estimates', 'Calculation and preparation of quarterly estimated tax payments', 12500, 75, true),
  ('77777777-7777-7777-7777-777777777777', 'Prior Year Tax Filing', 'Preparation of tax returns for previous years', 8500, 60, true)
ON CONFLICT (id) DO NOTHING;