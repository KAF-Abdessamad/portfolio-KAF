#!/usr/bin/env node
/**
 * RLS Security Check — verifies that anonymous users (anon key only)
 * cannot write to protected tables, and that public reads still work.
 *
 * Usage:
 *   node tests/security/rls-check.mjs
 *
 * Env vars (or .env file in project root):
 *   SUPABASE_URL / VITE_SUPABASE_URL
 *   SUPABASE_ANON_KEY / VITE_SUPABASE_ANON_KEY
 *
 * NOTE: write tests send payloads that WOULD succeed if RLS is misconfigured.
 * If a check reports FAIL, a test row may have been created — delete it in
 * the Supabase dashboard (Table Editor).
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

// --- Load env ---------------------------------------------------------------
function loadEnv() {
  const env = { ...process.env };
  const envPath = resolve(root, '.env');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

const env = loadEnv();
const URL_ = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const KEY = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!URL_ || !KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_ANON_KEY (or VITE_ variants).');
  process.exit(2);
}

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
};

let failures = 0;
let warnings = 0;

function report(ok, name, detail = '') {
  const tag = ok ? 'PASS' : 'FAIL';
  if (!ok) failures++;
  console.log(`  [${tag}] ${name}${detail ? ` — ${detail}` : ''}`);
}

function warn(name, detail = '') {
  warnings++;
  console.log(`  [WARN] ${name}${detail ? ` — ${detail}` : ''}`);
}

async function req(method, path, body) {
  const res = await fetch(`${URL_}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  return { status: res.status, data };
}

const isDenied = (status) => status === 401 || status === 403 || status === 42501;

// --- Test payloads (valid enough to insert IF RLS allowed it) ----------------
const WRITE_TESTS = [
  ['projects', { title: 'SECURITY TEST - DELETE ME', description: 'rls check' }],
  ['certificates', { title: 'SECURITY TEST', issuer: 'test', issue_date: '2026-01-01' }],
  ['skills', { name: 'SECURITY TEST', category: 'test' }],
  ['experiences', { type: 'stage', degree: 'SECURITY TEST' }],
  ['activities', { title: 'SECURITY TEST', description: 'rls check' }],
  ['cv', { file_url: 'https://example.com/test.pdf', language: 'fr' }],
  ['messages', { name: 'SECURITY TEST', email: 'test@test.com', message: 'rls check' }],
];

const PUBLIC_READ_TABLES = ['projects', 'certificates', 'skills', 'experiences', 'cv'];
const PRIVATE_READ_TABLES = ['messages', 'stats']; // admin-only reads

// --- Run ---------------------------------------------------------------------
console.log(`\nSupabase RLS security check → ${URL_}\n`);

// 1. Public reads must work
console.log('Public read access (expected: allowed):');
for (const table of PUBLIC_READ_TABLES) {
  const { status } = await req('GET', `/rest/v1/${table}?select=*&limit=1`);
  report(status === 200, `SELECT ${table}`, `HTTP ${status}`);
}

// 2. Private tables must NOT be publicly readable
console.log('\nPrivate read access (expected: denied):');
for (const table of PRIVATE_READ_TABLES) {
  const { status } = await req('GET', `/rest/v1/${table}?select=*&limit=1`);
  report(isDenied(status), `SELECT ${table} denied`, `HTTP ${status}`);
}

// 3. Anonymous writes must be denied everywhere except stats
console.log('\nAnonymous writes (expected: denied):');
for (const [table, payload] of WRITE_TESTS) {
  const { status, data } = await req('POST', `/rest/v1/${table}`, payload);
  if (isDenied(status)) {
    report(true, `INSERT ${table} denied`, `HTTP ${status}`);
  } else if (status === 201) {
    report(false, `INSERT ${table} ALLOWED`, 'RLS is misconfigured — delete the test row!');
  } else {
    // 400 = constraint error before RLS, inconclusive but not a hole
    warn(`INSERT ${table} inconclusive`, `HTTP ${status} ${JSON.stringify(data)?.slice(0, 120)}`);
  }
}

// stats INSERT is intentionally public (visit tracker) — verify it behaves
{
  const { status } = await req('POST', '/rest/v1/stats', {
    page: 'rls-check', visitor_id: 'security-test', device: 'Desktop',
  });
  if (status === 201) {
    warn('INSERT stats allowed (by design)', 'public tracking policy — consider Edge Function + rate limit');
  } else {
    report(true, 'INSERT stats denied', `HTTP ${status} (tracker will silently fail)`);
  }
}

// 4. Anonymous update/delete — smoke check.
// NOTE: with the anon key, PostgREST returns 200 + [] when RLS filters all
// rows, so this cannot fully distinguish "denied" from "no match". The
// decisive checks are the INSERT tests above plus the dashboard checks
// listed at the end (authenticated non-admin write test).
console.log('\nAnonymous update/delete (smoke check):');
for (const table of ['projects', 'messages', 'stats']) {
  const upd = await req('PATCH', `/rest/v1/${table}?id=eq.00000000-0000-0000-0000-000000000000`, { title: 'hacked' });
  report(upd.status !== 500, `UPDATE ${table} no server error`, `HTTP ${upd.status}`);
  const del = await req('DELETE', `/rest/v1/${table}?id=eq.00000000-0000-0000-0000-000000000000`);
  report(del.status !== 500, `DELETE ${table} no server error`, `HTTP ${del.status}`);
}

// 5. Storage: anonymous upload must be denied
console.log('\nStorage write access (expected: denied):');
{
  const res = await fetch(`${URL_}/storage/v1/object/portfolio-images/rls-check.txt`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'text/plain', 'x-upsert': 'false' },
    body: 'rls check',
  });
  report(res.status !== 200 && res.status !== 201, 'storage upload denied', `HTTP ${res.status}`);
}

// --- Summary -----------------------------------------------------------------
console.log(`\n${failures === 0 ? '✅ All checks passed' : `❌ ${failures} check(s) FAILED`}`);
if (warnings) console.log(`${warnings} warning(s) — see above.`);
console.log('Reminder: also disable sign-ups in Supabase Dashboard → Authentication → Sign In / Providers.\n');
process.exit(failures === 0 ? 0 : 1);
