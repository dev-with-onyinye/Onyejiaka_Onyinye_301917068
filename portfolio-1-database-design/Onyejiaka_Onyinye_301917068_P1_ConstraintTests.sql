-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. reject organization pk. Expected: pk_organization, SQLSTATE 23505.
INSERT INTO portfolio."organization" ("id", "name", "timezone")
VALUES (1, 'Other Services', 'America/Chicago');

-- 2. reject employee pk. Expected: pk_employee, SQLSTATE 23505.
INSERT INTO portfolio."employee" ("id", "organization_id", "employee_code", "display_name", "active")
VALUES (2, 1, 'NS-205', 'Casey Morgan', TRUE);

-- 3. reject employee unique. Expected: uq_employee_0, SQLSTATE 23505.
INSERT INTO portfolio."employee" ("id", "organization_id", "employee_code", "display_name", "active")
VALUES (100, 1, 'NS-104', 'Casey Morgan', TRUE);

-- 4. reject employee fk. Expected: fk_employee_0, SQLSTATE 23503.
INSERT INTO portfolio."employee" ("id", "organization_id", "employee_code", "display_name", "active")
VALUES (101, 9001, 'NS-206', 'Casey Morgan', TRUE);

-- 5. reject organization name null. Expected: name, SQLSTATE 23502.
INSERT INTO portfolio."organization" ("id", "name", "timezone")
VALUES (102, NULL, 'America/Chicago');

-- 6. reject shift pk. Expected: pk_shift, SQLSTATE 23505.
INSERT INTO portfolio."shift" ("id", "employee_id", "shift_date", "starts_at", "ends_at", "status")
VALUES (3, 2, '2026-11-17', '2026-11-17T08:00:00-06:00', '2026-11-17T16:00:00-06:00', 'scheduled');

-- 7. reject shift fk. Expected: fk_shift_0, SQLSTATE 23503.
INSERT INTO portfolio."shift" ("id", "employee_id", "shift_date", "starts_at", "ends_at", "status")
VALUES (103, 9002, '2026-11-17', '2026-11-17T08:00:00-06:00', '2026-11-17T16:00:00-06:00', 'scheduled');

-- 8. reject shift time check. Expected: shift_time_window_valid, SQLSTATE 23514.
INSERT INTO portfolio."shift" ("id", "employee_id", "shift_date", "starts_at", "ends_at", "status")
VALUES (104, 2, '2026-11-18', '2026-11-18T16:00:00-06:00', '2026-11-18T08:00:00-06:00', 'scheduled');

-- 9. reject time event pk. Expected: pk_time_event, SQLSTATE 23505.
INSERT INTO portfolio."time_event" ("id", "shift_id", "event_type", "occurred_at", "device_id", "location_note")
VALUES (4, 3, 'clock_in', '2026-11-16T07:57:00-06:00', 'tablet-02', 'Side entrance');

-- 10. reject time event fk. Expected: fk_time_event_0, SQLSTATE 23503.
INSERT INTO portfolio."time_event" ("id", "shift_id", "event_type", "occurred_at", "device_id", "location_note")
VALUES (105, 9003, 'clock_in', '2026-11-16T07:57:00-06:00', 'tablet-02', 'Side entrance');

-- 11. reject time event type check. Expected: time_event_type_allowed, SQLSTATE 23514.
INSERT INTO portfolio."time_event" ("id", "shift_id", "event_type", "occurred_at", "device_id", "location_note")
VALUES (106, 3, 'break_start', '2026-11-16T12:00:00-06:00', 'tablet-02', 'Main entrance');

-- 12. reject partial clock in. Expected: partial_clock_in_per_shift, SQLSTATE 23505.
INSERT INTO portfolio."time_event" ("id", "shift_id", "event_type", "occurred_at", "device_id", "location_note")
VALUES (107, 3, 'clock_in', '2026-11-16T07:59:00-06:00', 'tablet-02', 'Main entrance');

-- 13. reject partial clock out. Expected: partial_clock_out_per_shift, SQLSTATE 23505.
INSERT INTO portfolio."time_event" ("id", "shift_id", "event_type", "occurred_at", "device_id", "location_note")
VALUES (108, 3, 'clock_out', '2026-11-16T16:04:00-06:00', 'tablet-02', 'Main entrance');
