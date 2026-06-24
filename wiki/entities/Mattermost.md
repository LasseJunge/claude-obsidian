---
type: entity
entity_type: product
title: "Mattermost"
address: c-000048
aliases:
  - "mattermost"
created: 2026-06-24
updated: 2026-06-24
tags:
  - product
  - chat-platform
  - self-hosted
related:
  - "[[OpenClaw]]"
  - "[[Chat-Native AI Agents]]"
  - "[[OpenClaw — Self-Hosted Chat-to-Agent Gateway]]"
---

# Mattermost

Open-source, self-hostable team chat platform (a Slack alternative). Relevant as the channel surface the user wants a company AI agent to live in.

## OpenClaw Mattermost channel (integration specifics)
- Install via `openclaw plugins install`; needs a bot account token + base URL + DM policy. Uses WebSocket events for channels/groups/DMs.
- **Chat modes**: `oncall` (@mention only, default) · `onmessage` (all messages) · `onchar` (prefix trigger like `>` / `!`).
- **Threading**: `replyToMode` = off / first / all.
- **Access control**: DM **pairing** by default (approval codes, expire 1h); channel allowlists by user ID or access group.
- **Native slash commands**: `oc_*` with HMAC-SHA256 token validation + auto refresh.
- **Streaming**: editable draft post consolidating thinking/tool activity/partial text (modes: partial/block/progress/off).
- **Extras**: emoji reaction tool, interactive 2D button arrays (default/primary/danger), directory adapter for `#channel`/`@user`, multi-account support.

Full notes: [[OpenClaw — Self-Hosted Chat-to-Agent Gateway]].
