---

## **Backend Architecture & Handover Report**

**Project:** Digital Attendance System
**Version:** 1.0 (Backend - Milestone 2 Complete)
**Date:** Tuesday, August 26, 2025

### **1. High-Level Overview**

This document details the architecture and implementation of the Digital Attendance System's backend. The system is a modern, stateless REST API built with **Spring Boot 3**, using **Spring Security** for authentication/authorization and **Spring Data JPA (Hibernate)** for database persistence with a **MySQL** database.

The core purpose of this backend is to provide a secure, reliable, and efficient engine for scheduling events and verifying attendee presence in real-time using a combination of time-sensitive codes and geolocation data.

The project is structured in a modular, feature-driven way, with clear separation of concerns. All communication with clients is done via JSON.

### **2. Core Concepts & Design Principles**

The architecture is built on several key principles:

*   **Stateless Authentication:** The API is stateless. After a user logs in, they receive a **JSON Web Token (JWT)**. Every subsequent request to a protected endpoint must include this JWT in the `Authorization: Bearer <token>` header. The server does not maintain user sessions.
*   **Service Layer Abstraction:** Business logic is encapsulated within **Service** classes (e.g., `VenueService`, `AuthService`). Controllers are kept "thin" and are primarily responsible for handling HTTP requests/responses and calling the appropriate service methods.
*   **Data Transfer Objects (DTOs):** To avoid exposing internal database entities directly and to tailor the data for specific API endpoints, we extensively use DTOs for both requests and responses. This is a crucial security and design pattern.
*   **Repository Pattern:** Spring Data JPA repositories are used for all database interactions, abstracting away the need for boilerplate SQL.
*   **Centralized Exception Handling:** A `GlobalExceptionHandler` intercepts runtime exceptions and formats them into a consistent JSON error response, as defined in the API contract.
*   **Declarative, Role-Based Security:** API endpoints are secured using `@PreAuthorize("hasAuthority('ROLE')")` annotations, providing a clean and readable way to enforce authorization rules.

### **3. Implemented Modules (As of 2025-08-26)**

The backend implementation is complete up to the end of Milestone 2. The core engine is fully functional and has been tested via an HTTP client.

#### **3.1 Security & Authentication (`security`, `auth` packages)**

*   **Components:** `JwtService`, `JwtAuthenticationFilter`, `SecurityConfig`, `ApplicationConfig`, `AuthController`, `AuthService`.
*   **Functionality:**
    *   **`POST /api/v1/auth/register`**: Creates a new `ATTENDEE` or `ADMINISTRATOR` user. Passwords are securely hashed using BCrypt.
    *   **`POST /api/v1/auth/login`**: Authenticates a user with email and password, returning a signed JWT valid for 24 hours.
*   **Key Notes:** The `JwtAuthenticationFilter` runs on every request, validating the JWT and setting the user's security context if the token is valid. `SecurityConfig` defines the public vs. protected routes.

#### **3.2 User Management (`user` package)**

*   **Components:** `User` (Entity), `UserRepository`, `UserRole` (Enum), `UserDto`.
*   **Functionality:** Defines the core user data model. The `User` entity notably implements Spring Security's `UserDetails` interface, which is critical for integrating our custom user model with the security framework.

#### **3.3 Venue Management (`venue` package)**

*   **Components:** `Venue` (Entity), `VenueRepository`, `VenueDto`, `VenueService`, `VenueController`.
*   **Functionality:** Provides a full, secure CRUD API for managing physical locations.
    *   `POST /api/v1/venues`: Create a new venue.
    *   `GET /api/v1/venues`: Get a list of all venues.
    *   `GET /api/v1/venues/{id}`: Get a single venue by its ID.
    *   `PUT /api/v1/venues/{id}`: Update a venue.
    *   `DELETE /api/v1/venues/{id}`: Delete a venue.
*   **Security:** All endpoints are restricted to `ADMINISTRATOR` roles via `@PreAuthorize`.

#### **3.4 Group Management (`group` package)**

*   **Components:** `Group` & `GroupMember` (Entities), `GroupRepository` & `GroupMemberRepository`, multiple DTOs, `GroupService`, `GroupController`.
*   **Functionality:** Provides a full, secure CRUD API for managing user groups and their memberships.
    *   `POST /api/v1/groups`: Create a new group.
    *   `GET /api/v1/groups`: Get a list of all groups.
    *   `GET /api/v1/groups/{id}`: Get group details, including a list of its members.
    *   `POST /api/v1/groups/{id}/members`: Add a user to a group.
    *   `DELETE /api/v1/groups/{id}/members/{userId}`: Remove a user from a group.
    *   `DELETE /api/v1/groups/{id}`: Delete a group.
*   **Security:** All endpoints are restricted to `ADMINISTRATOR` roles via `@PreAuthorize`.

#### **3.5 Event & Attendance Management (`event` package)**

*   **Components:** `Event` & `AttendanceRecord` (Entities), `EventRepository` & `AttendanceRecordRepository`, multiple DTOs, `EventService`, `EventController`, `AttendanceCodeManager`.
*   **Functionality:** The core engine of the application.
    *   `POST /api/v1/events`: Schedules a new event, linking a Venue and a Group.
    *   `GET /api/v1/events/{id}`: Gets detailed status of an event, including the `PENDING`/`PRESENT`/`ABSENT` status of every member.
    *   `POST /api/v1/events/{id}/attendance/start`: (Admin only) Initiates the live attendance window, generating a short-lived (90-second) code.
    *   `POST /api/v1/events/{id}/attendance/mark`: (Attendee only) Allows a user to submit the code and their device's geolocation for verification. The service validates the code, its expiry, and the user's distance from the venue.
*   **Key Notes:** The `AttendanceCodeManager` uses a simple in-memory `ConcurrentHashMap` to store active codes. For a multi-server production environment, this should be replaced with a distributed cache like Redis.

---

### **4. Unimplemented & Temporary Components**

During development and testing, two components were created as placeholders or temporary solutions. They need to be finalized.

#### **4.1 The `/attendee/events` Endpoint**

- **Location:** `EventController.java`
- **Current State:** The method `getMyEvents` currently exists but returns a hardcoded empty list: `return ResponseEntity.ok(List.of());`.
- **Requirement:** This endpoint must return a list of all events that the currently authenticated `ATTENDEE` is a part of.

#### **4.2 The Temporary `UserController`**

- **Location:** `test/UserController.java`
- **Current State:** A controller was created in a `test` package with a `GET /api/v1/users` endpoint. This was necessary for the test script to retrieve a user's UUID.
- **Requirement:** A permanent, secure `GET /api/v1/users` endpoint is a useful utility for the frontend (e.g., for the "Add Member to Group" dialog). The temporary controller should be made permanent and secure.

### **5. Step-by-Step Guide for Final Backend Tasks**

The following steps should be taken to complete the backend.

#### **Task 1: Finalize the `UserController`**

1.  **Move the Controller:** The `UserController` is conceptually a part of user management, not a test utility.

    - Move `UserController.java` from the `com.dabackend.digitalattendance.test` package to the `com.dabackend.digitalattendance.user` package. IntelliJ's refactor tool will handle this smoothly.

2.  **Secure the Controller:** This endpoint should only be accessible by administrators.

    - Open the newly moved `UserController.java` file.
    - Add the `@PreAuthorize("hasAuthority('ADMINISTRATOR')")` annotation to the class.

3.  **(Optional but Recommended) Add Filtering:** A future improvement would be to allow filtering, for example, `GET /api/v1/users?role=ATTENDEE`.

**Final Code for `user/UserController.java`:**

```java
package com.dabackend.digitalattendance.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize; // Import this
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMINISTRATOR')") // Secure the endpoint
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
```

#### **Task 2: Implement the `/attendee/events` Logic**

1.  **Create a Custom Query in `EventRepository`:** To efficiently find all events for a specific user, we need a custom JPQL query.

    - Open `event/EventRepository.java`.
    - Add the following method to the interface:

    ```java
    package com.dabackend.digitalattendance.event;

    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query; // Import this
    import org.springframework.stereotype.Repository;
    import java.util.List; // Import this
    import java.util.UUID;

    @Repository
    public interface EventRepository extends JpaRepository<Event, UUID> {
        // This query finds all events where the group associated with the event
        // has a member with the given userId.
        @Query("SELECT e FROM Event e JOIN e.group g JOIN g.members m WHERE m.user.id = :userId ORDER BY e.startTime DESC")
        List<Event> findEventsByUserId(UUID userId);
    }
    ```

2.  **Create a New Method in `EventService`:** The business logic belongs in the service.

    - Open `event/EventService.java`.
    - Add the following new method:

    ```java
    // Add this method inside EventService.java
    @Transactional(readOnly = true)
    public List<EventResponseDto> getEventsForUser(Principal principal) {
        String userEmail = principal.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return eventRepository.findEventsByUserId(user.getId()).stream()
                .map(this::mapToEventResponseDto)
                .collect(Collectors.toList());
    }
    ```

3.  **Update the `EventController`:** Wire the controller endpoint to the new service method.

    - Open `event/EventController.java`.
    - Find the `getMyEvents` method and replace its body with a call to the service.

    ```java
    // In EventController.java, update this method
    @GetMapping("/attendee/events")
    @PreAuthorize("hasAuthority('ATTENDEE')")
    public ResponseEntity<List<EventResponseDto>> getMyEvents(Principal principal) {
        // Now calls the proper service method instead of returning an empty list
        return ResponseEntity.ok(eventService.getEventsForUser(principal));
    }
    ```

With these changes, the backend will be 100% complete as per the API contract and ready for full integration with the frontend.
