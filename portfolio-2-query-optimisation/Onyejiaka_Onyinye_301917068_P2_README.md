# Workforce Scheduling and Attendance — SQL queries

## 1. Show related employee, shift records (up to 20).

```sql
SELECT t0."id" AS "employee_id",
       t0."employee_code" AS "employee_employee_code",
       t1."id" AS "shift_id",
       t1."shift_date" AS "shift_shift_date"
FROM portfolio."employee" t0
JOIN portfolio."shift" t1 ON t1."employee_id" = t0."id"
ORDER BY t0."id", t1."id"
LIMIT 20;
```

| employee_id | employee_employee_code | shift_id | shift_shift_date |
| --- | --- | --- | --- |
| 2 | NS-104 | 3 | 2026-11-16 |

## 2. Find time_event records where shift_id matches 3 (up to 20).

```sql
SELECT * FROM portfolio."time_event"
WHERE "shift_id" IS NOT DISTINCT FROM 3
ORDER BY "id"
LIMIT 20;
```

| id | shift_id | event_type | occurred_at | device_id | location_note |
| --- | --- | --- | --- | --- | --- |
| 4 | 3 | clock_in | 2026-11-16T13:58:00+00:00 | tablet-01 | Main entrance |
| 5 | 3 | clock_out | 2026-11-16T22:03:00+00:00 | tablet-01 | Main entrance |

## 3. Count employee records for each organization_id (up to 20 groups).

```sql
SELECT "organization_id", count(*) AS record_count
FROM portfolio."employee"
GROUP BY "organization_id"
ORDER BY record_count DESC, "organization_id" NULLS LAST
LIMIT 20;
```

| organization_id | record_count |
| --- | --- |
| 1 | 1 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 2.073 | 2.117, 2.073, 1.985 | Sort → Seq Scan | 274 |
| After index | 0.31 | 0.302, 0.31, 0.421 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 55 |

The median execution time changed from 2.073 ms to 0.31 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=2.077..2.08 rows=50 loops=1)
  Seq Scan on shift (actual time=0.016..2.037 rows=50 loops=1)
Planning Time: 0.338 ms
Execution Time: 2.117 ms
```

### Before index, run 2

```text
Sort (actual time=2.045..2.048 rows=50 loops=1)
  Seq Scan on shift (actual time=0.015..2.005 rows=50 loops=1)
Planning Time: 0.351 ms
Execution Time: 2.073 ms
```

### Before index, run 3

```text
Sort (actual time=1.942..1.945 rows=50 loops=1)
  Seq Scan on shift (actual time=0.018..1.885 rows=50 loops=1)
Planning Time: 0.33 ms
Execution Time: 1.985 ms
```

### After index, run 1

```text
Sort (actual time=0.247..0.25 rows=50 loops=1)
  Bitmap Heap Scan on shift (actual time=0.033..0.209 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.015..0.015 rows=50 loops=1)
Planning Time: 0.563 ms
Execution Time: 0.302 ms
```

### After index, run 2

```text
Sort (actual time=0.254..0.257 rows=50 loops=1)
  Bitmap Heap Scan on shift (actual time=0.033..0.214 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.015 rows=50 loops=1)
Planning Time: 0.563 ms
Execution Time: 0.31 ms
```

### After index, run 3

```text
Sort (actual time=0.344..0.347 rows=50 loops=1)
  Bitmap Heap Scan on shift (actual time=0.064..0.285 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.039..0.039 rows=50 loops=1)
Planning Time: 1.582 ms
Execution Time: 0.421 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run Onyejiaka_Onyinye_301917068_P2_Queries.sql, then Onyejiaka_Onyinye_301917068_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/Onyejiaka_Onyinye_301917068_P2_QueryResults.png) · [Index comparison](screenshots/Onyejiaka_Onyinye_301917068_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

