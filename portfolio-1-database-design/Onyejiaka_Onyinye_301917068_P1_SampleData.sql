-- Fictional sample records for Workforce Scheduling and Attendance.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."organization" ("id", "name", "timezone") VALUES (1, 'Northstar Services', 'America/Chicago');
INSERT INTO portfolio."employee" ("id", "organization_id", "employee_code", "display_name", "active") VALUES (2, 1, 'NS-104', 'Jordan Lee', TRUE);
INSERT INTO portfolio."shift" ("id", "employee_id", "shift_date", "starts_at", "ends_at", "status") VALUES (3, 2, '2026-11-16', '2026-11-16T08:00:00-06:00', '2026-11-16T16:00:00-06:00', 'scheduled');
INSERT INTO portfolio."time_event" ("id", "shift_id", "event_type", "occurred_at", "device_id", "location_note") VALUES (4, 3, 'clock_in', '2026-11-16T07:58:00-06:00', 'tablet-01', 'Main entrance');
INSERT INTO portfolio."time_event" ("id", "shift_id", "event_type", "occurred_at", "device_id", "location_note") VALUES (5, 3, 'clock_out', '2026-11-16T16:03:00-06:00', 'tablet-01', 'Main entrance');
COMMIT;
