// Load config.json (falls back to config.example.json). API keys come from env.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, "..");            // tools/immo-agent
export const VAULT_ROOT = resolve(ROOT, "..", "..");     // Obsidian vault root

export function loadConfig(path) {
  const p = path
    ? resolve(path)
    : existsSync(join(ROOT, "config.json"))
      ? join(ROOT, "config.json")
      : join(ROOT, "config.example.json");
  const cfg = JSON.parse(readFileSync(p, "utf-8"));
  cfg._path = p;
  cfg._vaultRoot = VAULT_ROOT;
  cfg.sources ??= {};
  cfg.sources.immoscout ??= {};
  cfg.sources.immoscout.api_key = process.env.IMMO_PILOTERR_KEY || "";
  return cfg;
}
