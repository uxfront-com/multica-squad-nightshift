#!/usr/bin/env node
/**
 * axe-scan.mjs — WCAG 2.x A/AA automated scan via axe-core + Playwright.
 *
 * Usage:
 *   node axe-scan.mjs <url> [url ...] [--json] [--tags wcag2a,wcag2aa,wcag21aa,wcag22aa]
 *
 * Setup:
 *   npm i -D playwright @axe-core/playwright
 *   npx playwright install chromium
 *
 * Exit codes: 0 = no critical/serious violations, 1 = critical/serious found, 2 = usage/run error.
 * Reminder: automated scans catch ~30–50% of real issues. Keyboard, screen-reader,
 * zoom/reflow, and color passes are still mandatory (see SKILL.md).
 */
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const urls = argv.filter(a => !a.startsWith('--'));
const wantJson = argv.includes('--json');
const tagsArg = argv.find(a => a.startsWith('--tags='));
const tags = tagsArg
  ? tagsArg.split('=')[1].split(',')
  : ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

if (urls.length === 0) {
  console.error('Usage: node axe-scan.mjs <url> [url ...] [--json] [--tags=a,b]');
  process.exit(2);
}

const IMPACT_ORDER = { critical: 0, serious: 1, moderate: 2, minor: 3 };
const all = [];
let gate = 0;

const browser = await chromium.launch();
try {
  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
    const results = await new AxeBuilder({ page }).withTags(tags).analyze();
    await page.close();

    const v = [...results.violations].sort(
      (a, b) => (IMPACT_ORDER[a.impact] ?? 9) - (IMPACT_ORDER[b.impact] ?? 9)
    );
    all.push({ url, violations: v, passes: results.passes.length });

    console.log(`\n━━━ ${url}`);
    console.log(`    ${v.length} violation rule(s) · ${results.passes.length} rules passed`);
    for (const item of v) {
      if (item.impact === 'critical' || item.impact === 'serious') gate++;
      console.log(
        `  [${(item.impact || '?').toUpperCase().padEnd(8)}] ${item.id} — ${item.help}` +
        `\n             nodes: ${item.nodes.length} · fix: ${item.helpUrl}`
      );
      for (const n of item.nodes.slice(0, 3)) {
        console.log(`             ↳ ${n.target.join(' ')}`);
      }
      if (item.nodes.length > 3) console.log(`             ↳ …and ${item.nodes.length - 3} more`);
    }
  }
} catch (err) {
  console.error(`Scan failed: ${err.message}`);
  process.exit(2);
} finally {
  await browser.close();
}

if (wantJson) {
  writeFileSync('axe-report.json', JSON.stringify(all, null, 2));
  console.log('\nWrote axe-report.json');
}
console.log(
  gate
    ? `\n✗ ${gate} critical/serious violation rule(s). Failing.`
    : '\n✓ No critical/serious violations (manual passes still required).'
);
process.exit(gate ? 1 : 0);
