# WanderLust API Documentation

## 1. Overview

WanderLust exposes a REST-style HTTP API for accommodation listings, users, reviews, bookings, and host dashboard data.

| Item | Value |
| --- | --- |
| Current API version | Unversioned (`v1` recommended for the next breaking change) |
| Local base URL | `http://localhost:8080` |
| Transport | HTTP/HTTPS |
| Data format | JSON, except listing image uploads |
| Authentication | JWT bearer token |
| Total implemented endpoints | 20 |

The endpoint paths below are the paths currently mounted by the Express application. Replace path parameters such as `:id` and `:bookingId` with real MongoDB ObjectId values.

## 2. Quick Start

### 2.1 Authenticate

Create an account or sign in to receive a JWT:

```http
POST http://localhost:8080/login
Content-Type: application/json

{
  "email": "guest@example.com",
  "password": "your-password"
}
```

Use the returned token on protected endpoints:

```http
Authorization: Bearer <jwt-token>
```

### 2.2 Browse listings

```http
GET http://localhost:8080/listings?q=goa
```

### 2.3 Create a booking

```http
POST http://localhost:8080/listings/<listingId>/bookings/
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "booking": {
    "checkIn": "2026-10-01",
    "checkOut": "2026-10-05",
    "guests": 2
  }
}
```

## 3. Authentication

Protected endpoints require a valid JWT in the `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

Tokens are issued by `POST /signup` and `POST /login` and expire after three days. Missing, malformed, invalid, or expired tokens return `401 Unauthorized`.

### Authorization roles

The API does not currently expose a separate role claim. Authorization is based on resource ownership:

- Authenticated users may create bookings and reviews.
- A booking may be cancelled by the user who created it.
- A listing may be updated or deleted only by its owner.
- A review may be deleted only by its author.
- A listing owner may confirm or host-cancel bookings for that listing.

## 4. Endpoint Summary

| # | Method | Endpoint | Auth | Purpose |
| ---: | --- | --- | --- | --- |
| 1 | `POST` | `/signup` | No | Register a user and issue a JWT |
| 2 | `POST` | `/login` | No | Authenticate a user and issue a JWT |
| 3 | `GET` | `/logout` | No | End the current Passport session |
| 4 | `GET` | `/profile` | Bearer | Get the authenticated user's profile |
| 5 | `PATCH` | `/profile` | Bearer | Update the authenticated user's profile |
| 6 | `GET` | `/listings/` | No | List all accommodations |
| 7 | `POST` | `/listings/` | Bearer | Create an accommodation listing |
| 8 | `GET` | `/listings/my` | Bearer | List the authenticated owner's listings |
| 9 | `GET` | `/listings/:id` | No | Get one listing with its reviews and owner |
| 10 | `PUT` | `/listings/:id` | Bearer + owner | Update a listing |
| 11 | `DELETE` | `/listings/:id` | Bearer + owner | Delete a listing |
| 12 | `POST` | `/listings/:id/reviews/` | Bearer | Add a review to a listing |
| 13 | `DELETE` | `/listings/:id/reviews/:reviewId` | Bearer + author | Delete a review |
| 14 | `PATCH` | `/listings/:id/bookings/test` | No | Temporary booking route test endpoint |
| 15 | `GET` | `/listings/:id/bookings/my` | Bearer | Get the authenticated user's bookings |
| 16 | `POST` | `/listings/:id/bookings/` | Bearer | Create a booking |
| 17 | `PATCH` | `/listings/:id/bookings/:bookingId/cancel` | Bearer + booking owner | Cancel a booking as the guest |
| 18 | `PATCH` | `/listings/:id/bookings/:bookingId/confirm` | Bearer + listing owner | Confirm a pending booking |
| 19 | `PATCH` | `/listings/:id/bookings/:bookingId/host-cancel` | Bearer + listing owner | Cancel a booking as the host |
| 20 | `GET` | `/dashboard/` | Bearer | Get host dashboard statistics and data |

## 5. Authentication Endpoints

### POST `/signup`

Registers a user, starts a Passport session, and returns a JWT.

**Request body**

```json
{
  "username": "wanderer",
  "email": "guest@example.com",
  "password": "your-password"
}
```

**Success: `201 Created`**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "<jwt-token>",
  "user": {
    "id": "<userId>",
    "username": "wanderer",
    "email": "guest@example.com"
  }
}
```

### POST `/login`

Authenticates a user by email and password and returns a JWT.

**Request body**

```json
{
  "email": "guest@example.com",
  "password": "your-password"
}
```

**Success: `200 OK`**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt-token>",
  "user": {
    "id": "<userId>",
    "username": "wanderer",
    "email": "guest@example.com"
  }
}
```

### GET `/logout`

Logs out the current Passport session.

**Success: `200 OK`**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET `/profile`

Requires a bearer token.

**Success: `200 OK`**

```json
{
  "success": true,
  "user": {
    "_id": "<userId>",
    "username": "wanderer",
    "email": "guest@example.com"
  }
}
```

### PATCH `/profile`

Requires a bearer token.

**Request body**

```json
{
  "username": "new-name",
  "email": "new-email@example.com"
}
```

Both fields are required.

## 6. Listing Endpoints

### GET `/listings/`

Returns all listings. This endpoint supports an optional case-insensitive search query across `title`, `location`, and `country`.

**Query parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `q` | string | No | Search listings by title, location, or country |

**Example**

```http
GET http://localhost:8080/listings/?q=beach
```

**Success: `200 OK`**

```json
{
  "success": true,
  "listings": [
    {
      "_id": "<listingId>",
      "title": "Beach House",
      "description": "A house near the sea",
      "price": 2500,
      "location": "Goa",
      "country": "India",
      "image": {
        "url": "https://example.com/image.jpg",
        "filename": "listing-image"
      },
      "owner": "<userId>",
      "reviews": [],
      "geometry": {
        "type": "Point",
        "coordinates": [73.8567, 15.4909]
      }
    }
  ]
}
```

### POST `/listings/`

Creates a listing. Requires a bearer token and `multipart/form-data` because an image is accepted through the `listing[image]` field.

**Form fields**

| Field | Type | Required |
| --- | --- | --- |
| `listing[title]` | string | Yes |
| `listing[description]` | string | Yes |
| `listing[location]` | string | Yes |
| `listing[country]` | string | Yes |
| `listing[price]` | number | Yes, minimum `0` |
| `listing[image]` | file | Optional |

The server geocodes `listing[location]`, assigns the authenticated user as owner, and stores the uploaded image in cloud storage.

**Success: `201 Created`**

```json
{
  "success": true,
  "message": "Listing created successfully",
  "listing": { "_id": "<listingId>" }
}
```

### GET `/listings/my`

Returns listings owned by the authenticated user.

**Success: `200 OK`**

```json
{
  "success": true,
  "listings": []
}
```

### GET `/listings/:id`

Returns a listing, populated reviews and review authors, and the listing owner.

**Success: `200 OK`**

```json
{
  "success": true,
  "listing": { "_id": "<listingId>" }
}
```

### PUT `/listings/:id`

Updates a listing owned by the authenticated user. Uses `multipart/form-data` and accepts the same listing fields as create. An optional `listing[image]` file replaces the stored image.

**Success: `200 OK`**

```json
{
  "success": true,
  "message": "Listing updated successfully",
  "listing": { "_id": "<listingId>" }
}
```

### DELETE `/listings/:id`

Deletes a listing owned by the authenticated user. Associated reviews are also removed by the model cleanup hook.

**Success: `200 OK`**

```json
{
  "success": true,
  "message": "Listing deleted successfully",
  "listing": { "_id": "<listingId>" }
}
```

## 7. Review Endpoints

### POST `/listings/:id/reviews/`

Adds a review to a listing. Requires a bearer token.

**Request body**

```json
{
  "review": {
    "rating": 5,
    "comment": "Excellent stay."
  }
}
```

`rating` must be an integer from `1` to `5`. `comment` is required.

**Success: `201 Created`**

```json
{
  "success": true,
  "message": "Review created successfully",
  "review": { "_id": "<reviewId>" }
}
```

### DELETE `/listings/:id/reviews/:reviewId`

Deletes a review. The authenticated user must be the review author.

**Success: `200 OK`**

```json
{
  "success": true,
  "message": "Review deleted successfully",
  "review": { "_id": "<reviewId>" }
}
```

## 8. Booking Endpoints

### GET `/listings/:id/bookings/my`

Returns bookings created by the authenticated user. The listing is populated and results are ordered newest first.

**Success: `200 OK`**

```json
{
  "success": true,
  "bookings": []
}
```

### POST `/listings/:id/bookings/`

Creates a booking for the listing. Requires a bearer token.

**Request body**

```json
{
  "booking": {
    "checkIn": "2026-10-01",
    "checkOut": "2026-10-05",
    "guests": 2
  }
}
```

Validation rules:

- `checkIn` and `checkOut` must be valid dates.
- `checkOut` must be after `checkIn`.
- `guests` must be an integer from `1` to `20`.
- `totalPrice` is calculated by the server as listing price multiplied by the number of nights.
- New bookings have `pending` status.

**Success: `201 Created`**

```json
{
  "success": true,
  "message": "Booking successfully",
  "booking": {
    "_id": "<bookingId>",
    "listing": "<listingId>",
    "user": "<userId>",
    "checkIn": "2026-10-01T00:00:00.000Z",
    "checkOut": "2026-10-05T00:00:00.000Z",
    "guests": 2,
    "totalPrice": 10000,
    "status": "pending"
  }
}
```

The server emits a Socket.IO `newBooking` event after creation.

### PATCH `/listings/:id/bookings/:bookingId/cancel`

Cancels a booking as the booking owner. A cancelled booking cannot be cancelled again.

**Success: `200 OK`**

```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "booking": { "_id": "<bookingId>", "status": "cancelled" }
}
```

### PATCH `/listings/:id/bookings/:bookingId/confirm`

Confirms a `pending` booking as the owner of the listing. The server emits a Socket.IO `bookingConfirmed` event after confirmation.

**Success: `200 OK`**

```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "booking": { "_id": "<bookingId>", "status": "confirmed" }
}
```

### PATCH `/listings/:id/bookings/:bookingId/host-cancel`

Cancels a booking as the owner of the listing.

**Success: `200 OK`**

```json
{
  "success": true,
  "message": "Booking Cancelled successfully."
}
```

### PATCH `/listings/:id/bookings/test`

Temporary diagnostic endpoint. It does not require authentication and returns a plain text response:

```text
PATCH WORKING
```

This route should not be used by production clients.

## 9. Host Dashboard

### GET `/dashboard/`

Requires a bearer token. Returns statistics and listings/bookings associated with the authenticated user's listings.

**Success: `200 OK`**

```json
{
  "success": true,
  "dashboard": {
    "totalListings": 2,
    "totalBookings": 4,
    "activeBookings": 3,
    "cancelledBookings": 1,
    "listings": [],
    "bookings": []
  }
}
```

## 10. Common Errors

Application errors use this structure:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Listing not found"
}
```

| Status | Meaning | Typical causes |
| ---: | --- | --- |
| `400` | Bad Request | Failed Joi validation, invalid date range, invalid booking state, missing profile fields |
| `401` | Unauthorized | Missing, invalid, or expired JWT; invalid login credentials |
| `403` | Forbidden | User is not the resource owner or review author |
| `404` | Not Found | Listing, booking, review, or user does not exist |
| `500` | Internal Server Error | Unexpected server or dependency failure |

## 11. Resource Models

### Listing

`title`, `description`, `location`, `country`, `price`, `image`, `owner`, `reviews`, and GeoJSON `geometry`.

### Review

`comment`, `rating` from `1` to `5`, `createdAt`, and `author`.

### Booking

`listing`, `user`, `checkIn`, `checkOut`, `guests` from `1` to `20`, calculated `totalPrice`, `status`, `createdAt`, and `updatedAt`.

Booking statuses are `pending`, `confirmed`, `cancelled`, and `completed`.

### User

The API exposes `id` or `_id`, `username`, and `email` in user-facing responses. Password hash and salt are not returned by the profile endpoint.

## 12. Integration Notes

- The backend listens on port `8080`.
- The configured CORS origin is `http://localhost:5173`.
- Listing create/update require the Mapbox token and cloud image storage configuration to be available.
- Socket.IO events currently emitted by booking workflows are `newBooking` and `bookingConfirmed`.
- The API is currently unversioned. A production release should introduce a prefix such as `/api/v1` and publish a machine-readable OpenAPI document alongside this guide.
