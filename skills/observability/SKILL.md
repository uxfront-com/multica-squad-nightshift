---
name: observability
description: Instrument services so failures explain themselves - structured logging conventions, trace propagation, RED metrics, cardinality rules, SLO-based alerting, and what every PR must instrument. Use whenever adding an endpoint, job, or integration, whenever writing log statements or metrics, whenever debugging production ("why is it slow", "what happened at 14:02"), when building dashboards or alerts, and when reviewing any PR that adds a failure mode without adding visibility.
---

# Observability

The test: **can a stranger diagnose this failure at 3 a.m. from telemetry alone**, without adding a log line and redeploying? Instrument for that stranger.

## Structured logs

- JSON, one event per line. Required keys: `ts` (RFC 3339 UTC), `level`, `msg`, `service`, `trace_id`, `span_id`; plus event-specific context (`order_id`, `duration_ms`).
- `msg` is a stable string ("payment declined"), context goes in fields — never interpolate IDs into the message (kills aggregation).
- Levels: `error` = broken + actionable · `warn` = degraded/retrying, survivable · `info` = state changes worth an audit trail · `debug` = off in prod by default, toggleable per-service without deploy.
- **Canonical log line:** one `info` per request at completion with everything (route, status, duration_ms, user hash, key decision fields). One greppable line per request beats forty breadcrumbs.
- **Never log:** secrets, tokens, passwords, full card/PII. User identifiers are hashed or opaque IDs. An access log is a breach inventory waiting to happen.
- Log an error **or** propagate it, not both at every layer — triple-logged single failures make error rates unreadable. Log where it's handled.

## Traces

- Propagate W3C `traceparent` on every inbound/outbound hop, including queues (stash it in message headers).
- Span per logical operation, named low-cardinality: `HTTP GET /invoices/{id}` (route template, not URL), `db.query invoices.select_by_user`, `queue.publish invoice.created`.
- Record errors on spans with the exception; attach retry counts, cache hit/miss, and payload *sizes* (never payload contents) as attributes.
- Sample head-based at whatever budget allows, but **always keep error and slow traces** (tail-based or force-sample on error).

## Metrics — RED for services, USE for resources

- **RED** per endpoint/operation: **R**ate (req/s), **E**rrors (by code class), **D**uration (histogram — you need p50/p95/p99, so histograms, not averages; averages hide every incident you'll ever have).
- **USE** per resource (pool, queue, disk): **U**tilization, **S**aturation (queue depth, wait time), **E**rrors.
- Naming (Prometheus conventions): `snake_case`, unit-suffixed, `_total` for counters: `http_request_duration_seconds`, `queue_depth`, `payment_failures_total{reason=…}`.
- **Cardinality is a budget:** labels are bounded sets only (route template, status class, region). `user_id`, `email`, `request_id` in a label will eventually take the metrics store down — that's what traces and logs are for.

## Every PR instruments what it adds

| You added | You must also add |
|---|---|
| Endpoint | RED metrics, canonical log line, trace span (usually via middleware — verify, don't assume) |
| Background job | Duration histogram, success/failure counter, last-success timestamp (the "is it even running" gauge) |
| External call | Duration + error metrics by dependency, timeout config, span with retry count |
| Feature flag | Exposure event, so "who saw it" is answerable during the incident it causes |
| Failure mode (catch block, fallback) | A `warn`/`error` + counter — a silent fallback is a lie with good uptime |

## Alerting — symptoms, not causes

- Page on **SLO symptoms**: error-rate burn and latency burn on user-facing paths. Two-window burn alerts as the starter kit: fast burn (severe, ~1h window) pages; slow burn (~6h+) files a ticket.
- Causes (CPU, one pod restarting, queue blip) are dashboard material, not pages — they page only when they *are* the symptom (disk full).
- Every alert states in its description: what the user impact is, first three things to check, runbook link. An alert without a next action is noise with a pager.
- Starter SLOs if none exist: availability 99.9% on the money path, p95 latency budget per key endpoint. Written down, reviewed quarterly.

## Dashboards

One per service, top-down: SLO status → RED for key endpoints → dependencies → saturation. Deploy markers overlaid on everything (the answer to most "what happened at 14:02" is "the 14:00 deploy"). If a dashboard hasn't been looked at in a quarter, delete it — dead dashboards hide live ones.
