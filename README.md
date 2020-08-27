# Airbnb Reservation Component

> A feature to add, update, or remove a reservation

## Server API

### Retrieve all reservations for current property
  * GET `/properties/:property_id/reservations`

**Path Parameters:**
 * `property_id` property id

**Success Status Code:** `200`

**Returns:** JSON

```json
    {
      "room_id": "Number",
      "nightly_fee": "Number",
      "rating": "Number",
      "reviews": "Number",
      "minimum_stay": "Number",
      "maximum_guest": "Number",
      "minimum_stay": "Number",
      "reservations": [
        {
          "reservation_id": "String",
          "booked_date": "Date",
        }
      ]
    }
```
**Example request:** `/properties/1/reservations`

### Add a reservation
  * POST `/properties/:property_id/reservations`

**Path Parameters:**
 * `property_id` property id

**Success Status Code:** `201`

**Request Body**: Expects JSON with the following keys.

```json
    {
      "room_id": "Number",
      "check_in": "Date",
      "check_out": "Date",
    }
```
**Example request:** `/properties/1/reservations`
```json
    {
      "room_id": 1,
      "check_in": "2020-11-14",
      "check_out": "2020-11-24",
    }
```

### Update existing reservation
  * PATCH `/properties/:property_id/reservations`

**Path Parameters:**
  * `property_id` property id

**Success Status Code:** `204`

**Request Body**: Expects JSON with any of the following keys (include only keys to be updated)

```json
    {
      "reservation_id": {
        "description": "room id + check in date + check out date with an x in between all three",
        "type": "String"
      },
      "new_check_in": "Date",
      "new_check_out": "Date"
    }
```
**Example request:** `/properties/1/reservations`
```json
    {
      "reservation_id": "2x2020-11-14x2020-11-24",
      "new_check_in": "Date",
      "new_check_out": "Date"
    }
```

### Remove reservation
  * DELETE `/properties/:property_id/reservations`

**Path Parameters:**
  * `property_id` property id

**Success Status Code:** `204`

**Request Body**: Expects JSON with the following keys.

```json
    {
      "reservation_id": {
        "description": "room id + check in date + check out date with an x in between all three",
        "type": "String"
      },
    }
```
**Example request:** `/properties/1/reservations`
```json
     {
      "reservation_id": "2x2020-11-14x2020-11-24",
    }
```