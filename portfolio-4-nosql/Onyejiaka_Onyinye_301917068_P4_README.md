# Portfolio 4 — NoSQL and Advanced Data Models

I used MongoDB collection shift_event_documents for clock_in and clock_out events. These are fictional event examples based on employee, shift, time_event.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | One of the two selected case event labels |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related employee details are stored as snapshots with the event. This makes an event readable in one document. It duplicates some information, and later SQL changes do not automatically update the snapshots. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "clock_in",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "time_event",
        "key": {
            "id": 4
        },
        "snapshot": {
            "id": 4,
            "shift_id": 3,
            "event_type": "clock_in",
            "occurred_at": "2026-11-16T07:58:00-06:00",
            "device_id": "tablet-01",
            "location_note": "Main entrance"
        }
    },
    "embedded": {
        "employee": [
            {
                "key": {
                    "id": 2
                },
                "snapshot": {
                    "id": 2,
                    "organization_id": 1,
                    "employee_code": "NS-104",
                    "display_name": "Jordan Lee",
                    "active": true
                },
                "via": [
                    "time_event.shift_id → shift.employee_id → employee"
                ]
            }
        ]
    },
    "references": {
        "shift": [
            {
                "key": {
                    "id": 3
                },
                "via": [
                    "time_event.shift_id → shift"
                ]
            }
        ]
    },
    "details": {
        "channel": "web"
    }
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 2 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 4 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("shift_event_documents").find({"eventType":"clock_in"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "clock_in",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "id": 4
    }
  },
  {
    "_id": "event_000003",
    "eventType": "clock_in",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "id": 5
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("shift_event_documents").find({"source.key.id":4}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "clock_in",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "id": 4
    }
  },
  {
    "_id": "event_000002",
    "eventType": "clock_out",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "id": 4
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("shift_event_documents").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "clock_in",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "id": 4
    }
  },
  {
    "_id": "event_000002",
    "eventType": "clock_out",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "id": 4
    }
  },
  {
    "_id": "event_000003",
    "eventType": "clock_in",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "id": 5
    }
  },
  {
    "_id": "event_000004",
    "eventType": "clock_out",
    "occurredAt": {
      "$date": "2030-01-01T10:03:00Z"
    },
    "source": {
      "id": 5
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("shift_event_documents").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| clock_in | 2 |
| clock_out | 2 |

## Validation and suitability

MongoDB inserted 4 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 4 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across event types, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record.

## Run the script

Connect mongosh to a fresh exercise database and run Onyejiaka_Onyinye_301917068_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/Onyejiaka_Onyinye_301917068_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

