---
name: testing-patterns
description: Testing pyramid, curl test patterns, and coverage targets for the project. Covers build verification, curl testing, unit tests, integration tests, E2E tests, and security audits. Use when writing tests, verifying implementations, or planning test strategy.
---

# Testing Patterns

## Testing Pyramid

| Level | What | When | Tool |
|-------|------|------|------|
| **Build** | Zero compilation errors | After every code change | Project build command |
| **Curl** | Manual API route testing | After each route implementation | curl with contract payloads |
| **Unit** | Functions and modules isolated | After each module | Project test framework |
| **Integration** | Modules interacting | After related modules done | Project test framework |
| **E2E** | Full user flows in browser | End of each sprint | E2E_Tester subagent |
| **Security** | OWASP, dependencies, secrets | End of each sprint | Security_Reviewer subagent |

Minimum coverage target: **80%**.

## Curl Test Template

```bash
# Happy path
curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST http://localhost:[PORT]/api/v1/[resource] \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'

# Missing required field
curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST http://localhost:[PORT]/api/v1/[resource] \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'
# Expected: 400

# Duplicate (business logic error)
# Run happy path twice
# Expected: 409
```

## Saving Curl Results

In `api_test_results.md`:
```markdown
## POST /api/v1/users — Tested [DATE]

### Happy Path
- Command: `curl -s ...`
- Expected: 201 { id, name, email, created_at }
- Actual: 201 { "id": "...", "name": "Test", ... }
- Result: PASS

### Missing email
- Command: `curl -s ...`
- Expected: 400 { error: { code, message } }
- Actual: 400 { "error": { "code": "VALIDATION_ERROR", ... } }
- Result: PASS
```

## Unit Test Patterns

```
describe('[Module/Function]', () => {
  // Happy path
  it('should [expected behavior] when [valid input]')
  
  // Edge cases  
  it('should handle empty input')
  it('should handle boundary values')
  
  // Error conditions
  it('should throw when [invalid input]')
  it('should return error when [dependency fails]')
})
```

Rules:
- Test behavior, not implementation
- Descriptive test names
- One assertion per test (preferred)
- No test depends on another test's side effects

## When to Use Subagents vs Direct Testing

| Situation | Approach |
|-----------|----------|
| Quick curl after implementing a route | Direct — run curl yourself |
| Systematic testing of all routes in a sprint | API_Tester subagent |
| Writing unit tests for a module | Test_Writer subagent |
| Full browser flow testing | E2E_Tester subagent |
| Security audit | Security_Reviewer subagent |
