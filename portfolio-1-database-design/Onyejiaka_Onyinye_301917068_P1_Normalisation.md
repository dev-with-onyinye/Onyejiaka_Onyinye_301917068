# Workforce Scheduling and Attendance — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| employee_id | shift records (list) |
| --- | --- |
| 2 | [3] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| shift.id | shift.employee_id | shift.status | employee.id | employee.organization_id | employee.employee_code | organization.id | organization.name |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 3 | 2 | scheduled | 2 | 1 | NS-104 | 1 | Northstar Services |

Key: id.

## 2NF: depend on the whole key

The declared candidate keys do not introduce a partial dependency here, so the 1NF rows stay unchanged at this step.

## shift_example

| shift.id | shift.employee_id | shift.status | employee.id | employee.organization_id | employee.employee_code | organization.id | organization.name |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 3 | 2 | scheduled | 2 | 1 | NS-104 | 1 | Northstar Services |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## organization

| id | name | timezone |
| --- | --- | --- |
| 1 | Northstar Services | America/Chicago |

## employee

| id | organization_id | employee_code | display_name | active |
| --- | --- | --- | --- | --- |
| 2 | 1 | NS-104 | Jordan Lee | true |

## shift

| id | employee_id | shift_date | starts_at | ends_at | status |
| --- | --- | --- | --- | --- | --- |
| 3 | 2 | 2026-11-16 | 2026-11-16T14:00:00+00:00 | 2026-11-16T22:00:00+00:00 | scheduled |

## time_event

| id | shift_id | event_type | occurred_at | device_id | location_note |
| --- | --- | --- | --- | --- | --- |
| 4 | 3 | clock_in | 2026-11-16T13:58:00+00:00 | tablet-01 | Main entrance |
| 5 | 3 | clock_out | 2026-11-16T22:03:00+00:00 | tablet-01 | Main entrance |

## Dependencies

- organization: (id) → name, timezone
- employee: (id) → organization_id, employee_code, display_name, active
- shift: (id) → employee_id, shift_date, starts_at, ends_at, status
- time_event: (id) → shift_id, event_type, occurred_at, device_id, location_note

Joining the decomposed sample tables reproduces the original 1 example rows. The design assumes the declared keys describe the relevant business dependencies.
