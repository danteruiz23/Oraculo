-- Pipita: jugadora admin con PIN 1111 (pool oraculo)
-- Ejecutar en Supabase SQL Editor del proyecto Oraculo.

ALTER TABLE participants ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

UPDATE participants
SET pin = '1111',
    active = true,
    is_admin = true,
    init = 'PI'
WHERE pool = 'oraculo'
  AND name = 'Pipita';

INSERT INTO participants (id, pool, name, init, cls, pin, active, is_admin)
SELECT
  COALESCE(MAX(id), 0) + 1,
  'oraculo',
  'Pipita',
  'PI',
  'c' || ((COALESCE(MAX(id), 0) + 1) % 6),
  '1111',
  true,
  true
FROM participants
WHERE pool = 'oraculo'
  AND NOT EXISTS (
    SELECT 1 FROM participants p2
    WHERE p2.pool = 'oraculo' AND p2.name = 'Pipita'
  );
