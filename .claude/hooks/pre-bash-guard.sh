#!/bin/bash
# Block dangerous bash commands before execution.
# Runs as PreToolUse hook on Bash tool.
# Reads tool_input from stdin JSON.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('input', {}).get('command', ''))
except Exception:
    print('')
" 2>/dev/null)

COMMAND_LOWER=$(echo "$COMMAND" | tr '[:upper:]' '[:lower:]')

case "$COMMAND_LOWER" in
  *"rm -rf /"*|*"rm -rf /*"*)
    echo '{"decision":"block","reason":"Blocked: recursive delete of root directory"}'
    exit 0
    ;;
  *"git push --force"*|*"git push -f"*)
    echo '{"decision":"block","reason":"Blocked: force push. Use git revert instead."}'
    exit 0
    ;;
  *"git reset --hard"*)
    echo '{"decision":"block","reason":"Blocked: hard reset. Ask project manager before rewriting history."}'
    exit 0
    ;;
  *"drop table"*|*"drop database"*)
    echo '{"decision":"block","reason":"Blocked: destructive database operation. Use migrations."}'
    exit 0
    ;;
esac

# Allow everything else
echo '{"decision":"allow"}'
exit 0
