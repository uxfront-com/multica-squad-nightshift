---
name: db-migrations
description: Ship zero-downtime database schema changes - the expand/migrate/contract playbook, Postgres lock-safety rules, batched backfills, and rollback discipline. Use whenever adding/removing/renaming columns or tables, adding indexes or constraints, changing column types, writing any migration file, planning a backfill, or reviewing a PR that touches the schema. Also use when someone asks "is this migration safe to run in production".
---

# DB Migrations

Two invariants: **the app must work with both schema N and N+1 running simultaneously** (deploys overlap), and **every step must be independently deployable and abortable**. Everything below serves those two.

## Expand → Migrate → Contract

| Phase | Schema | Code | Abort story |
|---|---|---|---|
| **1. Expand** | Add new column/table/index (nullable, no reads depend on it) | Unchanged | Drop the unused addition |
| **2. Dual-write** | — | Write old+new, still read old | Stop writing new |
| **3. Backfill** | Batched copy of historical rows | — | Pause anytime; it's resumable |
| **4. Read-switch** | — | Read new (ideally behind a flag), verify parity | Flip flag back |
| **5. Contract** | Drop old column/constraints | Remove dual-write | ⚠ one-way — only after a full release cycle of quiet |

Each phase is its own PR/deploy. The contract phase waits until you'd bet a weekend on nothing reading the old path (search the codebase *and* the query logs).

**Renames and type changes are never in-place** on non-trivial tables — both are "add new, dual-write, backfill, switch, drop old". Exceptions that are metadata-only in Postgres: widening `varchar(n)`, `varchar → text`.

## Postgres lock-safety table

| Operation | Safe form | Trap |
|---|---|---|
| Add column | `ADD COLUMN x type` (nullable) — metadata-only; constant/stable `DEFAULT` also metadata-only (PG11+) | **Volatile default** (`gen_random_uuid()`, `random()`) rewrites the whole table under ACCESS EXCLUSIVE |
| Add index | `CREATE INDEX CONCURRENTLY` | Can't run in a transaction; on failure leaves an `INVALID` index — check `pg_index`, drop, retry |
| NOT NULL on existing col | `ADD CONSTRAINT c CHECK (x IS NOT NULL) NOT VALID` → `VALIDATE CONSTRAINT` → (PG12+) `SET NOT NULL` (uses the validated check, no scan) → drop the check | Bare `SET NOT NULL` full-scans under ACCESS EXCLUSIVE |
| Foreign key | `ADD CONSTRAINT … NOT VALID` → `VALIDATE CONSTRAINT` (SHARE UPDATE EXCLUSIVE) | Plain `ADD FOREIGN KEY` locks both tables while scanning |
| Drop column | Metadata-only, but breaks N−1 code | Only in contract phase; never same deploy as the code removal |
| Change type | New column + dual-write dance | `ALTER TYPE` rewrites + ACCESS EXCLUSIVE (except binary-coercible widenings) |

**Always set timeouts in the migration session** so a blocked DDL fails fast instead of queueing behind a long transaction *and then blocking every query behind it*:

```sql
SET lock_timeout = '3s';
SET statement_timeout = '15min';
-- retry loop with backoff on lock_timeout failures
```

## Backfills

- **Never inside the migration transaction.** A migration that touches millions of rows is a script wearing a migration costume.
- Batch by primary key range: `UPDATE … WHERE id > $last AND id <= $last+10000`, commit per batch, sleep 50–200ms between, record progress so it resumes.
- Watch while running: replication lag, lock waits, error rate. Backfills are boring or they are incidents.
- Make backfill writes idempotent (`WHERE new_col IS NULL`) so re-runs are safe.

## Rollback discipline

- **Down migrations lie.** Write them for expand steps (drop the unused column), but the real rollback strategy is *forward*: because of expand/contract, rolling back **code** is always safe until the contract phase — that's the point of the whole dance.
- Never write a destructive down (drop table with data, remove column post-backfill). If down can't restore the world, it says `-- irreversible: forward-fix only` and the PR states the recovery plan.
- Contract-phase PRs name their recovery plan explicitly (usually: restore from backup + replay — which is why contract waits).

## Testing & review checklist

- [ ] Ran against a **prod-sized copy**; measured duration and peak lock level (`pg_locks` during run)
- [ ] Works with N and N+1 code simultaneously (state which phase this PR is)
- [ ] `lock_timeout`/`statement_timeout` set; CONCURRENTLY where applicable; failure/retry story stated
- [ ] Backfill (if any) is batched, resumable, idempotent, and separate from DDL
- [ ] Down migration honest (real, or explicitly marked irreversible with recovery plan)
- [ ] Contract steps: proof nothing reads the old path (code search + query log sample)
