#!/bin/bash
# Auto-format files after Claude edits them.
# Runs as PostToolUse hook on Write|Edit tools.
# Reads tool_input from stdin JSON to get file path.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    inp = data.get('input', {})
    print(inp.get('file_path', '') or inp.get('path', ''))
except Exception:
    print('')
" 2>/dev/null)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Format based on file extension
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.html|*.md)
    if command -v prettier &>/dev/null; then
      prettier --write "$FILE_PATH" 2>/dev/null || true
    else
      echo "[hook] WARNING: prettier not found, skipping format for $FILE_PATH" >&2
    fi
    ;;
  *.py)
    if command -v black &>/dev/null; then
      black --quiet "$FILE_PATH" 2>/dev/null || true
    else
      echo "[hook] WARNING: black not found, skipping format for $FILE_PATH" >&2
    fi
    ;;
esac

exit 0
