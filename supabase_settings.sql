-- Tabla settings para marcador final y otras prefs (Oráculo pool=oraculo)
-- Ejecutar una vez en Supabase SQL Editor del proyecto Oraculo.

CREATE TABLE IF NOT EXISTS settings (
  pool text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (pool, key)
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_read" ON settings;
CREATE POLICY "settings_read" ON settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "settings_write" ON settings;
CREATE POLICY "settings_write" ON settings FOR ALL USING (true) WITH CHECK (true);

-- Marcador por fecha: key = score_YYYY-MM-DD, value = {"a":5,"b":3}
