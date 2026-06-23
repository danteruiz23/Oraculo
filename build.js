#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// Inject environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://cqinovwhmhjsrtwdnjis.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const adminKey = process.env.VITE_ADMIN_KEY || '2372';

if (!supabaseKey) {
  console.warn('⚠️  WARNING: VITE_SUPABASE_ANON_KEY is not set. Using placeholder.');
}

// Replace placeholders in the HTML
html = html.replace(
  /const SUPABASE_URL = '[^']*'/,
  `const SUPABASE_URL = '${supabaseUrl}'`
);
html = html.replace(
  /const SUPABASE_KEY = '[^']*'/,
  `const SUPABASE_KEY = '${supabaseKey}'`
);
html = html.replace(
  /const ADMIN_KEY = '[^']*'/,
  `const ADMIN_KEY = '${adminKey}'`
);

fs.writeFileSync(htmlPath, html);
console.log('✅ Environment variables injected into index.html');
