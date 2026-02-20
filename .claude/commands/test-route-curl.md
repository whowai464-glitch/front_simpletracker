Test route $ARGUMENTS with curl:

1. Read `api_contract.md` for the route spec (method, URL, payload, expected responses)
2. Ensure dev server is running — if not, start it
3. Test all scenarios:
   - Happy path with valid payload
   - Missing required fields (expect 400)
   - Invalid field types (expect 400)
   - Business logic errors (expect 409/404/etc as defined in contract)
4. Save each curl command and response to `api_test_results.md`
5. Update `api_contract.md` → set route status to `curl_tested`
6. Emit STATUS_REPORT with test counts

If any test fails, report which scenario failed and why. Do not mark as done.
