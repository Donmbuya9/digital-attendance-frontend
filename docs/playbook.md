---

## **API Handoff Document: Digital Attendance System Backend**

**To:** Frontend Engineering Team
**From:** Backend Engineering Team
**Date:** Tuesday, August 26, 2025
**Version:** 1.0 (Production Ready)
**Status:** **COMPLETE**

### **1. General Information**

*   **Base URL:** `http://localhost:8080`
*   **Authentication:** All protected endpoints require a JWT to be sent in the `Authorization` header.
    *   Format: `Authorization: Bearer <your_jwt_token>`
*   **Data Format:** All request and response bodies are in `JSON` format.
*   **Error Responses:** Failed requests will return a standard JSON error object:
    ```json
    {
      "timestamp": "2025-08-26T19:30:00.123Z",
      "status": 403,
      "error": "Forbidden",
      "message": "You do not have permission to access this resource."
    }
    ```

---

### **2. Authentication Endpoints (`/api/v1/auth`)**

These endpoints are for user login, registration, and profile management.

#### **2.1 User Registration**

- **Endpoint:** `POST /api/v1/auth/register`
- **Auth:** `Public`
- **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "a-strong-password",
    "role": "ATTENDEE" // or "ADMINISTRATOR"
  }
  ```
- **Success Response (`200 OK`):** Returns a token and user profile.
  ```json
  {
    "token": "ey...",
    "user": {
      "id": "user-uuid-123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "ATTENDEE"
    }
  }
  ```

#### **2.2 User Login**

- **Endpoint:** `POST /api/v1/auth/login`
- **Auth:** `Public`
- **Request Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "a-strong-password"
  }
  ```
- **Success Response (`200 OK`):** Returns a token and user profile.
  ```json
  {
    "token": "ey...",
    "user": {
      "id": "user-uuid-123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "ATTENDEE"
    }
  }
  ```

#### **2.3 Get Current User Profile**

- **Endpoint:** `GET /api/v1/auth/me`
- **Auth:** `Required (Admin or Attendee)`
- **Purpose:** Used to verify a token and fetch the logged-in user's data upon application load.
- **Success Response (`200 OK`):**
  ```json
  {
    "id": "user-uuid-123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "ATTENDEE"
  }
  ```

---

### **3. Administrator Endpoints**

These endpoints are for managing the system's core data. **All endpoints in this section require an `ADMINISTRATOR` role.**

#### **3.1 Venue Management (`/api/v1/venues`)**

- `POST /`: Creates a new venue.
- `GET /`: Returns a list of all venues.
- `GET /{venueId}`: Returns a single venue by its ID.
- `PUT /{venueId}`: Updates a venue's details.
- `DELETE /{venueId}`: Deletes a venue.
- **Venue Object Structure:**
  ```json
  {
    "id": "venue-uuid-456",
    "name": "Main Campus Auditorium",
    "latitude": -6.7766,
    "longitude": 39.2312,
    "radius": 100 // in meters
  }
  ```

#### **3.2 Group Management (`/api/v1/groups`)**

- `POST /`: Creates a new group.
- `GET /`: Returns a list of all groups (basic view).
- `GET /{groupId}`: Returns a group's details, including an array of its `members`.
- `POST /{groupId}/members`: Adds a user to a group. Request body: `{ "userId": "user-uuid-123" }`.
- `DELETE /{groupId}/members/{userId}`: Removes a user from a group.
- `DELETE /{groupId}`: Deletes a group.

#### **3.3 Event Management (`/api/v1/events`)**

- `POST /`: Creates/schedules a new event. Requires `venueId`, `groupId`, `startTime`, and `endTime`.
- `GET /`: Returns a list of all scheduled events.
- `GET /{eventId}`: Returns detailed event info, including a list of all `attendees` and their `status` (`PENDING`, `PRESENT`, `ABSENT`).
- `POST /{eventId}/attendance/start`: Initiates the live attendance window for an event. Returns a short-lived `attendanceCode`.

#### **3.4 User Utility (`/api/v1/users`)**

- `GET /`: Returns a list of all users in the system. Useful for populating "Add Member" dialogs.

---

### **4. Attendee Endpoints**

These endpoints are for the attendee user experience. **All endpoints in this section require an `ATTENDEE` role.**

#### **4.1 Get My Events**

- **Endpoint:** `GET /api/v1/attendee/events`
- **Auth:** `Required (Attendee)`
- **Purpose:** Fetches the list of all events the currently logged-in attendee is scheduled for. This is the primary data source for the attendee dashboard.
- **Success Response (`200 OK`):** Returns an array of Event objects.
  ```json
  [
    {
      "id": "event-uuid-789",
      "title": "Weekly Team Meeting",
      "description": "...",
      "startTime": "2025-08-26T19:00:00Z",
      "endTime": "2025-08-26T20:00:00Z",
      "venue": { "id": "venue-uuid-456", "name": "Conference Room A" },
      "group": { "id": "group-uuid-abc", "name": "Project Alpha Team" }
    }
  ]
  ```

#### **4.2 Mark Attendance**

- **Endpoint:** `POST /api/v1/events/{eventId}/attendance/mark`
- **Auth:** `Required (Attendee)`
- **Purpose:** Allows the attendee to mark themselves as present for a specific event.
- **Request Body:**
  ```json
  {
    "attendanceCode": "123-456", // The code provided by the administrator
    "latitude": -6.7765, // User's current device latitude
    "longitude": 39.2311 // User's current device longitude
  }
  ```
- **Success Response (`200 OK`):** An empty body. The frontend should then re-fetch event data to show the updated "PRESENT" status.
