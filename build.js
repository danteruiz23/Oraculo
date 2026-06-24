#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// Inject environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://cqinovwhmhjsrtwdnjis.supabase.co';
const adminKey = process.env.VITE_ADMIN_KEY || '2372';

// Replace placeholders in the HTML (keep baked-in key if env not set)
html = html.replace(
  /const SUPABASE_URL = '[^']*'/,
  `const SUPABASE_URL = '${supabaseUrl}'`
);
if (process.env.VITE_SUPABASE_ANON_KEY) {
  html = html.replace(
    /const SUPABASE_KEY = '[^']*'/,
    `const SUPABASE_KEY = '${process.env.VITE_SUPABASE_ANON_KEY}'`
  );
} else {
  console.warn('⚠️  VITE_SUPABASE_ANON_KEY not set — keeping key from index.html');
}
html = html.replace(
  /const ADMIN_KEY = '[^']*'/,
  `const ADMIN_KEY = '${adminKey}'`
);

fs.writeFileSync(htmlPath, html);
console.log('✅ Environment variables injected into index.html');
