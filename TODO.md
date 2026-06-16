# TODO

## Spreedly Conversion Dashboard

- [ ] **Add Shop Count trend chart to Churn tab** — blocked until real churn data from Karsten is connected

## Security

- [x] **Harden Supabase write policies on Spreedly tables** — `write_all` is currently set to `public`, meaning anyone with the URL + anon key can wipe baseline/config/mappings. Fix: replace JS password check with Supabase Auth and change `write_all` to `authenticated` only. Low risk while URL stays internal.
- [x] **Admin password hardcoded in Spreedly_Conversion.html** — fixed: replaced with Supabase Auth (`signInWithPassword`); password is read from an input and verified server-side, no longer in the JS.

## Supabase Infrastructure

- [ ] **Set up separate Supabase Dev/Staging/Production projects** — low priority; benefit is safety (test schema changes before hitting prod) and cleaner dev workflow. Recoverable from CSV if skipped.

## Trial Conversion Dashboard

- [x] **Fix total conversion rate** — only show data from April 2026 onwards (currently includes old data)

## Upload HTML to Netlify

- [ ]  only the Spreedly Dashboard needs to be updated on the real server. 