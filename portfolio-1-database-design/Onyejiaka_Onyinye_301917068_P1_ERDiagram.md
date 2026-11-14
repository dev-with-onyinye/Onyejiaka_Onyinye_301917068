# Workforce Scheduling and Attendance — ER diagram

```mermaid
erDiagram
    direction LR
    organization {
        bigint id PK
        text name
        text timezone
    }
    employee {
        bigint id PK
        bigint organization_id FK
        text employee_code
        text display_name
        boolean active
    }
    shift {
        bigint id PK
        bigint employee_id FK
        date shift_date
        timestamptz starts_at
        timestamptz ends_at
        text status
    }
    time_event {
        bigint id PK
        bigint shift_id FK
        text event_type
        timestamptz occurred_at
        text device_id "Optional"
        text location_note "Optional"
    }
    organization ||--o{ employee : "organization_id"
    employee ||--o{ shift : "employee_id"
    shift ||--o{ time_event : "shift_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/Onyejiaka_Onyinye_301917068_ERDiagram.png)
