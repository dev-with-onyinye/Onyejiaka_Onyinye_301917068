// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("shift_event_documents")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("shift_event_documents", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "clock_in",
                    "clock_out"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "time_event"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("shift_event_documents").insertMany([
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
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "clock_out",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "attributes": [
                {
                    "entity": "time_event",
                    "key": {
                        "id": 4
                    },
                    "field": "device_id",
                    "value": "tablet-01"
                },
                {
                    "entity": "time_event",
                    "key": {
                        "id": 4
                    },
                    "field": "location_note",
                    "value": "Main entrance"
                }
            ]
        }
    },
    {
        "_id": "event_000003",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "clock_in",
        "occurredAt": ISODate("2030-01-01T10:02:00Z"),
        "source": {
            "entity": "time_event",
            "key": {
                "id": 5
            },
            "snapshot": {
                "id": 5,
                "shift_id": 3,
                "event_type": "clock_out",
                "occurred_at": "2026-11-16T16:03:00-06:00",
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
    },
    {
        "_id": "event_000004",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "clock_out",
        "occurredAt": ISODate("2030-01-01T10:03:00Z"),
        "source": {
            "entity": "time_event",
            "key": {
                "id": 5
            },
            "snapshot": {
                "id": 5,
                "shift_id": 3,
                "event_type": "clock_out",
                "occurred_at": "2026-11-16T16:03:00-06:00",
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "attributes": [
                {
                    "entity": "time_event",
                    "key": {
                        "id": 5
                    },
                    "field": "device_id",
                    "value": "tablet-01"
                },
                {
                    "entity": "time_event",
                    "key": {
                        "id": 5
                    },
                    "field": "location_note",
                    "value": "Main entrance"
                }
            ]
        }
    }
]));
  await db.getCollection("shift_event_documents").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("shift_event_documents").find({"eventType":"clock_in"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("shift_event_documents").find({"source.key.id":4}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("shift_event_documents").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("shift_event_documents").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("shift_event_documents").insertOne({...{
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
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("shift_event_documents").insertOne({
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
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("shift_event_documents").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
