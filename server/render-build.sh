#!/usr/bin/env bash
set -e

pip install -r requirements.txt

# Force Playwright to use local project path
export PLAYWRIGHT_BROWSERS_PATH=0

# Install full Chromium only (NOT headless_shell)
playwright install chromium