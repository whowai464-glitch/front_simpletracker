---
name: frontend-implementation
description: Flow for building frontend components aligned with API contracts and field maps. Covers reading specs, creating components, wiring API calls, handling states, and verifying field alignment. Use when implementing any UI page, form, or component.
---

# Frontend Implementation Flow

## Before Writing Code

1. **Read field_map.md** — which fields does this component display or edit?
2. **Read api_contract.md** — which endpoints does this component call? What's the response shape?
3. **Read 2-3 existing components** — match patterns, naming, structure
4. **Read architecture.md** — framework, styling, state management approach

## Implementation Steps

### 1. Create component
Follow existing patterns exactly. Match file naming, export style, and directory structure.

### 2. Wire API calls
Use field names from field_map.md. Common transformations:
- API `created_at` (snake_case) → Frontend `createdAt` (camelCase)
- API returns `id` → Frontend may need `userId` for props

### 3. Handle all states
Every component must handle:
- **Loading** — spinner or skeleton while fetching
- **Success** — data rendered correctly
- **Error** — user-friendly error message
- **Empty** — "no data" state when list is empty

### 4. Form validation
For forms, validate before submission:
- Required fields have values
- Email fields have valid format
- Passwords meet minimum requirements
- Error messages displayed next to fields

### 5. Build and verify
```bash
[project build command]
```
Must pass with zero errors.

### 6. Visual check
If dev server is running, open the page and verify it renders. If browser automation is available, use E2E_Tester subagent.

## Field Alignment Checklist
- [ ] API response fields match what component renders?
- [ ] Form submission sends exactly what API expects (no extra fields)?
- [ ] Sensitive fields (passwords, tokens) never displayed?
- [ ] Date/time transformations consistent?
- [ ] Naming convention transformations documented in field_map.md?

## Common Mistakes
- Using API field names directly without transformation → check field_map.md
- Forgetting empty state → users see blank page instead of helpful message
- Not matching existing component patterns → inconsistency confuses maintenance
- Submitting extra fields in forms → API may reject or store garbage
