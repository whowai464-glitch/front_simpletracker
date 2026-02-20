Implement API route $ARGUMENTS following the full cycle:

1. Read `api_contract.md` for the route specification
2. Read `field_map.md` for field alignment
3. Read `db_schema.md` to confirm table and columns
4. Implement validation schema
5. Implement handler/controller
6. Register route in router
7. Run build — must have zero errors
8. Curl test with payloads from the contract
9. Save curl command + response to `api_test_results.md`
10. Update `api_contract.md` → set status to `curl_tested`
11. Commit: `git add -A && git commit -m "[TASK-ID] implement [route]"`
12. Emit STATUS_REPORT block

If build fails at step 7, fix before continuing. Do not skip to curl.
If curl fails at step 8, fix the handler and rebuild before continuing.
Each step must succeed before moving to the next.
