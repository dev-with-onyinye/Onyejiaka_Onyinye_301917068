# Workforce Scheduling and Attendance — database design

My case study records organization, employee, shift, time_event.

## Users

- Organization administrators managing employee records and schedules
- Managers reviewing shift coverage and attendance
- Employees recording their own clock-in and clock-out events

## Main operations

- Create and maintain organizations and employee records
- Schedule one employee for a shift with a start and end time
- Record clock-in and clock-out events for a scheduled shift
- Review attendance details and aggregate reports by organization and date

## Entities

| Entity | Information stored |
| --- | --- |
| organization | A customer organization that manages its employees and shifts. |
| employee | An employee record associated with one organization. |
| shift | A scheduled work period assigned to one employee. |
| time_event | A clock-in or clock-out event recorded for a scheduled shift. |

## organization

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| id | BIGINT | PK | Yes |
| name | TEXT |  | Yes |
| timezone | TEXT |  | Yes |


## employee

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| id | BIGINT | PK | Yes |
| organization_id | BIGINT | FK | Yes |
| employee_code | TEXT |  | Yes |
| display_name | TEXT |  | Yes |
| active | BOOLEAN |  | Yes |
- organization_id → organization.id
- Unique key: (organization_id, employee_code).

## shift

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| id | BIGINT | PK | Yes |
| employee_id | BIGINT | FK | Yes |
| shift_date | DATE |  | Yes |
| starts_at | TIMESTAMPTZ |  | Yes |
| ends_at | TIMESTAMPTZ |  | Yes |
| status | TEXT |  | Yes |
- employee_id → employee.id

## time_event

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| id | BIGINT | PK | Yes |
| shift_id | BIGINT | FK | Yes |
| event_type | TEXT |  | Yes |
| occurred_at | TIMESTAMPTZ |  | Yes |
| device_id | TEXT |  | No |
| location_note | TEXT |  | No |
- shift_id → shift.id

## Relationships and business rules

- Every organization must have a name.
- Every employee must reference an existing organization.
- An employee code must be unique within its organization.
- Every shift must reference an existing employee.
- A shift end timestamp must be later than its start timestamp.
- Every time event must reference an existing shift.
- A time event type must be clock_in or clock_out.
- A partial unique rule permits at most one clock_in event per shift.
- A partial unique rule permits at most one clock_out event per shift.

## Assumptions

- Each employee belongs to exactly one organization, and an employee code is unique within that organization.
- Each shift belongs to one employee and represents one scheduled work period. A shift may have at most one clock-in and one clock-out event; missing events are allowed and can be reported.
- Shift start and end timestamps use a consistent time-zone convention for each organization.
- The worked normalization example starts with Shift, which references Employee: employee name and organization membership remain in Employee, while shift date, times, and status remain in Shift. This avoids repeating employee attributes in each shift.
- The separate index benchmark plan uses 50,000 synthetic Shift rows. Compare the same date-range filter before and after a B-tree index on shift_date, and record the plans and measured outcomes without assuming an outcome.

