#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const p = path.join(root, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    }
  }
}

function loadFromHtml() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const url = html.match(/const SUPABASE_URL = '([^']+)'/);
  const key = html.match(/const SUPABASE_KEY = '([^']+)'/);
  return {
    url: process.env.VITE_SUPABASE_URL || url?.[1],
    key: process.env.VITE_SUPABASE_ANON_KEY || key?.[1],
  };
}

loadEnv();
const { url, key } = loadFromHtml();
if (!url || !key) {
  console.error('Missing Supabase URL/key. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

const pool = 'oraculo';
const name = 'Pipita';

const listRes = await fetch(
  `${url}/rest/v1/participants?pool=eq.${pool}&select=id,name,is_admin,pin&order=id`,
  { headers }
);
if (!listRes.ok) {
  console.error('List failed:', listRes.status, await listRes.text());
  process.exit(1);
}

const rows = await listRes.json();
const existing = rows.find((r) => r.name === name);
if (existing) {
  const patchRes = await fetch(
    `${url}/rest/v1/participants?pool=eq.${pool}&id=eq.${existing.id}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ pin: '1111', active: true, is_admin: true, init: 'PI' }),
    }
  );
  if (!patchRes.ok) {
    console.error('Update failed:', patchRes.status, await patchRes.text());
    console.error('Si falta la columna is_admin, ejecuta supabase_add_pipita.sql en Supabase.');
    process.exit(1);
  }
  console.log(`✅ Pipita actualizada (id ${existing.id}, PIN 1111, admin)`);
  process.exit(0);
}

const nextId = rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;
const insertRes = await fetch(`${url}/rest/v1/participants`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    id: nextId,
    pool,
    name,
    init: 'PI',
    cls: `c${nextId % 6}`,
    pin: '1111',
    active: true,
    is_admin: true,
  }),
});

if (!insertRes.ok) {
  console.error('Insert failed:', insertRes.status, await insertRes.text());
  console.error('Ejecuta supabase_add_pipita.sql en el SQL Editor de Supabase.');
  process.exit(1);
}

const created = await insertRes.json();
console.log(`✅ Pipita creada (id ${created[0]?.id ?? nextId}, PIN 1111, admin)`);
