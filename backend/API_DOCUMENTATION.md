# Unit Converter API Documentation

## Base URL

```
/api
```

All endpoints accept and return **JSON**.

---

## Authentication

### Register User

Create a new user account.

**Endpoint**

```
POST /api/auth/register
```

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

**Success Response (201)**

```json
{
  "token": "<jwt_token>",
  "user": {
    "id": "64f0c8...",
    "email": "user@example.com"
  }
}
```

**Error Responses**

* `400` – Missing email or password
* `409` – Email already registered

---

### Login User

Authenticate an existing user.

**Endpoint**

```
POST /api/auth/login
```

**Request Body**

```json
{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

**Success Response (200)**

```json
{
  "token": "<jwt_token>",
  "user": {
    "id": "64f0c8...",
    "email": "user@example.com"
  }
}
```

**Error Responses**

* `400` – Missing credentials
* `401` – Invalid email or password

---

## Unit Conversion

### Convert Units

Performs unit conversion.
Conversion can be done **with or without authentication**.

If authenticated, history can be saved.

**Endpoint**

```
POST /api/convert
```

**Headers (optional for saving history)**

```
Authorization: Bearer <jwt_token>
```

**Request Body**

```json
{
  "value": 100,
  "from": "cm",
  "to": "m",
  "category": "length",
  "save": true
}
```

**Request Fields**

| Field    | Type    | Required | Description                              |
| -------- | ------- | -------- | ---------------------------------------- |
| value    | number  | Yes      | Value to convert                         |
| from     | string  | Yes      | Source unit                              |
| to       | string  | Yes      | Target unit                              |
| category | string  | No       | Unit category (auto-inferred if omitted) |
| save     | boolean | No       | Save to history (default: true)          |

**Success Response (200)**

```json
{
  "success": true,
  "value": 100,
  "from": "cm",
  "to": "m",
  "category": "length",
  "result": 1,
  "savedId": "64f1ab..."
}
```

**Error Responses**

* `400` – Invalid input or unsupported unit

---

## Conversion History (Protected)

All history endpoints **require authentication**.

### Get User Conversion History

Returns paginated history records for the authenticated user.

**Endpoint**

```
GET /api/history
```

**Headers**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters**

| Param | Default | Description                |
| ----- | ------- | -------------------------- |
| page  | 1       | Page number                |
| limit | 20      | Records per page (max 100) |

**Success Response (200)**

```json
{
  "page": 1,
  "limit": 20,
  "total": 3,
  "data": [
    {
      "_id": "64f1ab...",
      "value": 100,
      "from": "cm",
      "to": "m",
      "category": "length",
      "result": 1,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### Delete User Conversion History

Deletes **all** conversion history for the authenticated user.

**Endpoint**

```
DELETE /api/history
```

**Headers**

```
Authorization: Bearer <jwt_token>
```

**Request Body**

```json
{
  "confirm": true
}
```

**Success Response (200)**

```json
{
  "deletedCount": 5
}
```

**Error Responses**

* `400` – Confirmation flag missing
* `401` – Unauthorized

---

## Supported Unit Categories

The API supports conversion across multiple categories, including:

* Length (m, km, cm, mm, in, ft, yd, mi)
* Mass (kg, g, mg, lb, oz, ton)
* Volume (l, ml, m³, cup, tbsp, tsp, gal)
* Time (s, ms, min, h, day)
* Speed (m/s, km/h, mph, knot)
* Data (B, KB, MB, GB, TB)
* Angle (rad, deg)
* Temperature (C, F, K)

---

## Data Retention Policy

* Conversion history records are **automatically deleted after 30 days**
* Implemented using MongoDB TTL indexes

---

## Security Notes

* Passwords are securely hashed using bcrypt
* Authentication is handled via JWT
* Protected endpoints require valid Authorization headers
* Basic rate limiting is enabled to prevent abuse

---

## Notes for Developers

* Anonymous users can convert units but cannot save history
* Authenticated users have isolated, private conversion histories
* API is designed for easy frontend integration (MERN stack)
