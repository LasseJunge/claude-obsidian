---
type: source
created: 2026-06-16
updated: 2026-06-16
title: "Supabase Integration im Netlify-Dashboard debuggen"
aliases:
  - "Netlify"
date: 2026-05-05
source_file: ".raw/Claude-Supabase-Integration im Netlify-Dashboard debuggen.md"
tags:
  - supabase
  - netlify
  - debugging
  - dashboard
  - credentials
  - epages
status: processed
related:
  - "[[Supabase]]"
  - "[[Netlify]]"
  - "[[ePages Spreedly Migration]]"
  - "[[epages-spreedly-migration-dashboard]]"
---

# Supabase Integration im Netlify-Dashboard debuggen

Debug session (2026-05-05) diagnosing why a Netlify-deployed dashboard could not connect to Supabase, preventing multi-device file visibility.

## Problem

A Netlify dashboard using Supabase for shared file storage was not working across devices. The code expected Supabase credentials to be injected as `window` globals in `index.html`:

```html
<script>
  window.SUPABASE_URL = 'DEINE_SUPABASE_URL';
  window.SUPABASE_KEY = 'DEIN_ANON_KEY';
</script>
```

The placeholder strings had never been replaced with real credentials, so every Supabase call failed silently.

## Root Cause

The bundled JS referenced `window.SUPABASE_URL` and `window.SUPABASE_KEY` — a window-global injection pattern (not Vite `import.meta.env`). Because the HTML was deployed with the placeholder text intact, no actual Supabase project was ever reached.

## Fix Applied

1. Open Supabase project → **Project Settings → API**
2. Copy **Project URL** and **anon / public** key
3. Replace placeholders in `index.html` with real values
4. Re-deploy to Netlify

## Security Note

The `anon` key is visible in the page source (client-side). Mitigation: enable **Row Level Security (RLS)** in Supabase under Authentication → Policies so that the exposed key cannot be abused to read or write arbitrary data.

## Relevance to ePages Dashboard

The ePages Spreedly migration dashboard uses the same Supabase-backed Netlify stack. This session documents the credential-injection pattern and the RLS reminder that applies to that project as well.

## Key Insight

Window-global credential injection (`window.SUPABASE_URL`) is fragile because placeholder values cause silent auth failures with no obvious error; always verify credentials are substituted before deploying.
