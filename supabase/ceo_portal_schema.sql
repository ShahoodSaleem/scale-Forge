-- ============================================================
--  ScaleForge CEO Portal - Supabase SQL Schema
--  Run this in Supabase → SQL Editor
-- ============================================================

-- Step 1: Allow 'ceo' role in profiles table
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'employee', 'ceo'));

-- ============================================================
-- 1. FINANCIAL ACCOUNTS (My Balance, Savings, Investments)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.financial_accounts (
  id           uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text          NOT NULL,
  type         text          NOT NULL CHECK (type IN ('checking', 'savings', 'investment', 'wallet')),
  balance      numeric(15,2) NOT NULL DEFAULT 0,
  currency     text          NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'PKR', 'EUR', 'GBP')),
  institution  text,
  notes        text,
  created_at   timestamptz   DEFAULT now(),
  updated_at   timestamptz   DEFAULT now()
);

-- ============================================================
-- 2. TRANSACTIONS (Full Ledger)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id           uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  date         date          NOT NULL DEFAULT current_date,
  description  text          NOT NULL,
  amount       numeric(15,2) NOT NULL,
  type         text          NOT NULL CHECK (type IN ('income', 'expense')),
  category     text          NOT NULL DEFAULT 'general',
  client_name  text,
  account_id   uuid          REFERENCES public.financial_accounts(id) ON DELETE SET NULL,
  reference    text,
  notes        text,
  created_at   timestamptz   DEFAULT now()
);

-- ============================================================
-- 3. INVOICES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number  text          NOT NULL UNIQUE,
  client_name     text          NOT NULL,
  client_email    text,
  issued_date     date          NOT NULL DEFAULT current_date,
  due_date        date,
  status          text          NOT NULL DEFAULT 'unpaid'
                  CHECK (status IN ('unpaid', 'paid', 'overdue', 'draft', 'cancelled')),
  subtotal        numeric(15,2) NOT NULL DEFAULT 0,
  tax_rate        numeric(5,2)  DEFAULT 0,
  tax_amount      numeric(15,2) DEFAULT 0,
  total           numeric(15,2) NOT NULL DEFAULT 0,
  notes           text,
  paid_at         timestamptz,
  created_at      timestamptz   DEFAULT now(),
  updated_at      timestamptz   DEFAULT now()
);

-- ============================================================
-- 4. INVOICE LINE ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id           uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id   uuid          NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description  text          NOT NULL,
  quantity     numeric(10,2) NOT NULL DEFAULT 1,
  unit_price   numeric(15,2) NOT NULL DEFAULT 0,
  total        numeric(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at   timestamptz   DEFAULT now()
);

-- ============================================================
-- 5. PAYMENT PLANS (Client installment plans)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payment_plans (
  id                 uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name        text          NOT NULL,
  project_name       text          NOT NULL,
  total_amount       numeric(15,2) NOT NULL,
  upfront_amount     numeric(15,2) NOT NULL DEFAULT 0,
  upfront_paid       boolean       NOT NULL DEFAULT false,
  remaining_balance  numeric(15,2) NOT NULL,
  installment_amount numeric(15,2) NOT NULL,
  frequency          text          NOT NULL DEFAULT 'monthly'
                     CHECK (frequency IN ('monthly', 'bimonthly', 'quarterly')),
  currency           text          NOT NULL DEFAULT 'USD',
  total_installments integer       NOT NULL,
  installments_paid  integer       NOT NULL DEFAULT 0,
  start_date         date          NOT NULL DEFAULT current_date,
  status             text          NOT NULL DEFAULT 'active'
                     CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  notes              text,
  created_at         timestamptz   DEFAULT now(),
  updated_at         timestamptz   DEFAULT now()
);

-- ============================================================
-- 6. EMPLOYEE SALARIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.employee_salaries (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name   text          NOT NULL,
  position        text          NOT NULL,
  department      text,
  role_type       text          NOT NULL DEFAULT 'regular'
                  CHECK (role_type IN ('regular', 'sales', 'senior', 'contractor')),
  base_salary     numeric(15,2) NOT NULL,
  currency        text          NOT NULL DEFAULT 'USD',
  commission_rate numeric(5,2)  DEFAULT 0,  -- % commission for sales roles
  start_date      date          NOT NULL DEFAULT current_date,
  status          text          NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'inactive', 'on_leave')),
  impact_notes    text,   -- For senior roles: what they own/impact
  profile_id      uuid    REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ============================================================
-- 7. SALES RECORDS (Monthly sales/commission tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.salary_sales_records (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id     uuid          NOT NULL REFERENCES public.employee_salaries(id) ON DELETE CASCADE,
  month           integer       NOT NULL CHECK (month BETWEEN 1 AND 12),
  year            integer       NOT NULL,
  sales_amount    numeric(15,2) NOT NULL DEFAULT 0,
  commission_rate numeric(5,2),  -- Override commission rate if different
  commission_earned numeric(15,2) GENERATED ALWAYS AS (
    sales_amount * COALESCE(commission_rate, 0) / 100
  ) STORED,
  notes           text,
  created_at      timestamptz   DEFAULT now(),
  UNIQUE (employee_id, month, year)
);

-- ============================================================
-- 8. CURRENCY EXCHANGE RATES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.currency_rates (
  id           uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  currency     text          NOT NULL UNIQUE CHECK (currency IN ('USD', 'EUR', 'GBP')),
  to_pkr_rate  numeric(15,2) NOT NULL DEFAULT 1,
  updated_at   timestamptz   DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY — CEO-ONLY
-- ============================================================
ALTER TABLE public.financial_accounts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_salaries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_sales_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_rates        ENABLE ROW LEVEL SECURITY;

-- Helper: CEO check
CREATE OR REPLACE FUNCTION public.is_ceo()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ceo'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Policies
DROP POLICY IF EXISTS "CEO access financial_accounts" ON public.financial_accounts;
CREATE POLICY "CEO access financial_accounts"  ON public.financial_accounts   FOR ALL USING (public.is_ceo()) WITH CHECK (public.is_ceo());

DROP POLICY IF EXISTS "CEO access transactions" ON public.transactions;
CREATE POLICY "CEO access transactions"        ON public.transactions          FOR ALL USING (public.is_ceo()) WITH CHECK (public.is_ceo());

DROP POLICY IF EXISTS "CEO access invoices" ON public.invoices;
CREATE POLICY "CEO access invoices"            ON public.invoices              FOR ALL USING (public.is_ceo()) WITH CHECK (public.is_ceo());

DROP POLICY IF EXISTS "CEO access invoice_items" ON public.invoice_items;
CREATE POLICY "CEO access invoice_items"       ON public.invoice_items         FOR ALL USING (public.is_ceo()) WITH CHECK (public.is_ceo());

DROP POLICY IF EXISTS "CEO access payment_plans" ON public.payment_plans;
CREATE POLICY "CEO access payment_plans"       ON public.payment_plans         FOR ALL USING (public.is_ceo()) WITH CHECK (public.is_ceo());

DROP POLICY IF EXISTS "CEO access employee_salaries" ON public.employee_salaries;
CREATE POLICY "CEO access employee_salaries"   ON public.employee_salaries     FOR ALL USING (public.is_ceo()) WITH CHECK (public.is_ceo());

DROP POLICY IF EXISTS "CEO access sales_records" ON public.salary_sales_records;
CREATE POLICY "CEO access sales_records"       ON public.salary_sales_records  FOR ALL USING (public.is_ceo()) WITH CHECK (public.is_ceo());

DROP POLICY IF EXISTS "CEO access currency_rates" ON public.currency_rates;
CREATE POLICY "CEO access currency_rates"      ON public.currency_rates        FOR ALL USING (public.is_ceo()) WITH CHECK (public.is_ceo());

-- ============================================================
-- AUTO-UPDATE updated_at triggers
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_financial_accounts_updated_at ON public.financial_accounts;
CREATE TRIGGER set_financial_accounts_updated_at BEFORE UPDATE ON public.financial_accounts  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_invoices_updated_at ON public.invoices;
CREATE TRIGGER set_invoices_updated_at           BEFORE UPDATE ON public.invoices             FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_payment_plans_updated_at ON public.payment_plans;
CREATE TRIGGER set_payment_plans_updated_at      BEFORE UPDATE ON public.payment_plans        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_employee_salaries_updated_at ON public.employee_salaries;
CREATE TRIGGER set_employee_salaries_updated_at  BEFORE UPDATE ON public.employee_salaries    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_currency_rates_updated_at ON public.currency_rates;
CREATE TRIGGER set_currency_rates_updated_at     BEFORE UPDATE ON public.currency_rates       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
