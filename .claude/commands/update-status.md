Emit a STATUS_REPORT for task $ARGUMENTS:

1. Check current state of the task:
   - Did the build pass? Run build command and confirm.
   - Were tests run? Check test results.
   - What files were changed? Run `git diff --name-only HEAD~1` or `git status`.

2. Emit the block:
```
STATUS_REPORT
TASK: [task ID]
STATUS: [done|error|blocked|needs_review|partial]
FILES_CHANGED: [from git diff]
FILES_DELETED: [if any]
TESTS_RUN: [count]
TESTS_PASSED: [count]
TESTS_FAILED: [count]
BUILD: [pass|fail|not_run]
ERRORS: [if any]
SUMMARY: [1-2 lines]
NEXT: [suggestion]
END_STATUS_REPORT
```

Only mark STATUS as `done` if build passes AND tests pass (if tests were required).
