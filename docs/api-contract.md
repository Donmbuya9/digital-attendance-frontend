# **API Contract: Digital Attendance System**

**Version:** 1.0
**Base URL:** `/api/v1`
**General Principles:**
1.  All request and response bodies will be in JSON format (`Content-Type: application/json`).
2.  All JSON properties will use `camelCase` (e.g., `firstName`).
3.  Successful responses for fetching data will use `200 OK`.
4.  Successful responses for creating data will use `201 Created`.
5.  Authentication is handled via JWT Bearer tokens. Once logged in, every request to a protected endpoint must include an `Authorization` header with the value `Bearer <your_jwt_token>`.
6.  Standard error responses will follow this structure:
    ```json
    {
      "timestamp": "ISO 8601 datetime string",
      "status": <HTTP_STATUS_CODE>,
      "error": "<HTTP_ERROR_MESSAGE>",
      "message": "<A_CLEAR_DEVELOPER_FRIENDLY_MESSAGE>"
    }
    ```

---

## **Module 1: Authentication (`/auth`)**

This module handles user registration, login, and profile retrieval.

### **1.1 Register a New User**

This endpoint is used to create a new user account, which can be either an `ATTENDEE` or an `ADMINISTRATOR`. For initial setup, we will allow creating both, but in a real-world scenario, administrator creation might be restricted.

*   **Endpoint:** `POST /api/v1/auth/register`
*   **Access:** Public
*   **Purpose:** Creates a new user in the system.

#### **Request Body:**

```json
{
  "firstName": "string (required, max 50 chars)",
  "lastName": "string (required, max 50 chars)",
  "email": "string (required, valid email format, unique)",
  "password": "string (required, min 8 chars)",
  "role": "string (required, must be either 'ATTENDEE' or 'ADMINISTRATOR')"
}
```

#### **Success Response (`201 Created`):**

The system returns the created user's data, excluding the password, confirming successful registration.

```json
{
  "id": "string (UUID format)",
  "firstName": "Salvation",
  "lastName": "Kamwaya",
  "email": "salvation@example.com",
  "role": "ADMINISTRATOR"
}
```

#### **Error Responses:**
*   `400 Bad Request`: If any required fields are missing, the password is too short, or the email format is invalid.
    ```json
    {
      "timestamp": "2023-10-26T10:00:00.000Z",
      "status": 400,
      "error": "Bad Request",
      "message": "Password must be at least 8 characters long."
    }
    ```
*   `409 Conflict`: If a user with the provided email already exists.
    ```json
    {
      "timestamp": "2023-10-26T10:01:00.000Z",
      "status": 409,
      "error": "Conflict",
      "message": "User with email salvation@example.com already exists."
    }
    ```

---

### **1.2 Authenticate a User (Login)**

This endpoint authenticates a user with their email and password and returns a JWT for use in subsequent authenticated requests.

*   **Endpoint:** `POST /api/v1/auth/login`
*   **Access:** Public
*   **Purpose:** Authenticates a user and provides a JWT for session management.

#### **Request Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### **Success Response (`200 OK`):**

The system returns the JWT and some basic user information. The frontend must store this token (e.g., in `localStorage` or a cookie) and use it in the `Authorization` header for all future protected requests.

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYWx2YXRpb25AZXhhbXBsZS5jb20iLCJpYXQiOjE2OTgzNzQ0MDAsImV4cCI6MTY5ODQ2MDgwMH0.SomeVeryLongTokenSignature",
  "user": {
    "id": "string (UUID format)",
    "firstName": "Salvation",
    "role": "ADMINISTRATOR"
  }
}
```

#### **Error Responses:**
*   `401 Unauthorized`: If the email does not exist or the password is incorrect. The message should be generic to prevent user enumeration.
    ```json
    {
      "timestamp": "2023-10-26T10:05:00.000Z",
      "status": 401,
      "error": "Unauthorized",
      "message": "Invalid email or password."
    }
    ```

---

### **1.3 Get Current User Profile**

This endpoint allows a logged-in user to retrieve their own full profile information.

*   **Endpoint:** `GET /api/v1/auth/me`
*   **Access:** Authenticated (Requires Bearer Token)
*   **Purpose:** Fetches the complete profile of the currently authenticated user.

#### **Request Body:**
(None)

#### **Success Response (`200 OK`):**

Returns the full user object, excluding sensitive information like the password.

```json
{
  "id": "string (UUID format)",
  "firstName": "Salvation",
  "lastName": "Kamwaya",
  "email": "salvation@example.com",
  "role": "ADMINISTRATOR"
}
```

#### **Error Responses:**
*   `401 Unauthorized`: If the token is missing, invalid, or expired.
    ```json
    {
      "timestamp": "2023-10-26T10:10:00.000Z",
      "status": 401,
      "error": "Unauthorized",
      "message": "Full authentication is required to access this resource."
    }
    ```

---












---

## **Module 2: Venue Management (`/venues`)**

This module handles the creation and management of physical locations (venues). Access to all endpoints in this module is restricted to users with the `ADMINISTRATOR` role.

### **2.1 Create a New Venue**

Creates a new venue with its geographical coordinates and a defined perimeter for attendance verification.

*   **Endpoint:** `POST /api/v1/venues`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To register a new physical location where events can be held.

#### **Request Body:**

```json
{
  "name": "string (required, unique, max 100 chars)",
  "latitude": "number (required, valid latitude format, e.g., -6.8235)",
  "longitude": "number (required, valid longitude format, e.g., 39.2695)",
  "radius": "integer (required, in meters, e.g., 50)"
}
```

#### **Success Response (`201 Created`):**

Returns the full object of the newly created venue, including its system-generated ID.

```json
{
  "id": "string (UUID format)",
  "name": "Makerspace Dar es Salaam",
  "latitude": -6.8235,
  "longitude": 39.2695,
  "radius": 50
}
```

#### **Error Responses:**
*   `400 Bad Request`: If any required fields are missing or data types are incorrect.
*   `401 Unauthorized`: If the user is not authenticated.
*   `403 Forbidden`: If the authenticated user has the `ATTENDEE` role.
*   `409 Conflict`: If a venue with the same `name` already exists.

---

### **2.2 Get a List of All Venues**

Retrieves a list of all venues currently registered in the system. This is useful for admins when they need to assign a venue to an event.

*   **Endpoint:** `GET /api/v1/venues`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To fetch a complete list of all available venues.

#### **Request Body:**
(None)

#### **Success Response (`200 OK`):**

Returns an array of venue objects. The array will be empty `[]` if no venues have been created yet.

```json
[
  {
    "id": "string (UUID format)",
    "name": "Makerspace Dar es Salaam",
    "latitude": -6.8235,
  	"longitude": 39.2695,
  	"radius": 50
  },
  {
    "id": "string (UUID format)",
    "name": "Main Lecture Hall",
    "latitude": -6.7766,
  	"longitude": 39.2312,
  	"radius": 75
  }
]
```

#### **Error Responses:**
*   `401 Unauthorized`: If the user is not authenticated.
*   `403 Forbidden`: If the authenticated user has the `ATTENDEE` role.

---

### **2.3 Get a Single Venue by ID**

Retrieves the details of a specific venue using its unique ID.

*   **Endpoint:** `GET /api/v1/venues/{venueId}`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To fetch the details of one specific venue.

#### **Request Body:**
(None)

#### **URL Parameters:**
*   `venueId` (string, UUID format): The unique identifier of the venue to retrieve.

#### **Success Response (`200 OK`):**

```json
{
  "id": "string (UUID format of the requested venue)",
  "name": "Makerspace Dar es Salaam",
  "latitude": -6.8235,
  "longitude": 39.2695,
  "radius": 50
}
```

#### **Error Responses:**
*   `401 Unauthorized`: If the user is not authenticated.
*   `403 Forbidden`: If the authenticated user has the `ATTENDEE` role.
*   `404 Not Found`: If no venue exists with the provided `venueId`.

---

### **2.4 Update an Existing Venue**

Updates the details of a specific venue.

*   **Endpoint:** `PUT /api/v1/venues/{venueId}`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To modify the details of an existing venue.

#### **URL Parameters:**
*   `venueId` (string, UUID format): The unique identifier of the venue to update.

#### **Request Body:**

The full venue object with the new values. All fields are required.

```json
{
  "name": "Makerspace Coworking DSM",
  "latitude": -6.8236,
  "longitude": 39.2694,
  "radius": 60
}
```

#### **Success Response (`200 OK`):**

Returns the updated venue object.

```json
{
  "id": "string (UUID format of the updated venue)",
  "name": "Makerspace Coworking DSM",
  "latitude": -6.8236,
  "longitude": 39.2694,
  "radius": 60
}
```

#### **Error Responses:**
*   `400 Bad Request`: If the request body is invalid.
*   `401 Unauthorized`: If the user is not authenticated.
*   `403 Forbidden`: If the authenticated user has the `ATTENDEE` role.
*   `404 Not Found`: If no venue exists with the provided `venueId`.
*   `409 Conflict`: If the new `name` conflicts with another existing venue.

---

### **2.5 Delete a Venue**

Permanently removes a venue from the system.

*   **Endpoint:** `DELETE /api/v1/venues/{venueId}`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To delete a venue.

#### **URL Parameters:**
*   `venueId` (string, UUID format): The unique identifier of the venue to delete.

#### **Request Body:**
(None)

#### **Success Response (`204 No Content`):**
An empty response body with a `204` status code indicates successful deletion.

#### **Error Responses:**
*   `401 Unauthorized`: If the user is not authenticated.
*   `403 Forbidden`: If the authenticated user has the `ATTENDEE` role.
*   `404 Not Found`: If no venue exists with the provided `venueId`.

---



Understood. We will proceed.

Following the logical setup process, after defining the physical **Venues**, the next step for an `ADMINISTRATOR` is to organize users. We will create a generic concept of **Groups**. A group is simply a collection of users (primarily attendees) that can be managed as a single unit. This is essential for scheduling an event for a specific set of people.

Here is the next section for our `api-contract.md` file.

---


Understood. We will proceed.

Following the logical setup process, after defining the physical **Venues**, the next step for an `ADMINISTRATOR` is to organize users. We will create a generic concept of **Groups**. A group is simply a collection of users (primarily attendees) that can be managed as a single unit. This is essential for scheduling an event for a specific set of people.

Here is the next section for our `api-contract.md` file.

---

## **Module 3: Group Management (`/groups`)**

This module allows `ADMINISTRATOR` users to create, view, and manage groups of attendees. This is used to organize users into cohorts, classes, or teams.

### **3.1 Create a New Group**

Creates a new, empty group.

*   **Endpoint:** `POST /api/v1/groups`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To create a logical grouping for users.

#### **Request Body:**

```json
{
  "name": "string (required, unique, max 100 chars)",
  "description": "string (optional, max 255 chars)"
}
```

#### **Success Response (`201 Created`):**

Returns the full object of the newly created group.

```json
{
  "id": "string (UUID format)",
  "name": "Java IPT - Fall 2023",
  "description": "The cohort for the Industrial Practical Training in Java technologies for the Fall 2023 semester."
}
```

#### **Error Responses:**
*   `400 Bad Request`: If the `name` is missing or exceeds the character limit.
*   `401 Unauthorized`: If the user is not authenticated.
*   `403 Forbidden`: If the authenticated user has the `ATTENDEE` role.
*   `409 Conflict`: If a group with the same `name` already exists.

---

### **3.2 Get a List of All Groups**

Retrieves a list of all groups in the system.

*   **Endpoint:** `GET /api/v1/groups`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To fetch a complete list of all available groups.

#### **Success Response (`200 OK`):**

Returns an array of group objects.

```json
[
  {
    "id": "string (UUID format)",
    "name": "Java IPT - Fall 2023",
    "description": "The cohort for the Industrial Practical Training..."
  },
  {
    "id": "string (UUID format)",
    "name": "Data Science Workshop",
    "description": "Attendees for the weekend Data Science workshop."
  }
]
```

---

### **3.3 Get a Single Group and its Members**

Retrieves the details of a specific group, including a list of all users who are members of that group.

*   **Endpoint:** `GET /api/v1/groups/{groupId}`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To view a group's details and member list.

#### **URL Parameters:**
*   `groupId` (string, UUID format): The unique identifier of the group.

#### **Success Response (`200 OK`):**

```json
{
  "id": "string (UUID format)",
  "name": "Java IPT - Fall 2023",
  "description": "The cohort for the Industrial Practical Training...",
  "members": [
    {
      "id": "string (User UUID format)",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    {
      "id": "string (User UUID format)",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com"
    }
  ]
}
```

#### **Error Responses:**
*   `401 Unauthorized`: User not authenticated.
*   `403 Forbidden`: User is not an `ADMINISTRATOR`.
*   `404 Not Found`: If no group exists with the provided `groupId`.

---

### **3.4 Add a Member to a Group**

Adds an existing user (typically an `ATTENDEE`) to a specific group.

*   **Endpoint:** `POST /api/v1/groups/{groupId}/members`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To enroll a user into a group.

#### **URL Parameters:**
*   `groupId` (string, UUID format): The ID of the group to add the member to.

#### **Request Body:**

```json
{
  "userId": "string (required, UUID of the user to add)"
}
```

#### **Success Response (`200 OK`):**

Returns a success message confirming the action.

```json
{
  "message": "User added to group successfully."
}
```

#### **Error Responses:**
*   `400 Bad Request`: `userId` is missing or invalid.
*   `404 Not Found`: If either the group (`groupId`) or the user (`userId`) does not exist.
*   `409 Conflict`: If the user is already a member of the group.

---

### **3.5 Remove a Member from a Group**

Removes a user from a specific group.

*   **Endpoint:** `DELETE /api/v1/groups/{groupId}/members/{userId}`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To unenroll a user from a group.

#### **URL Parameters:**
*   `groupId` (string, UUID format): The ID of the group.
*   `userId` (string, UUID format): The ID of the user to remove.

#### **Success Response (`204 No Content`):**
An empty response body with a `204` status code indicates successful removal.

#### **Error Responses:**
*   `404 Not Found`: If the specified group, user, or membership relationship does not exist.

---

### **3.6 Delete a Group**

Permanently deletes a group. This action un-enrolls all members but does not delete the user accounts themselves.

*   **Endpoint:** `DELETE /api/v1/groups/{groupId}`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To delete a group.

#### **URL Parameters:**
*   `groupId` (string, UUID format): The ID of the group to delete.

#### **Success Response (`204 No Content`):**
An empty response with a `204` status code.

#### **Error Responses:**
*   `404 Not Found`: If the group does not exist.

---


Excellent. Let's define the API for the central piece of the application: **Event Management**.

This module is where all the pieces we've defined so far—Users, Venues, and Groups—come together. An `ADMINISTRATOR` will use these endpoints to schedule an `Event`, which is the core activity for which attendance will be tracked.

Here is the next section for our `api-contract.md` file.

---

## **Module 4: Event Management (`/events`)**

This module allows `ADMINISTRATOR` users to schedule, view, and manage events. An event ties together a group of attendees, a venue, and a specific time.

### **4.1 Schedule a New Event**

Creates a new event for a specific group at a designated venue and time.

*   **Endpoint:** `POST /api/v1/events`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To schedule a new event for attendance tracking.

#### **Request Body:**

```json
{
  "title": "string (required, max 100 chars)",
  "description": "string (optional, max 255 chars)",
  "venueId": "string (required, UUID of an existing venue)",
  "groupId": "string (required, UUID of an existing group)",
  "startTime": "string (required, ISO 8601 format, e.g., '2023-11-15T09:00:00Z')",
  "endTime": "string (required, ISO 8601 format, must be after startTime)"
}
```

#### **Success Response (`201 Created`):**

Returns the full details of the newly created event, including information about the associated venue and group for easy display on the frontend.

```json
{
  "id": "string (UUID format)",
  "title": "Java Fundamentals - Lecture 1",
  "description": "Introduction to Java syntax and the JVM.",
  "startTime": "2023-11-15T09:00:00Z",
  "endTime": "2023-11-15T11:00:00Z",
  "venue": {
    "id": "string (Venue UUID)",
    "name": "Main Lecture Hall"
  },
  "group": {
    "id": "string (Group UUID)",
    "name": "Java IPT - Fall 2023"
  }
}
```

#### **Error Responses:**
*   `400 Bad Request`: If any required fields are missing, `endTime` is before `startTime`, or data formats are invalid.
*   `404 Not Found`: If the specified `venueId` or `groupId` does not exist.
*   `401 Unauthorized`/`403 Forbidden`: For authentication/authorization failures.

---

### **4.2 Get a List of All Events**

Retrieves a list of all events. This can be used to populate a calendar or a list view in the admin dashboard.

*   **Endpoint:** `GET /api/v1/events`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To fetch a list of all scheduled events.

#### **Success Response (`200 OK`):**

Returns an array of event objects.

```json
[
  {
    "id": "string (UUID format)",
    "title": "Java Fundamentals - Lecture 1",
    "startTime": "2023-11-15T09:00:00Z",
    "endTime": "2023-11-15T11:00:00Z",
    "venue": {
      "id": "string (Venue UUID)",
      "name": "Main Lecture Hall"
    },
    "group": {
      "id": "string (Group UUID)",
      "name": "Java IPT - Fall 2023"
    }
  },
  {
    "id": "string (UUID format)",
    "title": "Data Visualization with Python",
    "startTime": "2023-11-16T14:00:00Z",
    "endTime": "2023-11-16T17:00:00Z",
    "venue": {
      "id": "string (Venue UUID)",
      "name": "Computer Lab 3"
    },
    "group": {
      "id": "string (Group UUID)",
      "name": "Data Science Workshop"
    }
  }
]
```
---

### **4.3 Get a Single Event and its Attendance Status**

Retrieves the full details of one specific event, including a list of all attendees from its assigned group and their attendance status for this event (`PRESENT`, `ABSENT`, or `PENDING`).

*   **Endpoint:** `GET /api/v1/events/{eventId}`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To view the detailed status of a single event and its attendees.

#### **URL Parameters:**
*   `eventId` (string, UUID format): The unique identifier of the event.

#### **Success Response (`200 OK`):**

```json
{
  "id": "string (UUID format)",
  "title": "Java Fundamentals - Lecture 1",
  "description": "Introduction to Java syntax and the JVM.",
  "startTime": "2023-11-15T09:00:00Z",
  "endTime": "2023-11-15T11:00:00Z",
  "venue": {
    "id": "string (Venue UUID)",
    "name": "Main Lecture Hall"
  },
  "group": {
    "id": "string (Group UUID)",
    "name": "Java IPT - Fall 2023"
  },
  "attendees": [
    {
      "id": "string (User UUID)",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "status": "PRESENT",
      "markedAt": "2023-11-15T09:05:12Z"
    },
    {
      "id": "string (User UUID)",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "status": "ABSENT",
      "markedAt": null
    },
    {
      "id": "string (User UUID)",
      "firstName": "Peter",
      "lastName": "Jones",
      "email": "peter.jones@example.com",
      "status": "PENDING",
      "markedAt": null
    }
  ]
}
```

#### **Error Responses:**
*   `404 Not Found`: If no event exists with the provided `eventId`.

---

### **4.4 Get Events for the Current Attendee**

This is the primary endpoint for the `ATTENDEE` role. It retrieves a list of all events they are scheduled to attend.

*   **Endpoint:** `GET /api/v1/attendee/events`
*   **Access:** Authenticated, `ATTENDEE` only
*   **Purpose:** For an attendee to view their personal event schedule.

#### **Success Response (`200 OK`):**

Returns an array of event objects relevant to the logged-in attendee.

```json
[
  {
    "id": "string (UUID format)",
    "title": "Java Fundamentals - Lecture 1",
    "startTime": "2023-11-15T09:00:00Z",
    "endTime": "2023-11-15T11:00:00Z",
    "venue": {
      "name": "Main Lecture Hall"
    },
    "myAttendanceStatus": "PENDING"
  }
]
```

---

### **4.5 Update an Event**

Updates the details of a scheduled event.

*   **Endpoint:** `PUT /api/v1/events/{eventId}`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To modify an existing event.

#### **URL Parameters:**
*   `eventId` (string, UUID format): The ID of the event to update.

#### **Request Body:**
The full event object is required.
```json
{
  "title": "Java Fundamentals - REVISED",
  "description": "Introduction to Java syntax and the JVM.",
  "venueId": "string (UUID of an existing venue)",
  "groupId": "string (UUID of an existing group)",
  "startTime": "2023-11-15T09:05:00Z",
  "endTime": "2023-11-15T11:05:00Z"
}
```

#### **Success Response (`200 OK`):**
Returns the newly updated event object, similar to the `POST` response.

#### **Error Responses:**
*   `404 Not Found`: If the event, venue, or group ID is not found.

---

### **4.6 Cancel (Delete) an Event**

Permanently removes a scheduled event from the system.

*   **Endpoint:** `DELETE /api/v1/events/{eventId}`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To cancel a scheduled event.

#### **URL Parameters:**
*   `eventId` (string, UUID format): The ID of the event to delete.

#### **Success Response (`204 No Content`):**
An empty response indicating successful deletion.

---



Here we go. This is the core logic of the entire application. These are the endpoints that will make your project stand out.

We will define the sequence of API calls that allow an administrator to initiate the attendance process and for an attendee to securely submit their presence.

Here is the final module for our `api-contract.md` file.

---

## **Module 5: Attendance Management (`/events/{eventId}/attendance`)**

This module contains the endpoints for the live attendance-marking process. These actions are nested under a specific event.

### **5.1 Start the Attendance Window for an Event**

An `ADMINISTRATOR` triggers this endpoint to begin the attendance-taking process for a specific, ongoing event. The backend generates a short-lived, unique code and an associated token.

*   **Endpoint:** `POST /api/v1/events/{eventId}/attendance/start`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To open the attendance window and generate a verification code.

#### **URL Parameters:**
*   `eventId` (string, UUID format): The unique identifier of the event for which to start attendance.

#### **Request Body:**
(None)

#### **Success Response (`200 OK`):**

Returns the generated code for the administrator to display, along with its expiry time. The frontend can use `expiresAt` to show a countdown timer.

```json
{
  "attendanceCode": "string (e.g., 'A91-X34')",
  "expiresAt": "string (ISO 8601 format, e.g., '2023-11-15T09:06:30Z')"
}
```

#### **Error Responses:**
*   `401 Unauthorized`/`403 Forbidden`: For authentication/authorization failures.
*   `404 Not Found`: If no event exists with the provided `eventId`.
*   `400 Bad Request`: If the event is not currently active (i.e., the current time is outside the event's `startTime` and `endTime`).
*   `409 Conflict`: If an attendance window is already active for this event.

---

### **5.2 Mark Attendance (Attendee Action)**

This is the endpoint that an `ATTENDEE` uses to submit the code and their location for verification. The backend performs all necessary checks: code validity, time window, and geolocation.

*   **Endpoint:** `POST /api/v1/events/{eventId}/attendance/mark`
*   **Access:** Authenticated, `ATTENDEE` only
*   **Purpose:** For an attendee to submit their presence for verification.

#### **URL Parameters:**
*   `eventId` (string, UUID format): The unique identifier of the event they are marking attendance for.

#### **Request Body:**

```json
{
  "attendanceCode": "string (required, the code displayed by the administrator)",
  "latitude": "number (required, the attendee's current latitude)",
  "longitude": "number (required, the attendee's current longitude)"
}
```

#### **Success Response (`200 OK`):**

Returns a simple confirmation message.

```json
{
  "message": "Attendance marked successfully."
}
```

#### **Error Responses:**
*   `400 Bad Request`: For a variety of business logic failures. The `message` field will specify the reason:
    *   "Invalid attendance code."
    *   "Attendance window has expired."
    *   "You are outside the allowed radius for this venue."
    *   "Attendance has already been marked for this event."
*   `401 Unauthorized`/`403 Forbidden`: For authentication/authorization failures.
*   `404 Not Found`: If no event exists with the provided `eventId`.

---

### **5.3 Manual Attendance Override (Administrator Fallback)**

Allows an `ADMINISTRATOR` to manually mark a specific attendee as `PRESENT`. This is the fallback mechanism for users who face technical issues.

*   **Endpoint:** `POST /api/v1/events/{eventId}/attendance/manual-override`
*   **Access:** Authenticated, `ADMINISTRATOR` only
*   **Purpose:** To manually mark an attendee as present for a specific event.

#### **URL Parameters:**
*   `eventId` (string, UUID format): The unique identifier of the event.

#### **Request Body:**

```json
{
  "userId": "string (required, UUID of the attendee to mark as present)"
}
```

#### **Success Response (`200 OK`):**

Returns a confirmation message.

```json
{
  "message": "Attendee successfully marked as PRESENT."
}
```

#### **Error Responses:**
*   `401 Unauthorized`/`403 Forbidden`: For authentication/authorization failures.
*   `404 Not Found`: If the specified `eventId` or `userId` does not exist.
*   `400 Bad Request`: If the specified user is not a member of the group assigned to this event.

---

This concludes the complete **API Contract**.

