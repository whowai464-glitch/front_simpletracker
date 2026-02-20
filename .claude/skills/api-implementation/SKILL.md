---
name: api-implementation
description: Complete 11-step flow for implementing API routes. Covers reading contracts, creating validation schemas, handlers, route registration, build verification, curl testing, and documentation updates. Use when implementing any API endpoint or route.
---

# API Implementation Flow

Follow these 11 steps in order for every API route. Each step must succeed before the next.

## Step 1: Read api_contract.md
Find the route spec: method, URL, request payload, all response shapes (success + errors).

## Step 2: Read field_map.md
Verify field names for this module across layers. Check for transformations (e.g., `password` → `password_hash` via bcrypt).

## Step 3: Read db_schema.md
Confirm table and columns exist. If they don't, this task is blocked — report and stop.

## Step 4: Implement validation schema
Create in the project's schema directory. Use the project's validation library (Zod, Joi, etc.).

Validate:
- Required fields present
- Types correct
- Constraints enforced (min/max length, email format, etc.)
- No extra fields accepted

## Step 5: Implement handler/controller
Create in the project's handler directory. The handler must:
- Validate input using schema from Step 4
- Apply business logic
- Return response matching contract exactly
- Handle all error cases from contract
- Never expose sensitive fields (check field_map.md)

## Step 6: Register route
Add to the project's router file. Match method and path from contract exactly.

## Step 7: Build
```bash
[project build command]
```
Must exit 0. If errors, fix before continuing.

## Step 8: Curl test
```bash
curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X [METHOD] http://localhost:[PORT][PATH] \
  -H "Content-Type: application/json" \
  -d '[payload from contract]'
```
Test happy path first, then at least one error case.

## Step 9: Save to api_test_results.md
Record curl command and response for each test scenario.

## Step 10: Update api_contract.md
Set route status to `curl_tested`.

## Step 11: Commit
```bash
git add -A && git commit -m "[TASK-ID] implement [METHOD] [PATH]"
```

## Common Mistakes
- Guessing field names instead of reading field_map.md → always read first
- Forgetting error responses defined in contract → implement ALL response shapes
- Exposing password_hash in response → check sensitive fields in field_map.md
- Skipping curl test → curl BEFORE marking done
