-- Workforce Scheduling and Attendance: tables, keys and business constraints.
-- Run once in a fresh PostgreSQL database.
BEGIN;
SET LOCAL standard_conforming_strings = on;
CREATE SCHEMA portfolio;
CREATE TABLE portfolio."organization" (
  "id" bigint NOT NULL,
  "name" text NOT NULL,
  "timezone" text NOT NULL,
  CONSTRAINT "pk_organization" PRIMARY KEY ("id")
);
CREATE TABLE portfolio."employee" (
  "id" bigint NOT NULL,
  "organization_id" bigint NOT NULL,
  "employee_code" text NOT NULL,
  "display_name" text NOT NULL,
  "active" boolean NOT NULL,
  CONSTRAINT "pk_employee" PRIMARY KEY ("id"),
  CONSTRAINT "uq_employee_0" UNIQUE ("organization_id", "employee_code")
);
CREATE TABLE portfolio."shift" (
  "id" bigint NOT NULL,
  "employee_id" bigint NOT NULL,
  "shift_date" date NOT NULL,
  "starts_at" timestamptz NOT NULL,
  "ends_at" timestamptz NOT NULL,
  "status" text NOT NULL,
  CONSTRAINT "pk_shift" PRIMARY KEY ("id")
);
CREATE TABLE portfolio."time_event" (
  "id" bigint NOT NULL,
  "shift_id" bigint NOT NULL,
  "event_type" text NOT NULL,
  "occurred_at" timestamptz NOT NULL,
  "device_id" text,
  "location_note" text,
  CONSTRAINT "pk_time_event" PRIMARY KEY ("id")
);
ALTER TABLE portfolio."employee" ADD CONSTRAINT "fk_employee_0" FOREIGN KEY ("organization_id") REFERENCES portfolio."organization" ("id");
ALTER TABLE portfolio."shift" ADD CONSTRAINT "fk_shift_0" FOREIGN KEY ("employee_id") REFERENCES portfolio."employee" ("id");
ALTER TABLE portfolio."time_event" ADD CONSTRAINT "fk_time_event_0" FOREIGN KEY ("shift_id") REFERENCES portfolio."shift" ("id");
ALTER TABLE portfolio."shift" ADD CONSTRAINT "shift_time_window_valid" CHECK ("ends_at" > "starts_at");
ALTER TABLE portfolio."time_event" ADD CONSTRAINT "time_event_type_allowed" CHECK (("event_type" = 'clock_in') OR ("event_type" = 'clock_out'));
CREATE UNIQUE INDEX "partial_clock_in_per_shift" ON portfolio."time_event" ("shift_id") WHERE ("event_type" = 'clock_in');
CREATE UNIQUE INDEX "partial_clock_out_per_shift" ON portfolio."time_event" ("shift_id") WHERE ("event_type" = 'clock_out');
COMMIT;
