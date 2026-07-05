-- Admin: usuario admin con PIN 1111 (pool oraculo)
-- Ejecutar en Supabase SQL Editor del proyecto Oraculo.

ALTER TABLE participants ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION verify_pin(p_pool text, p_user_id integer, p_pin text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM participants
    WHERE pool = p_pool
      AND id = p_user_id
      AND pin = p_pin
      AND COALESCE(active, true) = true
  );
$$;

CREATE OR REPLACE FUNCTION verify_admin_pin(p_pool text, p_user_id integer, p_pin text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM participants
    WHERE pool = p_pool
      AND id = p_user_id
      AND pin = p_pin
      AND is_admin = true
      AND COALESCE(active, true) = true
  );
$$;

GRANT EXECUTE ON FUNCTION verify_pin(text, integer, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION verify_admin_pin(text, integer, text) TO anon, authenticated;

UPDATE participants
SET pin = '1111',
    active = true,
    is_admin = true,
    init = 'AD'
WHERE pool = 'oraculo'
  AND name IN ('Admin', 'Pipita');

INSERT INTO participants (id, pool, name, init, cls, pin, active, is_admin)
SELECT
  COALESCE(MAX(id), 0) + 1,
  'oraculo',
  'Admin',
  'AD',
  'c' || ((COALESCE(MAX(id), 0) + 1) % 6),
  '1111',
  true,
  true
FROM participants
WHERE pool = 'oraculo'
  AND NOT EXISTS (
    SELECT 1 FROM participants p2
    WHERE p2.pool = 'oraculo' AND p2.name IN ('Admin', 'Pipita')
  );
