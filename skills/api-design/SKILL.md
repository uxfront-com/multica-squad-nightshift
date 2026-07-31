---
name: api-design
description: Design and review HTTP/JSON API contracts - resource naming, RFC 9457 error format, idempotency keys, cursor pagination, versioning and deprecation policy, and field conventions. Use whenever creating or changing any endpoint, whenever someone says "add an endpoint", "return this field", or "the frontend needs", when writing an OpenAPI spec, when reviewing backend PRs that touch request/response shapes, and before any breaking API change.
---

# API Design

Contract first: the OpenAPI diff (or a shapes comment in the issue) is reviewed **before** implementation code exists. Shapes are cheap to change in review and expensive to change in production.

## Resources & methods

- Nouns, plural, kebab-case paths: `/invoices`, `/invoices/{id}/line-items`. Verbs only for true actions that aren't CRUD: `POST /invoices/{id}/void`.
- `GET` safe+cacheable · `PUT` full replace · `PATCH` partial (JSON Merge Patch unless you truly need JSON Patch) · `DELETE` idempotent by definition — deleting a deleted thing is `404` or `204`, pick one and document it.
- Status discipline: `200` ok · `201` +Location on create · `202` accepted for async (return a status URL) · `204` no body · `400` malformed · `401` unauthenticated · `403` unauthorized · `404` not found *or concealed* · `409` state conflict · `422` valid JSON, invalid semantics · `429` +Retry-After · `5xx` our fault, never for client errors.

## Errors — RFC 9457 Problem Details, one shape everywhere

```json
{
  "type": "https://api.example.com/errors/validation-failed",
  "title": "Validation failed",
  "status": 422,
  "detail": "amount must be a positive integer",
  "instance": "/invoices",
  "errors": [{ "field": "amount", "code": "positive_required" }],
  "request_id": "req_8fk2n"
}
```

Stable machine `code` taxonomy (extend, never repurpose): `validation_failed`, `unauthenticated`, `permission_denied`, `not_found`, `conflict`, `rate_limited`, `idempotency_conflict`, `internal`. Messages are for humans and may change; codes are contract. Never leak stack traces, SQL, or internal hostnames; always include `request_id` for support correlation.

## Idempotency (non-negotiable for POST that creates or charges)

- Client sends `Idempotency-Key: <uuid>`. Server stores key → response for ≥24h.
- Same key + same body → replay the stored response (same status, same body). Same key + **different** body → `409`/`422` `idempotency_conflict`. Key seen while first request still in flight → `409` retry-later.
- Scope keys per endpoint per principal. This is what makes client retries safe; without it, "retry on timeout" mints duplicate charges.

## Pagination — cursor, not offset

```
GET /invoices?limit=50&cursor=eyJpZCI6...   →   { "data": [...], "next_cursor": "…" | null }
```

Cursors are opaque (encode sort key + id; sign or at least version them), stable under concurrent writes, and O(1) at any depth — offset pagination skips/duplicates rows when data moves and table-scans at page 400. `limit` capped server-side (default 50, max 200). Every list endpoint has a **stable total order** (usually `created_at DESC, id DESC` — the id tiebreak matters).

## Versioning & deprecation

- Additive is free: new optional fields, new endpoints, new enum values *only where clients were told to ignore unknowns* (say so in the spec).
- **Breaking** = removing/renaming fields, type or semantics changes, new required params, tightened validation, auth changes → new major (`/v2/...`). No exceptions "because it's small".
- Deprecation: mark in OpenAPI, emit `Deprecation: true` + `Sunset: <RFC 9651 date>` headers, minimum 90 days, monitor real traffic to zero before removal. An unannounced removal is an outage you scheduled.

## Field conventions

- JSON keys `snake_case`, consistent everywhere. Timestamps RFC 3339 UTC with `Z`, suffixed `_at`. Money = integer minor units + `currency` (ISO 4217) — never floats. Booleans ask a question (`is_paid`); no tri-state booleans (that's an enum). IDs are opaque prefixed strings (`inv_8x2k…`) — prefixes make logs and support tickets self-documenting. Enums are strings, closed and documented.
- Nulls: absent and null should not mean different things unless PATCH semantics require it — then document it loudly.

## Consumer contract (write it into the spec)

Timeouts on every call · retry only idempotent requests (or key'd POSTs) with exponential backoff + jitter, honoring `Retry-After` · treat unknown response fields as ignorable · rate limits returned as `429` with `Retry-After` seconds.

## Review checklist

- [ ] Shapes posted/diffed before implementation
- [ ] Every mutation: auth rule stated, idempotency story stated
- [ ] Error paths return Problem Details with stable codes
- [ ] Lists: cursor pagination + stable order + capped limit
- [ ] No breaking change smuggled as "fix"; deprecations have Sunset dates
- [ ] Example request/response pair per endpoint in the spec (they double as doc tests)
