#!/usr/bin/env bash
set -euo pipefail

# Use the official Microsoft Playwright MCP server via npx
exec npx @playwright/mcp@latest "$@"
