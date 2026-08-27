# Feature: News Radar

**Status:** Planned
**Last updated:** 2026-08-27
**Depends on:** Content pipeline (triggers article generation), external APIs (HuggingFace, GitHub, X, RSS)
**Key files:** `src/lib/monitoring/`

---

## Objective

Automated detection of new AI model releases and significant industry events so AINN can be the first to publish benchmark results and sentiment analysis. The system monitors four data streams (HuggingFace, GitHub, X lists, corporate RSS) and sends actionable alerts when a high-priority event is detected, triggering the content pipeline.

---

## Current State

| Functionality | Status | Objective | Notes |
|---------------|--------|-----------|-------|
| HuggingFace Hub monitor | planned | Poll HF API every 15 minutes for new model uploads from high-profile orgs (meta-llama, mistralai, Qwen, google, etc.) | Free API. Sort by `createdAt` desc. |
| GitHub release monitor | planned | Watch release/tag endpoints of major inference engines (vLLM, Ollama, llama.cpp) for new architecture support. | Signals that a model release is imminent or just landed |
| X list monitor | planned | Poll a private X list of AI lab accounts and founders for launch keywords ("releasing", "available now", "introducing"). | Proprietary models announced here first |
| RSS feed aggregator | planned | Monitor corporate blog RSS (OpenAI, Anthropic, Google DeepMind, Mistral, Meta AI) for official announcements. | Standard Atom/RSS polling |
| Alert classification | planned | Auto-classify detected events by priority (critical / high / normal) based on org reputation and keyword signals. | Critical: top-5 lab new model. Normal: minor update. |
| Alert notification | planned | Send formatted alert to Slack/Discord/email with: source URL, model name, parameters, and pre-written download command if applicable. | "URGENT: Run benchmark suite for {model}" |
| Pipeline trigger | planned | Critical alerts auto-trigger the content pipeline to start generating an article draft. High/normal alerts go to a queue for editor decision. | Only critical triggers auto-draft |
| De-duplication | planned | Prevent multiple alerts for the same event detected across multiple streams. | Match on model name + 24-hour window |

---

## Architecture

### Four monitoring streams

```
┌────────────────────────────────────────────────────────────────┐
│                      NEWS RADAR                                 │
├──────────────┬──────────────┬───────────────┬─────────────────┤
│ HuggingFace  │   GitHub     │   X Lists     │   RSS Feeds     │
│ Hub API      │   Releases   │   (AI Labs)   │   (Lab Blogs)   │
│              │              │               │                 │
│ Poll /15min  │ Poll /1hr    │ Poll /1hr     │ Poll /30min     │
│ Filter: org  │ Filter: repo │ Filter: kw    │ Filter: new     │
└──────┬───────┴──────┬───────┴───────┬───────┴────────┬────────┘
       │              │               │                │
       └──────────────┴───────────────┴────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ CLASSIFIER      │
                    │ Priority: C/H/N │
                    │ De-duplicate    │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                ▼            ▼            ▼
         [Critical]      [High]      [Normal]
         Auto-trigger    Queue for    Log only
         pipeline        editor
```

### Stream 1: HuggingFace Hub API

**Endpoint:** `https://huggingface.co/api/models?sort=createdAt&direction=-1&limit=50`

**Filter logic:**
- Check `author` namespace against watchlist: `meta-llama`, `mistralai`, `Qwen`, `google`, `microsoft`, `nvidia`, `01-ai`, `deepseek-ai`, `cohere`, `stabilityai`
- Check for sudden download spike on brand-new repos (>1000 downloads in first hour)
- Check model card for size indicators: "7B", "70B", "MoE", "VLM"

**Priority mapping:**
- Top-5 lab + new architecture = Critical
- Top-5 lab + variant/finetune = High
- Other notable org = Normal

### Stream 2: GitHub Releases

**Repos to watch:**
- `vllm-project/vllm` — inference engine
- `ollama/ollama` — local model runner
- `ggerganov/llama.cpp` — quantized inference
- `huggingface/transformers` — model library

**Trigger:** New release/tag that mentions a new model architecture in the title or body.

**Why this matters:** When `vllm` adds support for a new architecture, it means the model weights just dropped or are about to.

### Stream 3: X List Monitoring

**Private list composition:**
- Official lab accounts: @OpenAI, @AnthropicAI, @GoogleDeepMind, @MistralAI, @xaboratory
- Key individuals: Sam Altman, Dario Amodei, Arthur Mensch, etc.
- Infrastructure accounts: @huggingface, @weights_biases

**Keyword triggers:** "available now", "API access", "introducing", "releasing", "launching", combined with model identifiers (numbers like "4", "5", "1.5", "Pro", "Ultra")

**Polling:** Every hour via X API v2 list timeline endpoint.

### Stream 4: RSS Feeds

**Feed URLs (maintained in config):**
- `https://openai.com/blog/rss.xml`
- `https://www.anthropic.com/rss.xml`
- `https://blog.google/technology/ai/rss/`
- `https://mistral.ai/feed.xml`
- Others as they appear

**Trigger:** Any new entry containing model-related keywords.

### Alert format (delivered to Slack/Discord/email)

```
🚨 AINN NEWS RADAR — CRITICAL

Source: HuggingFace Hub
Event: New model upload
Org: meta-llama
Model: Llama-4-70B-Instruct
Parameters: 70B
Architecture: New (not seen before)
URL: https://huggingface.co/meta-llama/Llama-4-70B-Instruct
Detected: 2026-08-27T14:22:00Z

Download command:
  huggingface-cli download meta-llama/Llama-4-70B-Instruct

Action: Content pipeline triggered. Draft will be ready in ~20 minutes.
```

### Database: `monitoring_alerts` table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | uuid | Primary key |
| `stream` | enum | `huggingface`, `github`, `x_list`, `rss` |
| `priority` | enum | `critical`, `high`, `normal` |
| `model_name` | text (nullable) | Detected model name |
| `org_name` | text (nullable) | Detected organization |
| `source_url` | text | Where the event was found |
| `raw_data` | jsonb | Full API response payload |
| `dedupe_key` | text | Hash for de-duplication (model_name + 24h window) |
| `pipeline_triggered` | boolean | Whether it auto-triggered article generation |
| `article_id` | uuid (nullable) | FK to resulting article (if one was created) |
| `detected_at` | timestamptz | When the system found it |
| `acknowledged_at` | timestamptz (nullable) | When editor acknowledged/dismissed |

### Scheduling

| Stream | Frequency | Implementation |
|--------|-----------|---------------|
| HuggingFace | Every 15 minutes | Vercel cron or external scheduler |
| GitHub | Every 60 minutes | Vercel cron |
| X Lists | Every 60 minutes | Vercel cron |
| RSS | Every 30 minutes | Vercel cron |

**Note on Vercel cron:** Vercel Pro allows cron jobs with minimum 1-minute intervals. Each monitor is a lightweight serverless function that polls, classifies, and stores/alerts.

---

## Watchlist Management

The list of orgs, repos, X accounts, and RSS feeds must be configurable without code changes:
- Store in a `monitoring_watchlist` table or a config file
- Editor can add/remove watched entities via a simple admin interface or direct DB edit
- New labs and tools emerge frequently — the watchlist must be easy to update

---

## Known Issues

| Functionality | Type | Description | Priority |
|---------------|------|-------------|----------|
| — | — | No issues yet (feature is planned) | — |

---

## History

| Date | Change |
|------|--------|
| 2026-08-27 | Feature specified in PRD |
