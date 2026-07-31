---
name: e2e-playwright
description: Write stable Playwright end-to-end tests - role-based selector strategy, web-first assertions with zero sleeps, API-seeded isolation, auth via storage state, trace-on-retry config, and the quarantine flow for flakes. Use whenever writing or fixing e2e/browser/integration-UI tests, whenever a test uses waitForTimeout or CSS selector chains, whenever e2e tests flake or clash in parallel, and when deciding what belongs in e2e versus lower test layers.
---

# E2E with Playwright

E2E tests exist to prove the **top user journeys** survive on a real browser against a real stack. That's 10–20 tests, not 400 — everything provable at a lower layer (unit/component/API) moves down, because every e2e test is the slowest, flakiest way to assert anything. Guard the layer's purpose and the layer stays green.

## Selector strategy (strict ladder, top wins)

1. `getByRole('button', { name: 'Create invoice' })` — tests what users perceive AND enforces accessibility for free (no accessible name → no selector → fix the app)
2. `getByLabel` / `getByPlaceholder` — forms
3. `getByText` — non-interactive content, exact where possible
4. `getByTestId` — last resort for genuinely unnameable nodes; adding one is admitting the element has no accessible identity, which is sometimes itself the bug
5. **Never:** CSS chains (`.card > div:nth-child(2)`), XPath, class names — structure-coupled selectors make every refactor a test-suite incident

## Zero sleeps — web-first assertions

`page.waitForTimeout()` is banned. It's either too short (flake) or too long (waste), and it is always a guess.

```ts
await expect(page.getByRole('alert')).toHaveText(/saved/i);     // auto-retries until timeout
await expect(page.getByTestId('row')).toHaveCount(3);           // waits for the count
await expect(async () => {                                      // poll non-locator conditions
  const res = await request.get('/api/jobs/' + id);
  expect((await res.json()).status).toBe('done');
}).toPass({ timeout: 15_000 });
```

Locator assertions auto-wait and auto-retry; `toPass`/`expect.poll` cover everything else. If a test "needs" a sleep, the app is missing a signal (loading state, aria-live, network response) — surface that as a finding, don't paper over it.

## Isolation & data

- **Every test is an island**: fresh context per test (Playwright default), unique data per test (`user-${testInfo.testId}@…`), zero inter-test dependencies or ordering. A test you can't run alone with `--repeat-each=10` isn't done.
- **Seed via API, not UI**: creating fixtures through the UI makes every test also a test of the signup flow. Use the `request` fixture / API calls in `beforeEach` or fixtures to build state in milliseconds; the UI journey under test is the only UI you exercise.
- **Auth once, reuse**: a setup project logs in and saves `storageState`; tests start authenticated. Per-role state files (`admin.json`, `member.json`) make permission tests cheap. Never share one live account across parallel workers — that's a flake factory with a login page.
- **Mock third parties, never yourself**: `page.route()` stubs Stripe/analytics/external APIs at the network edge; your own API stays real (that's the E in e2e). Mock your own backend and you've built a slow component test.

## Config that prevents 2 a.m. debugging

```ts
export default defineConfig({
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: { trace: 'on-first-retry', screenshot: 'only-on-failure', video: 'retain-on-failure' },
  forbidOnly: !!process.env.CI,        // a stray .only in CI = suite silently skipped
  reporter: [['html'], ['list']],
});
```

`trace: 'on-first-retry'` is the single highest-value line: a retried failure ships a full DOM/network/console replay instead of a screenshot and a prayer. Shard across CI machines by timing data when the suite outgrows one runner.

## Retries are diagnosis, not treatment

CI `retries: 2` keeps the pipeline moving, **and** every retried-green run is recorded as a flake event feeding the threshold (2 flakes/7 days → quarantine same day: tag `@quarantine`, exclude from required checks, keep running non-blocking, issue + owner, 30-day fix-or-delete — full procedure in the ci-doctor skill). A retry that nobody counts is a flake being laundered.

## Test shape

- Name = user story: `test('member can download invoice PDF from billing history')`
- Arrange (API seed) → Act (the one UI journey) → Assert (user-visible outcome, not internal state)
- No conditionals or try/catch steering test flow — a test that branches is N tests wearing one name; write N tests
- Assert outcomes users can see (URL, toast, rendered row), plus at most one API-level check when the UI can't express the invariant
