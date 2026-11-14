-- Show related employee, shift records (up to 20).
SELECT t0."id" AS "employee_id",
       t0."employee_code" AS "employee_employee_code",
       t1."id" AS "shift_id",
       t1."shift_date" AS "shift_shift_date"
FROM portfolio."employee" t0
JOIN portfolio."shift" t1 ON t1."employee_id" = t0."id"
ORDER BY t0."id", t1."id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT t0."id" AS "employee_id",
       t0."employee_code" AS "employee_employee_code",
       t1."id" AS "shift_id",
       t1."shift_date" AS "shift_shift_date"
FROM portfolio."employee" t0
JOIN portfolio."shift" t1 ON t1."employee_id" = t0."id"
ORDER BY t0."id", t1."id"
LIMIT 20;

-- Find time_event records where shift_id matches 3 (up to 20).
SELECT * FROM portfolio."time_event"
WHERE "shift_id" IS NOT DISTINCT FROM 3
ORDER BY "id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."time_event"
WHERE "shift_id" IS NOT DISTINCT FROM 3
ORDER BY "id"
LIMIT 20;

-- Count employee records for each organization_id (up to 20 groups).
SELECT "organization_id", count(*) AS record_count
FROM portfolio."employee"
GROUP BY "organization_id"
ORDER BY record_count DESC, "organization_id" NULLS LAST
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT "organization_id", count(*) AS record_count
FROM portfolio."employee"
GROUP BY "organization_id"
ORDER BY record_count DESC, "organization_id" NULLS LAST
LIMIT 20;
