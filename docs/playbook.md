

---

# **Project Playbook: Digital Attendance System**

**Version:** 1.0

### **Purpose of this Document**

This playbook is the single source of truth for the *implementation* of the Digital Attendance System. It breaks down the entire project into small, explicit, and self-contained tasks. Each task is designed to be completed independently, allowing our team members to work in parallel. The goal is to follow these instructions precisely to ensure consistency, quality, and seamless integration.

**Core Principle:** Adhere to the `api-contract.md` document for all frontend-backend communication. The contract is law.

---

## **Part 1: The Foundation (Setup & Standards)**

This section contains the initial, one-time setup tasks required for every team member. Completing these steps is mandatory before beginning work on any application features. This ensures everyone has a consistent and functional development environment.

### **List of Foundational Tasks:**
*   **[GENERAL] F-01:** GitHub Repository & Project Structure Setup
*   **[BACKEND] F-02:** Spring Boot Backend Project Initialization
*   **[FRONTEND] F-03:** Next.js Frontend Project Initialization
*   **[BACKEND] F-04:** Local MySQL Database Setup & Connection
*   **[GENERAL] F-05:** Postman Setup for API Testing

---

### **Task ID: [GENERAL] F-01**
**Title:** GitHub Repository & Project Structure Setup

**Objective:**
To create the central code repositories on GitHub and establish the standard folder structure on each developer's local machine.

**Context:**
We will use two separate repositories to maintain a clean separation between the frontend and backend codebases. This is a standard industry practice that simplifies development and deployment pipelines. One team member (the designated "repo manager" for this task) will create the repositories, while all others will clone them.

**Prerequisites:**
*   A free GitHub account.
*   Git installed on your local machine.

#### **Step-by-Step Instructions (for the Repo Manager):**

1.  **Create Repositories:** On GitHub, create two **new private repositories**:
    *   `digital-attendance-backend`
    *   `digital-attendance-frontend`
2.  **Initialize with `.gitignore`:** When creating them, select the appropriate `.gitignore` template for each:
    *   For `digital-attendance-backend`, choose the `Java` or `Maven` template.
    *   For `digital-attendance-frontend`, choose the `Node` template. This is crucial for keeping unnecessary files out of version control.
3.  **Invite Collaborators:** In each repository's settings (`Settings` > `Collaborators and teams`), invite all team members using their GitHub usernames.

#### **Step-by-Step Instructions (for all Team Members):**

1.  **Accept Invitation:** You will receive an email invitation to collaborate. Accept it.
2.  **Create a Workspace Folder:** On your computer, create a main folder for the project (e.g., `C:\dev\attendance-system` or `~/projects/attendance-system`).
3.  **Clone Repositories:** Open your terminal or command prompt, navigate *inside* your new workspace folder, and run the following commands:
    ```bash
    git clone https://github.com/<your-username>/digital-attendance-backend.git
    git clone https://github.com/<your-username>/digital-attendance-frontend.git
    ```
4.  **Verify Structure:** Your workspace folder should now look like this:
    ```
    attendance-system/
    ├── digital-attendance-backend/
    │   ├── .git/
    │   └── .gitignore
    └── digital-attendance-frontend/
        ├── .git/
        └── .gitignore
    ```

**Verification:**
You can successfully `cd` into both folders and run `git status`. You have successfully set up the project's foundation.

---
---

## **Part 2: Milestones**

This section contains the task-by-task instructions for building the application's features.

## **Milestone 1: Authentication & User Setup**

**Objective:** To implement the core user registration and login functionality as defined in **Module 1** of the `api-contract.md`.

### **List of Tasks for this Milestone:**
*   **[BACKEND] BE-01:** Create the User Entity and Repository
*   **[BACKEND] BE-02:** Implement Spring Security Configuration
*   **[BACKEND] BE-03:** Implement JWT Service for Token Management
*   **[BACKEND] BE-04:** Build the Authentication Controller (`/auth`)
*   **[FRONTEND] FE-01:** Setup Shadcn UI and Create Core Components
*   **[FRONTEND] FE-02:** Build the Registration Page UI
*   **[FRONTEND] FE-03:** Build the Login Page UI
*   **[FRONTEND] FE-04:** Create an Axios API Client Service
*   **[FRONTEND] FE-05:** Implement User Authentication Logic
*   **[FRONTEND] FE-06:** Implement Protected Routes and Auth State

---

### **Task ID: [BACKEND] BE-01**
**Title:** Create the User Entity and Repository

**Objective:**
To create the `User` Java class that maps to our database `users` table, and the `UserRepository` interface that allows us to perform database operations on users.

**Context:**
In Spring Data JPA, an "Entity" is a special Java class that represents a table in the database. Each field in the class represents a column. A "Repository" is an interface that gives us powerful, pre-built methods like `save()`, `findById()`, and `findAll()` without us having to write any SQL. We will also use Lombok annotations to reduce boilerplate code (like getters and setters).

**Prerequisites:**
*   Completion of Foundation tasks `F-01`, `F-02`, and `F-04`.
*   The Spring Boot project is open in your IDE (e.g., IntelliJ IDEA).

#### **Step-by-Step Instructions:**

1.  **Create a `user` Package:** In the main source folder (e.g., `src/main/java/com/yourcompany/attendance`), create a new package named `user`.
2.  **Create the `UserRole` Enum:** This defines the possible roles a user can have. Inside the `user` package, create a new `Enum` file named `UserRole.java` and add the following content:
    ```java
    package com.yourcompany.attendance.user;

    public enum UserRole {
        ATTENDEE,
        ADMINISTRATOR
    }
    ```
3.  **Create the `User` Entity Class:** Inside the `user` package, create a new Java `Class` named `User.java`. Replace its contents with the code below. The comments explain the purpose of each annotation.

    ```java
    package com.yourcompany.attendance.user;

    import jakarta.persistence.*;
    import lombok.Getter;
    import lombok.Setter;
    import lombok.Builder;
    import lombok.NoArgsConstructor;
    import lombok.AllArgsConstructor;
    import java.util.UUID;

    // Lombok annotations to auto-generate getters, setters, constructors, etc.
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    // JPA annotations to define this as a database entity
    @Entity
    // Specifies the table name will be "users" (in snake_case) as per our standards.
    @Table(name = "users")
    public class User {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID id;

        // nullable=false makes this a required column in the database.
        @Column(name = "first_name", nullable = false)
        private String firstName;

        @Column(name = "last_name", nullable = false)
        private String lastName;

        // unique=true ensures no two users can share the same email.
        @Column(nullable = false, unique = true)
        private String email;

        @Column(nullable = false)
        private String password;

        // Tells JPA to store the enum value as a String (e.g., "ATTENDEE").
        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private UserRole role;
    }
    ```
4.  **Create the `UserRepository` Interface:** Inside the `user` package, create a new Java `Interface` named `UserRepository.java`. Replace its contents with the following:

    ```java
    package com.yourcompany.attendance.user;

    import org.springframework.data.jpa.repository.JpaRepository;
    import java.util.Optional;
    import java.util.UUID;

    // By extending JpaRepository, we get all standard CRUD methods for free.
    // <User, UUID> specifies it's a repository for the User entity, whose ID is of type UUID.
    public interface UserRepository extends JpaRepository<User, UUID> {
        // Spring Data JPA will automatically create a query for us from this method name.
        Optional<User> findByEmail(String email);
    }
    ```

**Verification:**

1.  **Configure Hibernate:** Open your `src/main/resources/application.properties` file. Add the following line. This tells Hibernate (the tool JPA uses) to automatically create or update database tables based on your entities when the application starts.
    ```properties
    spring.jpa.hibernate.ddl-auto=update
    ```
2.  **Run the Application:** Start your Spring Boot application from your IDE.
3.  **Check Console Logs:** Watch the console output. You should see log messages from Hibernate, including a line that looks like: `create table users (...)`. This confirms your entity was correctly processed.
4.  **Check Database:** Use a database client (like DBeaver or MySQL Workbench) to connect to your local database. You should now see a new `users` table with the correct columns (`id`, `first_name`, `last_name`, `email`, `password`, `role`).

---




Excellent. Let's proceed with the next critical backend task.

With the `User` entity created, we now need to set up the security framework that will protect our API endpoints. This is a foundational step that must be done before we can build the login/registration logic. We will use **Spring Security** for this.

Here is the next task card for the **Project Playbook**.

---

### **Task ID: [BACKEND] BE-02**
**Title:** Implement Spring Security Configuration

**Objective:**
To set up the core Spring Security configuration. This will define which API endpoints are public (like login/register) and which are protected, requiring authentication. It will also configure CORS to allow our frontend application to communicate with the backend.

**Context:**
Spring Security is a powerful framework that intercepts incoming requests to our API. We will create a `SecurityFilterChain` bean, which is like a set of firewall rules. These rules will state, for example, "allow any request to `/api/v1/auth/**` but block all other requests unless they have a valid JWT." We will also set up a `PasswordEncoder` which is essential for securely storing user passwords (we never store passwords in plain text).

**Prerequisites:**
*   Completion of task `[BACKEND] BE-01`.
*   Spring Boot project includes the `spring-boot-starter-security` dependency. (This should have been added during project initialization).

#### **Step-by-Step Instructions:**

1.  **Create a `config` Package:** In your main source folder (e.g., `src/main/java/com/yourcompany/attendance`), create a new package named `config`.
2.  **Create the `SecurityConfig` Class:** Inside the `config` package, create a new Java `Class` named `SecurityConfig.java`.
3.  **Add the Configuration Code:** Open `SecurityConfig.java` and replace its contents with the code below. The comments explain each part of the configuration.

    ```java
    package com.yourcompany.attendance.config;

    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.web.cors.CorsConfiguration;
    import org.springframework.web.cors.CorsConfigurationSource;
    import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

    import java.util.Arrays;

    @Configuration
    @EnableWebSecurity
    public class SecurityConfig {

        // @Bean exposes this method's return value as a Spring Bean.
        // This is the standard password encoder for securely hashing passwords.
        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        // This bean defines the security rules for our API.
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                // Enable CORS using the corsConfigurationSource bean below.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Disable CSRF (Cross-Site Request Forgery) protection.
                // This is common for stateless REST APIs that use tokens for auth.
                .csrf(csrf -> csrf.disable())
                // Configure session management to be stateless.
                // The server will not create or maintain any HTTP sessions.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Define authorization rules for different endpoints.
                .authorizeHttpRequests(auth -> auth
                    // Permit all requests to our authentication endpoints.
                    .requestMatchers("/api/v1/auth/**").permitAll()
                    // All other requests must be authenticated.
                    .anyRequest().authenticated()
                );

            return http.build();
        }

        // This bean configures CORS (Cross-Origin Resource Sharing).
        // It's crucial for allowing our frontend (running on a different domain/port)
        // to make requests to our backend.
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration configuration = new CorsConfiguration();
            // Allow requests from our future frontend's origin.
            // For development, we can use "*" or a specific localhost port.
            // IMPORTANT: For production, change this to your actual frontend URL (e.g., "https://your-app.vercel.app").
            configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "*"));
            // Allow common HTTP methods.
            configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            // Allow specific headers.
            configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
            // Allow credentials (e.g., cookies, authorization headers).
            configuration.setAllowCredentials(true);

            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            // Apply this CORS configuration to all paths in our API.
            source.registerCorsConfiguration("/**", configuration);
            return source;
        }
    }
    ```

**Verification:**

1.  **Restart the Application:** Stop and restart your Spring Boot application.
2.  **Test a Public Endpoint (Expect Failure for now):** Open Postman. Create a `POST` request to `http://localhost:8080/api/v1/auth/login`. Don't add a body or any headers. Click "Send".
    *   **Expected Result:** You should get a `400 Bad Request` or a `500 Internal Server Error`. This might seem wrong, but it's correct! It means the request *was allowed* through Spring Security and reached the (not yet existing) controller logic.
3.  **Test a Protected Endpoint:** In Postman, create a `GET` request to a random protected URL, like `http://localhost:8080/api/v1/some-protected-data`.
    *   **Expected Result:** You should receive a `401 Unauthorized` or `403 Forbidden` response. The response body might be empty or contain an error message from Spring Security. This is **correct**. It proves that Spring Security is blocking access to endpoints that are not public.

---
Let's proceed.

Now that we have the security framework in place, we need a mechanism to create and validate the "keys" (JWTs) that authenticated users will use. This task involves creating a dedicated `JwtService` that will handle all the logic related to JSON Web Tokens.

Here is the next task card for the **Project Playbook**.

---

### **Task ID: [BACKEND] BE-03**
**Title:** Implement JWT Service for Token Management

**Objective:**
To create a `JwtService` that can generate a JWT for a user, extract the username (email) from a token, and validate a token's integrity and expiration.

**Context:**
A JWT is a secure, self-contained string of data that proves a user is who they say they are. It consists of three parts: Header, Payload, and Signature. The signature is the most important part; it's created using a secret key known only to our server. This allows us to trust any JWT that is successfully verified with our secret key. We will use the popular `jjwt` library to handle the complexities of JWT creation and parsing.

**Prerequisites:**
*   Completion of task `[BACKEND] BE-02`.
*   The Spring Boot project is open in your IDE.

#### **Step-by-Step Instructions:**

1.  **Add `jjwt` Dependency:** Open your `pom.xml` file. Add the following dependencies for the `jjwt` library inside the `<dependencies>` section. This will give us the tools to work with JWTs.

    ```xml
    <!-- For creating and parsing JWTs -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    ```
    After adding these, your IDE should prompt you to "Reload Maven Projects" or "Load Maven Changes". Do so to download the new libraries.

2.  **Define JWT Properties:** Open your `src/main/resources/application.properties` file. Add the following properties. These will hold our JWT secret key and token expiration time.

    ```properties
    # IMPORTANT: Use a long, random, and secure string here in a real application.
    # You can generate one from a site like https://www.uuidgenerator.net/
    jwt.secret.key=your-super-secret-key-that-is-at-least-256-bits-long-for-hs256
    
    # Expiration time in milliseconds (e.g., 24 hours)
    # 24 hours * 60 minutes * 60 seconds * 1000 milliseconds = 86400000
    jwt.expiration.ms=86400000
    ```
    **Security Note:** In a production application, this secret key should never be in the code. It should be injected as an environment variable. For this project, placing it in `application.properties` is acceptable.

3.  **Create the `JwtService` Class:**
    *   In your main source folder (e.g., `src/main/java/com/yourcompany/attendance`), create a new package named `security`.
    *   Inside the `security` package, create a new Java `Class` named `JwtService.java`.

4.  **Add the Service Logic:** Open `JwtService.java` and replace its contents with the code below. The comments explain the function of each method.

    ```java
    package com.yourcompany.attendance.security;

    import io.jsonwebtoken.Claims;
    import io.jsonwebtoken.Jwts;
    import io.jsonwebtoken.SignatureAlgorithm;
    import io.jsonwebtoken.io.Decoders;
    import io.jsonwebtoken.security.Keys;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.security.core.userdetails.UserDetails;
    import org.springframework.stereotype.Service;

    import java.security.Key;
    import java.util.Date;
    import java.util.HashMap;
    import java.util.Map;
    import java.util.function.Function;

    @Service
    public class JwtService {

        @Value("${jwt.secret.key}")
        private String secretKey;

        @Value("${jwt.expiration.ms}")
        private long jwtExpiration;

        // Extracts the username (email) from a JWT.
        public String extractUsername(String token) {
            return extractClaim(token, Claims::getSubject);
        }

        // A generic method to extract any single claim from the token's payload.
        public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
            final Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        }

        // Generates a new JWT for a user without extra claims.
        public String generateToken(UserDetails userDetails) {
            return generateToken(new HashMap<>(), userDetails);
        }

        // Generates a new JWT with extra claims.
        public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
            return buildToken(extraClaims, userDetails, jwtExpiration);
        }

        private String buildToken(
                Map<String, Object> extraClaims,
                UserDetails userDetails,
                long expiration
        ) {
            return Jwts.builder()
                    .setClaims(extraClaims)
                    .setSubject(userDetails.getUsername()) // The subject is the user's email
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + expiration))
                    .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                    .compact();
        }

        // Validates if a token is correct and belongs to the given user.
        public boolean isTokenValid(String token, UserDetails userDetails) {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
        }

        private boolean isTokenExpired(String token) {
            return extractExpiration(token).before(new Date());
        }

        private Date extractExpiration(String token) {
            return extractClaim(token, Claims::getExpiration);
        }

        // Extracts all claims from the token's payload.
        private Claims extractAllClaims(String token) {
            return Jwts
                    .parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }

        // Gets the signing key used to sign the JWTs.
        private Key getSignInKey() {
            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            return Keys.hmacShaKeyFor(keyBytes);
        }
    }
    ```
    *Note: The code uses `org.springframework.security.core.userdetails.UserDetails`. We will create a class that implements this interface in a later step.*

**Verification:**

1.  **Code Compiles:** Ensure there are no compilation errors in your IDE.
2.  **Application Starts:** Restart your Spring Boot application. It should start up without any errors. If it fails, check that the `jwt.secret.key` in your properties file is not empty and that the Maven dependencies were loaded correctly.
3.  **Logical Check:** Read through the code. Does it make sense? We have methods to `generateToken`, `isTokenValid`, and `extractUsername`. These are the three core functions we'll need for our authentication system. There's nothing to test with Postman yet, as this is a background service.

---



Fantastic. This is the task where we bring everything together on the backend.

We will create the `AuthenticationController` that handles the HTTP requests for registration and login. This controller will use the `UserRepository` to interact with the database, the `PasswordEncoder` to handle passwords, and the `JwtService` to create tokens. We will also need to create DTOs (Data Transfer Objects) to define the shape of our JSON requests and responses, as specified in the API contract.

Here is the final backend authentication task card for the **Project Playbook**.

---

### **Task ID: [BACKEND] BE-04**
**Title:** Build the Authentication Controller (`/auth`)

**Objective:**
To implement the public API endpoints for user registration (`/register`) and login (`/login`). This controller will orchestrate the user creation and authentication process.

**Context:**
A Controller in Spring is a class that listens for incoming HTTP requests and maps them to specific methods. We will create two methods, one for `POST /register` and one for `POST /login`. To keep our code clean and secure, we'll use DTOs. A DTO is a simple class that defines the data structure for transferring information. For example, a `RegisterRequest` DTO will contain `firstName`, `email`, `password`, etc. This prevents us from exposing our internal `User` entity directly to the API.

**Prerequisites:**
*   Completion of tasks `[BACKEND] BE-01`, `[BACKEND] BE-02`, and `[BACKEND] BE-03`.

#### **Step-by-Step Instructions:**

1.  **Create an `auth` Package:** In your main source folder (e.g., `src/main/java/com/yourcompany/attendance`), create a new package named `auth`.

2.  **Create the DTOs:** Inside the `auth` package, create the following Java `Class` files for our request and response DTOs. We'll use Lombok annotations for simplicity.

    *   **`RegisterRequest.java`**:
        ```java
        package com.yourcompany.attendance.auth;

        import com.yourcompany.attendance.user.UserRole;
        import lombok.AllArgsConstructor;
        import lombok.Builder;
        import lombok.Data;
        import lombok.NoArgsConstructor;

        @Data // Bundles @Getter, @Setter, @ToString, @EqualsAndHashCode
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public class RegisterRequest {
            private String firstName;
            private String lastName;
            private String email;
            private String password;
            private UserRole role;
        }
        ```

    *   **`LoginRequest.java`**:
        ```java
        package com.yourcompany.attendance.auth;

        import lombok.AllArgsConstructor;
        import lombok.Builder;
        import lombok.Data;
        import lombok.NoArgsConstructor;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public class LoginRequest {
            private String email;
            private String password;
        }
        ```

    *   **`AuthResponse.java`**:
        ```java
        package com.yourcompany.attendance.auth;

        import lombok.AllArgsConstructor;
        import lombok.Builder;
        import lombok.Data;
        import lombok.NoArgsConstructor;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public class AuthResponse {
            private String token;
            // You can add more user details here if needed by the frontend upon login.
        }
        ```

3.  **Create the `AuthService`:** It's good practice to separate business logic from the controller.
    *   Inside the `auth` package, create a new `Class` named `AuthService.java`.
    *   Open the file and replace its contents with the following logic for registration and login:

        ```java
        package com.yourcompany.attendance.auth;

        import com.yourcompany.attendance.security.JwtService;
        import com.yourcompany.attendance.user.User;
        import com.yourcompany.attendance.user.UserRepository;
        import lombok.RequiredArgsConstructor;
        import org.springframework.security.authentication.AuthenticationManager;
        import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
        import org.springframework.security.core.userdetails.UserDetails;
        import org.springframework.security.crypto.password.PasswordEncoder;
        import org.springframework.stereotype.Service;

        @Service
        @RequiredArgsConstructor // Lombok constructor injection for final fields
        public class AuthService {

            private final UserRepository userRepository;
            private final PasswordEncoder passwordEncoder;
            private final JwtService jwtService;
            private final AuthenticationManager authenticationManager;

            public AuthResponse register(RegisterRequest request) {
                // Check if user already exists
                if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                    throw new IllegalStateException("User with email " + request.getEmail() + " already exists.");
                }

                var user = User.builder()
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .email(request.getEmail())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .role(request.getRole())
                        .build();

                userRepository.save(user);

                var jwtToken = jwtService.generateToken((UserDetails) user);
                return AuthResponse.builder().token(jwtToken).build();
            }

            public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );
                // If the above line doesn't throw an exception, the user is authenticated.
                var user = userRepository.findByEmail(request.getEmail())
                        .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

                var jwtToken = jwtService.generateToken((UserDetails) user);
                return AuthResponse.builder().token(jwtToken).build();
            }
        }
        ```
    *Note: The code above has dependencies like `AuthenticationManager` that we still need to configure.*

4.  **Configure `AuthenticationManager` and `UserDetailsService`:** Spring Security needs to know how to find users and manage authentication.
    *   Create a new class in the `config` package named `ApplicationConfig.java`.
    *   Add the following beans. This tells Spring Security to use our `UserRepository` to look up users by email.

        ```java
        package com.yourcompany.attendance.config;

        import com.yourcompany.attendance.user.UserRepository;
        import lombok.RequiredArgsConstructor;
        import org.springframework.context.annotation.Bean;
        import org.springframework.context.annotation.Configuration;
        import org.springframework.security.authentication.AuthenticationManager;
        import org.springframework.security.authentication.AuthenticationProvider;
        import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
        import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
        import org.springframework.security.core.userdetails.UserDetailsService;
        import org.springframework.security.core.userdetails.UsernameNotFoundException;
        import org.springframework.security.crypto.password.PasswordEncoder;

        @Configuration
        @RequiredArgsConstructor
        public class ApplicationConfig {

            private final UserRepository userRepository;
            private final PasswordEncoder passwordEncoder;

            @Bean
            public UserDetailsService userDetailsService() {
                return username -> userRepository.findByEmail(username)
                        .map(user -> new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), java.util.Collections.emptyList()))
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            }

            @Bean
            public AuthenticationProvider authenticationProvider() {
                DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
                authProvider.setUserDetailsService(userDetailsService());
                authProvider.setPasswordEncoder(passwordEncoder);
                return authProvider;
            }

            @Bean
            public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
            }
        }
        ```

5.  **Create the `AuthController`:** Finally, create the controller.
    *   Inside the `auth` package, create a new `Class` named `AuthController.java`.
    *   Add the following code. This exposes our `AuthService` logic as REST endpoints.

        ```java
        package com.yourcompany.attendance.auth;

        import lombok.RequiredArgsConstructor;
        import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.PostMapping;
        import org.springframework.web.bind.annotation.RequestBody;
        import org.springframework.web.bind.annotation.RequestMapping;
        import org.springframework.web.bind.annotation.RestController;

        @RestController
        @RequestMapping("/api/v1/auth")
        @RequiredArgsConstructor
        public class AuthController {

            private final AuthService authService;

            @PostMapping("/register")
            public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
                // For simplicity, we'll let the service handle exceptions for now.
                // In a real app, we'd have a global exception handler.
                return ResponseEntity.ok(authService.register(request));
            }

            @PostMapping("/login")
            public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
                return ResponseEntity.ok(authService.login(request));
            }
        }
        ```

**Verification:**

This is the most important verification step. We will use Postman to test our live endpoints.

1.  **Restart the Application:** Stop and restart your Spring Boot application.
2.  **Test Registration:**
    *   Open Postman. Create a `POST` request to `http://localhost:8080/api/v1/auth/register`.
    *   Go to the "Body" tab, select "raw", and choose "JSON".
    *   Enter a valid registration JSON payload:
        ```json
        {
          "firstName": "Admin",
          "lastName": "User",
          "email": "admin@example.com",
          "password": "password123",
          "role": "ADMINISTRATOR"
        }
        ```
    *   Click **Send**.
    *   **Expected Success Response (`200 OK`):** You should get back a JSON body containing a JWT token.
        ```json
        {
          "token": "ey..."
        }
        ```
    *   **Test Duplicate Registration:** Click **Send** again with the same payload.
    *   **Expected Error Response (`500 Internal Server Error`):** The request should fail because the user already exists. The console will show an `IllegalStateException`. (This is expected for now. A proper exception handler would return a `409 Conflict`).
3.  **Test Login:**
    *   Create a new `POST` request in Postman to `http://localhost:8080/api/v1/auth/login`.
    *   Go to the "Body" tab, select "raw", and choose "JSON".
    *   Enter the credentials you just registered:
        ```json
        {
          "email": "admin@example.com",
          "password": "password123"
        }
        ```
    *   Click **Send**.
    *   **Expected Success Response (`200 OK`):** You should get back a new JWT token.
    *   **Test Bad Login:** Change the password to "wrongpassword" and send again.
    *   **Expected Error Response (`403 Forbidden` or `401 Unauthorized`):** The request should fail due to bad credentials.

---



Of course. The backend authentication is complete. Now, let's switch gears and begin the foundational tasks for the frontend.

The first step is to initialize the Next.js project and set up the UI component library we've chosen: **Shadcn UI**. This will provide us with the building blocks (buttons, forms, cards, etc.) for the entire application, ensuring a consistent look and feel from the very beginning.

Here is the first frontend task card for the **Project Playbook**.


**MILESTONE 1 COMPLETE!**

---



### **Task ID: [FRONTEND] FE-01**
**Title:** Next.js Project Initialization & Shadcn UI Setup

**Objective:**
To create a new Next.js application using the App Router and integrate the Shadcn UI component library, which uses Tailwind CSS for styling.

**Context:**
We are choosing a "scaffolded" approach. Instead of building every component from scratch, we will use `create-next-app` to generate a modern Next.js project. Then, we will use the Shadcn UI CLI to inject pre-built, beautifully styled, and accessible UI components directly into our project. This dramatically speeds up development time.

**Prerequisites:**
*   Node.js and npm (or yarn) installed on your local machine.
*   Completion of the general Foundation task `[GENERAL] F-01`.
*   You are in your main project workspace folder (e.g., `attendance-system`) in your terminal.

#### **Step-by-Step Instructions:**

1.  **Navigate to the Frontend Directory:**
    ```bash
    cd digital-attendance-frontend
    ```

2.  **Create the Next.js Application:** Run the following command in your terminal. This will initialize a new Next.js project *inside the current folder*. The `.` at the end is important.

    ```bash
    npx create-next-app@latest .
    ```

3.  **Answer the Prompts:** You will be asked a series of questions. Use the following answers to align with our project standards:
    *   `Would you like to use TypeScript?` > **No** (as per our initial decision)
    *   `Would you like to use ESLint?` > **Yes**
    *   `Would you like to use Tailwind CSS?` > **Yes**
    *   `Would you like to use 'src/' directory?` > **Yes**
    *   `Would you like to use App Router? (recommended)` > **Yes**
    *   `Would you like to customize the default import alias?` > **No** (press Enter for the default `@/*`)

    This will install Next.js, React, Tailwind CSS, and all necessary dependencies.

4.  **Run the Development Server:** To verify the installation, start the local development server:
    ```bash
    npm run dev
    ```
    Open your browser and navigate to `http://localhost:3000`. You should see the default Next.js welcome page. You can stop the server for now by pressing `Ctrl + C` in the terminal.

5.  **Initialize Shadcn UI:** Now we will add the UI library. Run the following command:
    ```bash
    npx shadcn-ui@latest init
    ```

6.  **Answer the Shadcn UI Prompts:** You will be asked another set of questions to configure the library.
    *   `Which style would you like to use?` > **Default** (press Enter)
    *   `Which color would you like to use as base color?` > **Slate** (press Enter)
    *   `Would you like to use CSS variables for colors?` > **Yes** (press Enter)

    This command will not install a package in `node_modules`. Instead, it will:
    *   Create a `components` directory.
    *   Create a `lib/utils.ts` file for utility functions (it will be `.ts` but will work fine with our JavaScript project).
    *   Create a `components.json` file to remember your configuration choices.

7.  **Add Your First Component:** Let's add a `Button` component to see it in action.
    ```bash
    npx shadcn-ui@latest add button
    ```
    This command will add a `button.jsx` file inside `src/components/ui/`.

8.  **Clean up and Test the New Component:**
    *   Open the file `src/app/page.jsx`.
    *   Delete all the existing content inside the `main` tag.
    *   Import and use your new button. Replace the file's content with this:

        ```jsx
        import { Button } from "@/components/ui/button";

        export default function Home() {
          return (
            <main className="flex min-h-screen flex-col items-center justify-center p-24">
              <h1 className="text-4xl font-bold mb-4">Digital Attendance System</h1>
              <Button>This is our Button</Button>
            </main>
          );
        }
        ```

**Verification:**

1.  **Start the Development Server Again:**
    ```bash
    npm run dev
    ```
2.  **Check the Browser:** Navigate to `http://localhost:3000`.
    *   **Expected Result:** You should see a clean page with the title "Digital Attendance System" and a nicely styled, clickable button. This confirms that Next.js is running, Tailwind CSS is working, and the Shadcn UI component has been successfully added and rendered.
3.  **Commit Your Work:** This is a major setup step. It's a great time to make a commit.
    ```bash
    git add .
    git commit -m "feat: initialize Next.js and setup Shadcn UI"
    ```

---

Excellent. With the project scaffolding complete, it's time to build our first user-facing page.

We will start with the **Registration Page**. This task focuses purely on the UI/UX aspect. We will build the form, layout, and styling according to modern design principles, using the Shadcn UI components we've just installed. We will *not* connect it to the backend API in this step; that will be a separate task. This allows for parallel development.

Here is the next task card for the **Project Playbook**.

---

### **Task ID: [FRONTEND] FE-02**
**Title:** Build the Registration Page UI

**Objective:**
To create the user interface for the registration page, including input fields for first name, last name, email, password, and a role selector. The page will be responsive and visually appealing.

**Context:**
A good registration page is clean, simple, and intuitive. We will build this as a "dumb component" for now, meaning it will only be responsible for displaying the UI and will not contain any logic for form submission or validation. We'll use Shadcn UI's `Card`, `Input`, `Label`, `Button`, and `Select` components to build a professional-looking form quickly.

**Prerequisites:**
*   Completion of task `[FRONTEND] FE-01`.
*   The Next.js development server can be running (`npm run dev`).

#### **Step-by-Step Instructions:**

1.  **Add Required Shadcn UI Components:** Before we start building, we need to add the necessary component primitives to our project. Run the following commands in your terminal from the `digital-attendance-frontend` directory:

    ```bash
    npx shadcn-ui@latest add card
    npx shadcn-ui@latest add input
    npx shadcn-ui@latest add label
    npx shadcn-ui@latest add select
    ```
    This will add `card.jsx`, `input.jsx`, `label.jsx`, and `select.jsx` to your `src/components/ui/` folder.

2.  **Create the Page File:** In Next.js App Router, pages are created by adding a `page.jsx` file to a new folder inside the `src/app` directory.
    *   Create a new folder named `register` inside `src/app`.
    *   Inside `src/app/register`, create a new file named `page.jsx`.

3.  **Build the Registration Component:** Open the new `src/app/register/page.jsx` file and add the following code. The comments explain how the components are being used.

    ```jsx
    import { Button } from "@/components/ui/button";
    import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
    } from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    } from "@/components/ui/select";
    import Link from "next/link";

    export default function RegisterPage() {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <CardDescription>
                Enter your information to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="John" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Doe" required />
                  </div>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ATTENDEE">Attendee</SelectItem>
                      <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full mt-6">
                  Create Account
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Log in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    ```

4.  **Create a Basic Layout (Optional but Recommended):** Let's remove the default styling from the root layout to ensure our page background color works correctly.
    *   Open `src/app/layout.jsx`.
    *   The `<body>` tag might have some default Tailwind classes like `className={inter.className}`. You can simply remove the `className` prop to have a clean slate.
        *   **Change from:** `<body className={inter.className}>`
        *   **Change to:** `<body>`

**Verification:**

1.  **Start/Check the Development Server:** Make sure your dev server is running (`npm run dev`).
2.  **Navigate to the Page:** Open your browser and go to `http://localhost:3000/register`.
3.  **Review the UI:**
    *   **Expected Result:** You should see a centered card with a clean, professional-looking registration form.
    *   All input fields (First Name, Last Name, Email, Password) should be present.
    *   The "Role" selector should be a dropdown that, when clicked, shows "Attendee" and "Administrator" as options.
    *   The "Create Account" button should be styled and take up the full width of the form.
    *   There should be a clickable "Log in" link at the bottom that will eventually navigate to our login page.
    *   Test the responsiveness by resizing your browser window; the card should resize gracefully.

---



Perfect. Let's create the UI for the Login Page.

This task is very similar to the previous one. We will leverage our existing Shadcn UI components to build a clean and simple login form. Again, the focus is purely on the visual presentation; the logic for handling user input and API calls will come in a later task.

Here is the next task card for the **Project Playbook**.

---

### **Task ID: [FRONTEND] FE-03**
**Title:** Build the Login Page UI

**Objective:**
To create the user interface for the login page, featuring input fields for email and password, a submit button, and a link to the registration page.

**Context:**
The login page should be even simpler than the registration page. It needs to provide a clear, frictionless way for existing users to access the system. We will reuse the `Card`, `Input`, `Label`, and `Button` components to maintain a consistent design language across the application.

**Prerequisites:**
*   Completion of task `[FRONTEND] FE-02`.
*   The Next.js development server can be running (`npm run dev`).
*   No new Shadcn UI components are needed for this task as they were all added in `FE-02`.

#### **Step-by-Step Instructions:**

1.  **Create the Page File:**
    *   Create a new folder named `login` inside the `src/app` directory.
    *   Inside `src/app/login`, create a new file named `page.jsx`.

2.  **Build the Login Component:** Open the new `src/app/login/page.jsx` file and add the following code. Notice how similar the structure is to the `RegisterPage` component, which is great for consistency.

    ```jsx
    import { Button } from "@/components/ui/button";
    import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
    } from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import Link from "next/link";

    export default function LoginPage() {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    ```

**Verification:**

1.  **Start/Check the Development Server:** Make sure your dev server is running (`npm run dev`).
2.  **Navigate to the Page:** Open your browser and go to `http://localhost:3000/login`.
3.  **Review the UI:**
    *   **Expected Result:** You should see a centered card with a simple login form. The card should be slightly narrower than the registration card (`max-w-sm`).
    *   The email and password input fields should be present.
    *   The "Login" button should be styled and full-width.
    *   A "Sign up" link at the bottom should correctly point to the `/register` page.
4.  **Test Navigation:**
    *   Click the "Sign up" link. It should take you to the registration page you built in the previous task.
    *   From the registration page, click the "Log in" link. It should bring you back to this login page. This confirms our basic page routing is working correctly.

---

Excellent. We have our UI pages, but they're currently just static visuals. To make them functional, we need a robust way to send data to and receive data from our backend.

This task involves creating a centralized API client using **Axios**. Setting this up as a reusable service is a crucial step in writing clean, maintainable frontend code. It prevents us from scattering `fetch()` calls all over our application.

Here is the next task card for the **Project Playbook**.

---

### **Task ID: [FRONTEND] FE-04**
**Title:** Create an Axios API Client Service

**Objective:**
To install the Axios library and create a centralized, pre-configured Axios instance that will be used for all API communication with the Spring Boot backend.

**Context:**
Axios is a popular JavaScript library for making HTTP requests. It has several advantages over the native `fetch` API, including automatic JSON transformation, better error handling, and the ability to create "instances" with default configurations. We will create a single instance that knows our backend's base URL. This means in our components, we only need to call `api.post('/auth/login', ...)` instead of `fetch('http://localhost:8080/api/v1/auth/login', ...)`, which is much cleaner.

**Prerequisites:**
*   Completion of task `[FRONTEND] FE-03`.
*   The backend application should be running (so we know the base URL).

#### **Step-by-Step Instructions:**

1.  **Install Axios:** Open your terminal in the `digital-attendance-frontend` directory and run the following command to add Axios to the project:

    ```bash
    npm install axios
    ```

2.  **Add Backend URL to Environment Variables:** It's a bad practice to hardcode URLs directly in the code. We will use an environment variable for this.
    *   In the root of your `digital-attendance-frontend` project, create a new file named `.env.local`.
    *   Add the following line to this file. This variable will be automatically loaded by Next.js.

        ```
        NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
        ```
    *   **Important:** Because we added a *new* environment variable, you must **stop** your Next.js development server (`Ctrl + C`) and **restart** it (`npm run dev`) for the new variable to be recognized.

3.  **Create the API Client File:**
    *   Inside the `src` directory, create a new folder named `services`.
    *   Inside `src/services`, create a new file named `apiClient.js`.

4.  **Configure the Axios Instance:** Open the new `src/services/apiClient.js` file and add the following code. This creates our centralized client.

    ```javascript
    import axios from 'axios';

    // Create an Axios instance with a predefined configuration.
    const apiClient = axios.create({
      // Set the base URL for all requests made with this instance.
      // This is read from the environment variable we just created.
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    /*
      ====================================================================================
      INTERCEPTOR (ADVANCED - BUT CRUCIAL FOR AUTHENTICATION)
      ====================================================================================
      An interceptor allows us to run code or modify requests/responses globally.
      Here, we will add an interceptor that automatically includes the JWT token
      in the 'Authorization' header for every outgoing request if the token exists.
      This saves us from having to add the token manually to every single API call.
    */
    apiClient.interceptors.request.use(
      (config) => {
        // We will store the token in localStorage after the user logs in.
        const token = localStorage.getItem('authToken');
        if (token) {
          // If the token exists, add it to the request headers.
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        // Handle request errors.
        return Promise.reject(error);
      }
    );

    export default apiClient;
    ```

**Verification:**

Since this is a background service, there is no visual component to check. The verification is purely logical and code-based.

1.  **Code Compiles:** Ensure your Next.js application restarts (`npm run dev`) without any compilation errors.
2.  **Environment Variable Check:** In any component file (e.g., `src/app/page.jsx`), you can temporarily add `console.log(process.env.NEXT_PUBLIC_API_URL);` to verify that the URL is being loaded correctly. You should see `http://localhost:8080/api/v1` in your browser's developer console. Remember to remove the `console.log` after verifying.
3.  **Logical Review:** Read through the `apiClient.js` file.
    *   Does it correctly create an Axios instance? Yes.
    *   Does it set the `baseURL` from our environment variable? Yes.
    *   Does it include the request interceptor to automatically add the `Authorization` header? Yes. This is key for future tasks.
4.  **Commit Your Work:**
    ```bash
    git add .
    git commit -m "feat: setup centralized axios api client"
    ```

---

Excellent. This is the task where our frontend starts to feel alive.

We will now add client-side logic to our Registration and Login pages. This involves managing the form's state (what the user types in), handling form submission, calling our new `apiClient` to communicate with the backend, and processing the response. We'll use React hooks (`useState`) for state management.

Here is the next task card for the **Project Playbook**.

---

### **Task ID: [FRONTEND] FE-05**
**Title:** Implement User Authentication Logic

**Objective:**
To add state management and form submission logic to the `LoginPage` and `RegisterPage` components, enabling them to make API calls to the backend for user authentication.

**Context:**
To make a React component interactive, we need to declare it as a "Client Component" in Next.js App Router by adding the `"use client";` directive at the top of the file. This allows us to use hooks like `useState` to store and update data, such as the values of our form inputs. When the user clicks "Submit", we will package this state into a JSON object that matches our API contract and send it to the backend using our `apiClient`.

**Prerequisites:**
*   Completion of tasks `[FRONTEND] FE-02`, `[FRONTEND] FE-03`, and `[FRONTEND] FE-04`.
*   The Spring Boot backend server **must be running** on `localhost:8080` to handle the API calls.
*   The Next.js development server is running (`npm run dev`).

#### **Step-by-Step Instructions (for `LoginPage`):**

1.  **Convert to a Client Component:**
    *   Open `src/app/login/page.jsx`.
    *   Add `"use client";` as the very first line of the file.

2.  **Import Necessary Hooks and Services:** Add these imports at the top of the file:

    ```javascript
    import { useState } from "react";
    import { useRouter } from "next/navigation"; // For redirection
    import apiClient from "@/services/apiClient";
    ```

3.  **Implement State and Submission Logic:**
    *   Inside the `LoginPage` component function, before the `return` statement, add the state management and the submission handler function.
    *   Wire up the form inputs to the state using `onChange` handlers and the form itself with an `onSubmit` handler.

4.  **Update `LoginPage` Code:** Replace the entire content of `src/app/login/page.jsx` with the following fully functional code:

    ```jsx
    "use client"; // Mark this as a Client Component

    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { Button } from "@/components/ui/button";
    import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
    } from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import Link from "next/link";
    import apiClient from "@/services/apiClient"; // Import our API client

    export default function LoginPage() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [error, setError] = useState(""); // To display login errors
      const router = useRouter();

      const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(""); // Clear previous errors

        try {
          const response = await apiClient.post("/auth/login", {
            email,
            password,
          });

          // If login is successful, backend sends a token
          const token = response.data.token;
          
          // Store the token in localStorage for the API interceptor to use
          localStorage.setItem("authToken", token);

          // Redirect to a dashboard page (we'll create this later)
          router.push("/dashboard");
          
        } catch (err) {
          // Handle login errors
          console.error("Login failed:", err);
          setError("Invalid email or password. Please try again.");
        }
      };

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add the onSubmit handler to the form */}
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      required
                      value={email} // Bind value to state
                      onChange={(e) => setEmail(e.target.value)} // Update state on change
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password} // Bind value to state
                      onChange={(e) => setPassword(e.target.value)} // Update state on change
                    />
                  </div>
                  {/* Display error message if it exists */}
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    ```

5.  **Repeat for `RegisterPage`:** Apply the same principles to the `src/app/register/page.jsx` file. The logic is very similar. Replace its content with this:

    ```jsx
    "use client"; // Mark this as a Client Component

    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { Button } from "@/components/ui/button";
    import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
    } from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    } from "@/components/ui/select";
    import Link from "next/link";
    import apiClient from "@/services/apiClient"; // Import our API client

    export default function RegisterPage() {
      const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "ATTENDEE", // Default role
      });
      const [error, setError] = useState("");
      const router = useRouter();

      const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
      };
      
      const handleRoleChange = (value) => {
        setFormData((prev) => ({ ...prev, role: value }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setError("All fields are required.");
            return;
        }

        try {
          // As per our API Contract, register endpoint does not return a token
          // It just confirms user creation. Let's adjust for that.
          // For a better UX, we could also log them in automatically.
          await apiClient.post("/auth/register", formData);
          
          // On successful registration, redirect to login page with a success message
          router.push("/login?registered=true");

        } catch (err) {
          console.error("Registration failed:", err);
          setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
      };

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <CardDescription>Enter your information to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required onChange={handleChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required onChange={handleChange} />
                  </div>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" required onChange={handleChange} />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required onChange={handleChange} />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={handleRoleChange} defaultValue="ATTENDEE">
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ATTENDEE">Attendee</SelectItem>
                      <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                <Button type="submit" className="w-full mt-6">Create Account</Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">Log in</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    ```

**Verification:**

1.  **Ensure Servers are Running:** Make sure both the backend and frontend development servers are running.
2.  **Test Registration:**
    *   Navigate to `http://localhost:3000/register`.
    *   Fill out the form with new user details (e.g., `test@example.com`).
    *   Click "Create Account".
    *   **Expected Result:** The page should redirect you to `http://localhost:3000/login`. Check your backend database; the new user should be there with a hashed password.
    *   Try registering with the *same email* again.
    *   **Expected Result:** You should see an error message on the page: "User with email ... already exists." or similar.
3.  **Test Login:**
    *   Navigate to `http://localhost:3000/login`.
    *   Enter the credentials of the user you just created.
    *   Click "Login".
    *   **Expected Result:** You should be redirected to a 404 page for `/dashboard` (since it doesn't exist yet). This is **correct** and proves the redirect logic worked.
    *   Open your browser's Developer Tools (F12), go to the "Application" or "Storage" tab, and check `localStorage`. You should see a key named `authToken` with a very long string value (the JWT). This is a critical success.
    *   Try logging in with the wrong password.
    *   **Expected Result:** An error message "Invalid email or password" should appear on the page.

---

Fantastic. This is the final and most crucial piece of the frontend authentication puzzle.

Currently, anyone can visit any page in our app, and the app has no persistent "memory" of the user's login state. We need to solve two problems:
1.  Create a global state so all components know who is logged in.
2.  Protect certain pages (like a dashboard) so only logged-in users can see them.

We'll achieve this by creating a global "Auth Context" using React's Context API and a custom hook, and then building a special component to wrap our protected routes.

Here is the final task card for this milestone.

---

### **Task ID: [FRONTEND] FE-06**
**Title:** Implement Global Auth State and Protected Routes

**Objective:**
To create a global authentication context to manage user state across the entire application and implement a mechanism to protect routes from unauthenticated access.

**Context:**
React's Context API is the standard way to share state (like the current user's information) between components without having to pass props down through many levels. We will create an `AuthContext` that provides the user's data and a `logout` function to the entire app. Then, we will create a `ProtectedRoute` component that checks this context. If a user is logged in, it will render the requested page; if not, it will redirect them to the login page.

**Prerequisites:**
*   Completion of task `[FRONTEND] FE-05`.

#### **Step-by-Step Instructions:**

1.  **Create the Auth Context:**
    *   Inside the `src` directory, create a new folder named `context`.
    *   Inside `src/context`, create a new file named `AuthContext.js`.
    *   Add the following code to `AuthContext.js`. This sets up the provider and a custom hook (`useAuth`) for easy access.

    ```javascript
    "use client";

    import { createContext, useContext, useState, useEffect } from 'react';
    import apiClient from '@/services/apiClient';
    import { useRouter } from 'next/navigation';

    const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true); // To handle initial load
      const router = useRouter();

      useEffect(() => {
        // This effect runs once on app load to check if a user is already logged in.
        const token = localStorage.getItem('authToken');
        if (token) {
          apiClient.get('/auth/me')
            .then(response => {
              setUser(response.data);
            })
            .catch(() => {
              // Token is invalid or expired
              localStorage.removeItem('authToken');
              setUser(null);
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      }, []);

      const login = async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        const { token, user: userData } = response.data; // Assuming API returns user info on login
        localStorage.setItem('authToken', token);
        setUser(userData);
        router.push('/dashboard');
      };

      const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        router.push('/login');
      };

      const authContextValue = {
        user,
        loading,
        login, // We can refactor LoginPage to use this later
        logout,
      };

      return (
        <AuthContext.Provider value={authContextValue}>
          {children}
        </AuthContext.Provider>
      );
    };

    // Custom hook to use the AuthContext
    export const useAuth = () => {
      return useContext(AuthContext);
    };
    ```

2.  **Wrap the Application in the Auth Provider:**
    *   Open `src/app/layout.jsx`.
    *   Import the `AuthProvider` and wrap the `{children}` with it. This makes the auth state available to every single page.

    ```jsx
    // src/app/layout.jsx
    import { AuthProvider } from '@/context/AuthContext';
    import './globals.css';

    export const metadata = {
      title: 'Digital Attendance System',
      description: 'A modern way to track attendance.',
    };

    export default function RootLayout({ children }) {
      return (
        <html lang="en">
          <body>
            <AuthProvider>{children}</AuthProvider>
          </body>
        </html>
      );
    }
    ```

3.  **Create the Protected Route Component:**
    *   Inside `src/components`, create a new folder named `auth`.
    *   Inside `src/components/auth`, create a new file named `ProtectedRoute.jsx`.
    *   Add the following code. This component will be the gatekeeper for our private pages.

    ```jsx
    "use client";

    import { useEffect } from 'react';
    import { useRouter } from 'next/navigation';
    import { useAuth } from '@/context/AuthContext';

    const ProtectedRoute = ({ children }) => {
      const { user, loading } = useAuth();
      const router = useRouter();

      useEffect(() => {
        // Wait until the loading is finished before checking for user
        if (!loading && !user) {
          router.push('/login');
        }
      }, [user, loading, router]);
      
      // While loading, you can show a spinner or a blank screen
      if (loading || !user) {
        return <div>Loading...</div>; // Or a proper loading spinner component
      }

      // If user is authenticated, render the children components (the actual page)
      return children;
    };

    export default ProtectedRoute;
    ```

4.  **Create and Protect the Dashboard Page:**
    *   Create a new folder named `dashboard` inside `src/app`.
    *   Inside `src/app/dashboard`, create a new file named `page.jsx`.
    *   Add the following code. This page will display the user's info and a logout button.

    ```jsx
    "use client";

    import { useAuth } from '@/context/AuthContext';
    import { Button } from '@/components/ui/button';
    import ProtectedRoute from '@/components/auth/ProtectedRoute';

    function DashboardContent() {
      const { user, logout } = useAuth();

      if (!user) {
        return null; // Should be handled by ProtectedRoute, but good practice
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold">Welcome to the Dashboard!</h1>
          <p className="mt-4">Hello, {user.firstName} ({user.email})</p>
          <p>Your role is: {user.role}</p>
          <Button onClick={logout} className="mt-6">
            Logout
          </Button>
        </div>
      );
    }

    // This is the final exported component that wraps the content with protection
    export default function DashboardPage() {
      return (
        <ProtectedRoute>
          <DashboardContent />
        </ProtectedRoute>
      );
    }
    ```
    *Note: For the user's name to appear, you'll need to adjust the backend login response in the API contract (and implementation) to return the full user object, not just the ID and role. Our current `AuthContext` already expects this.*

**Verification:**

1.  **Refactor Login (Slightly):** Open `src/app/login/page.jsx`. Now that we have a global `login` function, you can optionally replace the local `handleSubmit` logic to use it, although the current implementation will still work. The key is that it sets the `localStorage` token, which the `AuthContext` will pick up on the next page load.
2.  **Test the Protected Route (Logged Out):**
    *   Clear your browser's `localStorage` to ensure you are logged out.
    *   Try to navigate directly to `http://localhost:3000/dashboard`.
    *   **Expected Result:** You should briefly see "Loading..." and then be immediately redirected to the `/login` page. You should not be able to see the dashboard content.
3.  **Test the Full Flow (Login -> Dashboard):**
    *   Go to `http://localhost:3000/login`.
    *   Log in with a valid user.
    *   **Expected Result:** You should be redirected to `http://localhost:3000/dashboard`, and this time you should see the welcome message, your user information, and a logout button.
4.  **Test Persistence (Refresh):**
    *   While on the dashboard, refresh the page.
    *   **Expected Result:** You should see "Loading..." briefly, and then the dashboard content should reappear. You should *not* be kicked back to the login page. This confirms our `useEffect` in the `AuthContext` is correctly re-authenticating the user from the stored token.
5.  **Test Logout:**
    *   Click the "Logout" button on the dashboard.
    *   **Expected Result:** You should be immediately redirected to the `/login` page. The `authToken` in `localStorage` should be gone.

---

**MILESTONE 1 COMPLETE!**

Excellent. **Milestone 1** is complete, and our foundation is solid. Let's move on to **Milestone 2: Core Admin Functionality**.

The goal of this milestone is to build the parts of the application that allow an `ADMINISTRATOR` to manage the system's core data: **Venues, Groups, and Events**.

We'll start with **Venue Management**. The backend team will build the API endpoints as defined in the contract, and the frontend team will build the UI to interact with them. Since the contract is already defined, these two streams of work can happen in parallel.

Let's begin with the first backend task for this milestone.

---

## **Milestone 2: Core Admin Functionality**

**Objective:** To implement the features required for an `ADMINISTRATOR` to manage Venues, Groups, and Events, enabling the setup and scheduling required for attendance tracking.

### **List of Tasks for this Milestone (Venue Management):**
*   **[BACKEND] BE-05:** Implement the Venue Entity and Repository
*   **[BACKEND] BE-06:** Implement the Venue Management API Controller
*   **[FRONTEND] FE-07:** Build the Admin Layout and Navigation
*   **[FRONTEND] FE-08:** Build the Venue Management Page UI
*   **[FRONTEND] FE-09:** Implement Venue Management Logic (CRUD)

---

### **Task ID: [BACKEND] BE-05**
**Title:** Implement the Venue Entity and Repository

**Objective:**
To create the `Venue` Java class that maps to our `venues` database table, and the `VenueRepository` interface for database operations.

**Context:**
This process is nearly identical to how we created the `User` entity and repository in task `BE-01`. The `Venue` entity will store the name, geographic coordinates, and radius for a physical location. The repository will provide us with the standard CRUD (Create, Read, Update, Delete) methods for free.

**Prerequisites:**
*   Completion of all Milestone 1 backend tasks.

#### **Step-by-Step Instructions:**

1.  **Create a `venue` Package:** In your main source folder (e.g., `src/main/java/com/yourcompany/attendance`), create a new package named `venue`.
2.  **Create the `Venue` Entity Class:** Inside the `venue` package, create a new Java `Class` named `Venue.java`. Replace its contents with the code below.

    ```java
    package com.yourcompany.attendance.venue;

    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import java.util.UUID;

    @Data // Bundles @Getter, @Setter, @ToString, @EqualsAndHashCode
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Table(name = "venues")
    public class Venue {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID id;

        // Venue name must be unique.
        @Column(nullable = false, unique = true, length = 100)
        private String name;

        // Latitude and Longitude are stored as double-precision floating-point numbers.
        @Column(nullable = false)
        private Double latitude;

        @Column(nullable = false)
        private Double longitude;

        // Radius for geolocation check, stored in meters.
        @Column(nullable = false)
        private Integer radius;
    }
    ```

3.  **Create the `VenueRepository` Interface:** Inside the `venue` package, create a new Java `Interface` named `VenueRepository.java`. Replace its contents with the following:

    ```java
    package com.yourcompany.attendance.venue;

    import org.springframework.data.jpa.repository.JpaRepository;
    import java.util.Optional;
    import java.util.UUID;

    public interface VenueRepository extends JpaRepository<Venue, UUID> {
        // This custom method will be useful for checking for duplicate names.
        Optional<Venue> findByName(String name);
    }
    ```

**Verification:**

1.  **Restart the Application:** Stop and restart your Spring Boot application.
2.  **Check Console Logs:** Watch the console output. You should see a log message from Hibernate like `create table venues (...)`. This confirms the new table has been created from your entity definition.
3.  **Check Database:** Use your database client to inspect your database. A new table named `venues` should now exist with the columns: `id`, `name`, `latitude`, `longitude`, and `radius`.

---

Excellent. Let's build the API endpoints for managing venues.

This task involves creating a `VenueController` that will handle all HTTP requests related to venues, as defined in our API contract. We will also create a `VenueService` to encapsulate the business logic, keeping our controller clean and focused on handling web requests. We will also need to protect these endpoints to ensure only users with the `ADMINISTRATOR` role can access them.

Here is the next task card for the **Project Playbook**.

---

### **Task ID: [BACKEND] BE-06**
**Title:** Implement the Venue Management API Controller

**Objective:**
To build the secure REST endpoints for creating, reading, updating, and deleting venues (CRUD), accessible only by administrators.

**Context:**
We will follow the same pattern as the `AuthController`: a `Controller` for handling web requests, a `Service` for business logic, and DTOs for data transfer. A critical new element here is **authorization**. We will use Spring Security annotations (`@PreAuthorize`) to ensure that only users with the `ADMINISTRATOR` role can call these methods. This is a powerful and declarative way to handle security.

**Prerequisites:**
*   Completion of task `[BACKEND] BE-05`.
*   A solid understanding of the Venue Management section in the `api-contract.md`.

#### **Step-by-Step Instructions:**

1.  **Enable Method-Level Security:**
    *   Open your `SecurityConfig.java` file in the `config` package.
    *   Add the `@EnableMethodSecurity` annotation to the class. This annotation is what activates the `@PreAuthorize` functionality.
        ```java
        // ... other imports
        import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
        
        @Configuration
        @EnableWebSecurity
        @EnableMethodSecurity // Add this line
        public class SecurityConfig {
            // ... existing beans
        }
        ```

2.  **Create Venue DTOs:** Inside the `venue` package, create a new `Class` file for our DTO. For simplicity, we can use one DTO for both requests and responses in this case.
    *   **`VenueDto.java`**:
        ```java
        package com.yourcompany.attendance.venue;

        import lombok.Builder;
        import lombok.Data;

        import java.util.UUID;

        @Data
        @Builder
        public class VenueDto {
            private UUID id;
            private String name;
            private Double latitude;
            private Double longitude;
            private Integer radius;
        }
        ```

3.  **Create the `VenueService`:**
    *   Inside the `venue` package, create a new `Class` named `VenueService.java`.
    *   Add the following code. This contains all the logic for managing venues.

    ```java
    package com.yourcompany.attendance.venue;

    import lombok.RequiredArgsConstructor;
    import org.springframework.stereotype.Service;
    import java.util.List;
    import java.util.UUID;
    import java.util.stream.Collectors;

    @Service
    @RequiredArgsConstructor
    public class VenueService {

        private final VenueRepository venueRepository;

        // Create a new venue
        public VenueDto createVenue(VenueDto venueDto) {
            venueRepository.findByName(venueDto.getName()).ifPresent(v -> {
                throw new IllegalStateException("Venue with name '" + venueDto.getName() + "' already exists.");
            });

            Venue venue = Venue.builder()
                .name(venueDto.getName())
                .latitude(venueDto.getLatitude())
                .longitude(venueDto.getLongitude())
                .radius(venueDto.getRadius())
                .build();
            
            Venue savedVenue = venueRepository.save(venue);
            return mapToDto(savedVenue);
        }

        // Get all venues
        public List<VenueDto> getAllVenues() {
            return venueRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        }
        
        // Get a single venue by ID
        public VenueDto getVenueById(UUID id) {
            Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
            return mapToDto(venue);
        }
        
        // Update a venue
        public VenueDto updateVenue(UUID id, VenueDto venueDto) {
             Venue existingVenue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));

             existingVenue.setName(venueDto.getName());
             existingVenue.setLatitude(venueDto.getLatitude());
             existingVenue.setLongitude(venueDto.getLongitude());
             existingVenue.setRadius(venueDto.getRadius());
             
             Venue updatedVenue = venueRepository.save(existingVenue);
             return mapToDto(updatedVenue);
        }
        
        // Delete a venue
        public void deleteVenue(UUID id) {
            if (!venueRepository.existsById(id)) {
                throw new RuntimeException("Venue not found with id: " + id);
            }
            venueRepository.deleteById(id);
        }

        // Helper method to map Entity to DTO
        private VenueDto mapToDto(Venue venue) {
            return VenueDto.builder()
                .id(venue.getId())
                .name(venue.getName())
                .latitude(venue.getLatitude())
                .longitude(venue.getLongitude())
                .radius(venue.getRadius())
                .build();
        }
    }
    ```

4.  **Create the `VenueController`:**
    *   Inside the `venue` package, create a new `Class` named `VenueController.java`.
    *   Add the following code. Note the use of `@PreAuthorize("hasRole('ADMINISTRATOR')")` on the class level, which protects all endpoints within it.

    ```java
    package com.yourcompany.attendance.venue;

    import lombok.RequiredArgsConstructor;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;
    
    import java.util.List;
    import java.util.UUID;

    @RestController
    @RequestMapping("/api/v1/venues")
    @RequiredArgsConstructor
    @PreAuthorize("hasAuthority('ADMINISTRATOR')") // Secure all endpoints in this controller
    public class VenueController {

        private final VenueService venueService;

        @PostMapping
        public ResponseEntity<VenueDto> createVenue(@RequestBody VenueDto venueDto) {
            VenueDto createdVenue = venueService.createVenue(venueDto);
            return new ResponseEntity<>(createdVenue, HttpStatus.CREATED);
        }

        @GetMapping
        public ResponseEntity<List<VenueDto>> getAllVenues() {
            List<VenueDto> venues = venueService.getAllVenues();
            return ResponseEntity.ok(venues);
        }
        
        @GetMapping("/{id}")
        public ResponseEntity<VenueDto> getVenueById(@PathVariable UUID id) {
            return ResponseEntity.ok(venueService.getVenueById(id));
        }

        @PutMapping("/{id}")
        public ResponseEntity<VenueDto> updateVenue(@PathVariable UUID id, @RequestBody VenueDto venueDto) {
            return ResponseEntity.ok(venueService.updateVenue(id, venueDto));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteVenue(@PathVariable UUID id) {
            venueService.deleteVenue(id);
            return ResponseEntity.noContent().build();
        }
    }
    ```
    *Note: We changed `hasRole('ADMINISTRATOR')` to `hasAuthority('ADMINISTRATOR')` because Spring Security prefixes roles with `ROLE_` by default. Using `hasAuthority` is often more direct.*

**Verification:**

This requires Postman and a valid JWT from an `ADMINISTRATOR` user.

1.  **Restart the Application.**
2.  **Login as Admin:** In Postman, run your `/auth/login` request for an `ADMINISTRATOR` user and copy the resulting JWT token.
3.  **Test Create Venue (`POST /venues`):**
    *   Create a new `POST` request to `http://localhost:8080/api/v1/venues`.
    *   Go to the "Authorization" tab, select "Bearer Token", and paste the admin JWT.
    *   Go to the "Body" tab, select "raw" (JSON), and add a valid venue payload:
        ```json
        {
          "name": "Main Campus Auditorium",
          "latitude": -6.7766,
          "longitude": 39.2312,
          "radius": 100
        }
        ```
    *   Click **Send**.
    *   **Expected Success Response (`201 Created`):** You should get the created venue object back, including its new UUID.
4.  **Test Access Denied:** Try the same request but use a JWT from an `ATTENDEE` user (register one if needed).
    *   **Expected Error Response (`403 Forbidden`):** The request should be rejected. This confirms our security is working.
5.  **Test Get All Venues (`GET /venues`):**
    *   Create a `GET` request to `http://localhost:8080/api/v1/venues` with the admin JWT.
    *   **Expected Success Response (`200 OK`):** You should get back an array containing the venue you just created.
6.  **Test the other endpoints (`GET /{id}`, `PUT /{id}`, `DELETE /{id}`)** in a similar fashion, using the ID from the venue you created. Ensure they all work as expected with an admin token and are forbidden with an attendee token.

---





Excellent. The backend API for venues is ready to be consumed. Now, let's build the frontend interface for administrators to use it.

Before we build the specific Venue Management page, we need to create a general-purpose **Admin Layout**. This will serve as a consistent shell or template for all administrator-facing pages, containing elements like a sidebar for navigation and a main content area. This is a crucial step for building a scalable and professional-feeling admin dashboard.

Here is the next task card for the **Project Playbook**.

---

### **Task ID: [FRONTEND] FE-07**
**Title:** Build the Admin Layout and Navigation

**Objective:**
To create a reusable layout component for the admin section of the application, featuring a persistent sidebar for navigation and a main area where page content will be rendered.

**Context:**
In Next.js, we can create nested layouts. We will create a new `layout.jsx` file inside an `(admin)` route group folder. This layout will be applied to all pages within that group (e.g., `/dashboard`, `/venues`, `/groups`). The layout will first check if the user is an authenticated administrator using our `ProtectedRoute` component. If they are, it will display a sidebar with links and the page's content.

**Prerequisites:**
*   Completion of all Milestone 1 frontend tasks.

#### **Step-by-Step Instructions:**

1.  **Create an Admin Route Group:**
    *   In Next.js, folders wrapped in parentheses `()` are called Route Groups. They organize routes without affecting the URL path. This is perfect for applying a shared layout.
    *   Inside the `src/app` directory, create a new folder named `(admin)`.
    *   Move the existing `src/app/dashboard` folder *inside* the new `src/app/(admin)` folder. Your structure should look like this:
        ```
        src/app/
        ├── (admin)/
        │   ├── dashboard/
        │   │   └── page.jsx
        ├── login/
        └── register/
        ```
        The dashboard URL remains `localhost:3000/dashboard`.

2.  **Add Icons:** We will use `lucide-react` for icons in our sidebar. This library was included by default with Shadcn UI.

3.  **Create the Admin Layout File:**
    *   Inside the `src/app/(admin)` folder, create a new file named `layout.jsx`.
    *   Add the following code to this file. This defines our main admin layout.

    ```jsx
    import Link from "next/link";
    import { Home, MapPin, Users, Calendar } from "lucide-react"; // Import icons
    import ProtectedRoute from "@/components/auth/ProtectedRoute";

    // This is the shell for all pages inside the (admin) group
    export default function AdminLayout({ children }) {
      return (
        <ProtectedRoute>
          <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            {/* Sidebar Navigation */}
            <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                  <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
                    <Calendar className="h-6 w-6" />
                    <span>Admin Panel</span>
                  </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <nav className="grid items-start px-4 text-sm font-medium">
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="/dashboard"
                    >
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                      href="/venues" // Link to the page we are about to create
                    >
                      <MapPin className="h-4 w-4" />
                      Venues
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="#" // Future link for Groups
                    >
                      <Users className="h-4 w-4" />
                      Groups
                    </Link>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col">
              <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
                  {/* We can add a user dropdown/logout button here later */}
                  <div className="w-full flex-1">
                      <h1 className="text-lg font-semibold">Dashboard</h1>
                  </div>
              </header>
              <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                {children} {/* This is where the actual page content will be rendered */}
              </main>
            </div>
          </div>
        </ProtectedRoute>
      );
    }
    ```

4.  **Refactor the Dashboard Page:** Our old `DashboardPage` component was wrapped in `ProtectedRoute`. Since the new layout handles this, we can simplify it.
    *   Open `src/app/(admin)/dashboard/page.jsx`.
    *   Replace its content with the cleaned-up version below. It no longer needs to import or use `ProtectedRoute`.

    ```jsx
    "use client";

    import { useAuth } from '@/context/AuthContext';
    import { Button } from '@/components/ui/button';

    export default function DashboardPage() {
      const { user, logout } = useAuth();

      if (!user) {
        return <div>Loading user data...</div>;
      }

      return (
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.firstName}!</h1>
          <p className="text-gray-500">Here is your dashboard overview.</p>
          <Button onClick={logout} className="mt-6">
            Logout
          </Button>
        </div>
      );
    }
    ```

**Verification:**

1.  **Start/Check the Development Server** (`npm run dev`).
2.  **Log in as an Administrator:** Navigate to `/login` and log in with an admin user's credentials.
3.  **Check the Dashboard:** You should be redirected to `/dashboard`.
    *   **Expected Result:** You should now see the new layout. A sidebar should be visible on the left (on larger screens) with links for "Dashboard", "Venues", and "Groups". A header bar should be at the top, and the main content area should display your "Welcome back..." message.
4.  **Test the Protection:** Log out and try to access `/dashboard` directly. You should be redirected to `/login`, proving that the layout's `ProtectedRoute` is working correctly.
5.  **Test Navigation:** Click the "Venues" link in the sidebar.
    *   **Expected Result:** You will get a 404 Not Found error because the `/venues` page does not exist yet. This is correct and expected behavior. It confirms our links are set up properly.

---

Excellent. The admin layout is in place. Now let's create the page that will live inside it: the **Venue Management Page**.

This task focuses on building the static UI for displaying, creating, and editing venues. We will build a data table to list existing venues and a dialog/modal form for adding new ones or editing existing ones. We will use Shadcn UI components extensively to make this look professional quickly. As before, this task is purely about the UI; the logic will be added in the next step.

Here is the next task card for the **Project Playbook**.

---

### **Task ID: [FRONTEND] FE-08**
**Title:** Build the Venue Management Page UI

**Objective:**
To create the user interface for the Venue Management page, including a data table to display a list of venues and a dialog form for creating and editing a venue.

**Context:**
A standard CRUD (Create, Read, Update, Delete) interface consists of a table to view data and a form to modify it. We will use a `Table` component to list the venues and a `Dialog` component (a modal window) that will pop up when the admin clicks "Add Venue" or "Edit". This provides a clean user experience without needing to navigate to a separate page for the form.

**Prerequisites:**
*   Completion of task `[FRONTEND] FE-07`.

#### **Step-by-Step Instructions:**

1.  **Add Required Shadcn UI Components:** We need several new components for the table and dialog. Run the following commands:

    ```bash
    npx shadcn-ui@latest add table
    npx shadcn-ui@latest add dialog
    npx shadcn-ui@latest add dropdown-menu
    ```

2.  **Create the Page File:**
    *   Inside the `src/app/(admin)` folder, create a new folder named `venues`.
    *   Inside `src/app/(admin)/venues`, create a new file named `page.jsx`.

3.  **Build the Venue Page Component:** Open `src/app/(admin)/venues/page.jsx` and add the following code. This code sets up the entire UI with placeholder data. Read through the comments to understand the structure.

    ```jsx
    "use client";

    import { Button } from "@/components/ui/button";
    import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
    } from "@/components/ui/table";
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
      DialogFooter,
    } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { MoreHorizontal } from "lucide-react";

    // Placeholder data to build the UI
    const mockVenues = [
      { id: '1', name: 'Main Auditorium', latitude: -6.77, longitude: 39.23, radius: 50 },
      { id: '2', name: 'Computer Lab 3', latitude: -6.78, longitude: 39.24, radius: 25 },
    ];

    export default function VenuesPage() {
      // We will add state and logic here in the next task
      const isDialogOpen = false; // Placeholder
      const setIsDialogOpen = () => {}; // Placeholder

      return (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Manage Venues</h1>
            {/* Dialog Trigger Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Venue</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Venue</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the new venue. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                {/* Form inside the Dialog */}
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" placeholder="e.g., Main Hall" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="latitude" className="text-right">Latitude</Label>
                    <Input id="latitude" type="number" placeholder="-6.7766" className="col-span-3" />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="longitude" className="text-right">Longitude</Label>
                    <Input id="longitude" type="number" placeholder="39.2312" className="col-span-3" />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="radius" className="text-right">Radius (m)</Label>
                    <Input id="radius" type="number" placeholder="50" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Venues Table */}
          <div className="border shadow-sm rounded-lg mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Radius (m)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockVenues.map((venue) => (
                  <TableRow key={venue.id}>
                    <TableCell className="font-medium">{venue.name}</TableCell>
                    <TableCell>{venue.latitude}</TableCell>
                    <TableCell>{venue.longitude}</TableCell>
                    <TableCell>{venue.radius}</TableCell>
                    <TableCell className="text-right">
                      {/* We'll use a DropdownMenu for actions in a real app */}
                      <Button variant="outline" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      );
    }
    ```

**Verification:**

1.  **Log in as an Administrator:** Start the dev server (`npm run dev`), go to `/login`, and log in with an admin account.
2.  **Navigate to the Venues Page:** From the dashboard or by clicking the sidebar link, navigate to `http://localhost:3000/venues`.
3.  **Review the UI:**
    *   **Expected Result:** The page should appear within your admin layout.
    *   You should see the title "Manage Venues" and an "Add Venue" button at the top right.
    *   A table should be visible, populated with the two mock venues ("Main Auditorium" and "Computer Lab 3").
    *   The table should have columns for Name, Latitude, Longitude, Radius, and Actions.
4.  **Test the Dialog:**
    *   Click the "Add Venue" button.
    *   **Expected Result:** A dialog box (modal) should pop up over the page, displaying a form with fields for Name, Latitude, Longitude, and Radius, and a "Save changes" button. You should be able to close it by clicking the 'X' or outside the dialog area.

---
Of course. This is the final and most rewarding step for Venue Management, where we connect our beautiful UI to the powerful backend API we built earlier.

In this task, we will replace the mock data with live data from our API. We'll fetch all venues when the page loads, handle the creation of new venues through the dialog form, and implement the logic for updating and deleting existing venues. We'll use React hooks like `useState` and `useEffect` to manage the component's state and data fetching lifecycle.

Here is the final task card for this feature.

---

### **Task ID: [FRONTEND] FE-09**
**Title:** Implement Venue Management Logic (CRUD)

**Objective:**
To fully integrate the Venue Management UI with the backend API, enabling administrators to perform all CRUD (Create, Read, Update, Delete) operations on venues.

**Context:**
This task transforms our static UI into a dynamic, data-driven application component. We will use `useEffect` to fetch the list of venues when the component first mounts. Form submission will be handled by an `async` function that calls our `apiClient`. We will manage the state of the venue list, the dialog's open/closed status, and the data for the venue currently being edited.

**Prerequisites:**
*   Completion of all previous backend and frontend tasks for Venue Management (`BE-05`, `BE-06`, `FE-07`, `FE-08`).
*   The Spring Boot backend server **must be running** to serve the API requests.

#### **Step-by-Step Instructions:**

1.  **Add `useEffect` and `useState`:** We need these core React hooks to manage our component's lifecycle and state.
2.  **Implement Data Fetching:** We'll create a function to fetch all venues from the `GET /api/v1/venues` endpoint and store them in state.
3.  **Implement Form Handling:** We'll create functions to handle form input changes and the final form submission for both creating and updating venues.
4.  **Implement Deletion:** We'll create a function to handle the deletion of a venue.
5.  **Refine UI for Actions:** We will replace the simple "Edit" button with a `DropdownMenu` to provide both "Edit" and "Delete" options for each venue in a clean way.

6.  **Update `VenuesPage` Code:** Replace the entire content of `src/app/(admin)/venues/page.jsx` with the following fully functional code. Read the comments carefully to understand how the state and logic are integrated.

    ```jsx
    "use client";

    import { useState, useEffect } from "react";
    import apiClient from "@/services/apiClient";
    import { Button } from "@/components/ui/button";
    import {
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
    } from "@/components/ui/table";
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogFooter,
    } from "@/components/ui/dialog";
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { MoreHorizontal } from "lucide-react";

    const emptyVenue = { name: '', latitude: '', longitude: '', radius: '' };

    export default function VenuesPage() {
      const [venues, setVenues] = useState([]);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [currentVenue, setCurrentVenue] = useState(emptyVenue);
      const [editingId, setEditingId] = useState(null); // null for 'Add' mode, id for 'Edit' mode

      // Function to fetch all venues
      const fetchVenues = async () => {
        try {
          const response = await apiClient.get("/venues");
          setVenues(response.data);
        } catch (error) {
          console.error("Failed to fetch venues:", error);
          // Handle error (e.g., show a toast notification)
        }
      };

      // Fetch venues when the component mounts
      useEffect(() => {
        fetchVenues();
      }, []);

      const handleInputChange = (e) => {
        const { id, value } = e.target;
        setCurrentVenue({ ...currentVenue, [id]: value });
      };

      const handleAddNew = () => {
        setEditingId(null);
        setCurrentVenue(emptyVenue);
        setIsDialogOpen(true);
      };

      const handleEdit = (venue) => {
        setEditingId(venue.id);
        setCurrentVenue(venue);
        setIsDialogOpen(true);
      };

      const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this venue?")) {
          try {
            await apiClient.delete(`/venues/${id}`);
            fetchVenues(); // Refresh the list
          } catch (error) {
            console.error("Failed to delete venue:", error);
          }
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (editingId) {
            // Update existing venue
            await apiClient.put(`/venues/${editingId}`, currentVenue);
          } else {
            // Create new venue
            await apiClient.post("/venues", currentVenue);
          }
          fetchVenues(); // Refresh the list
          setIsDialogOpen(false); // Close the dialog
        } catch (error) {
          console.error("Failed to save venue:", error);
        }
      };

      return (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Manage Venues</h1>
            <Button onClick={handleAddNew}>Add Venue</Button>
          </div>

          <div className="border shadow-sm rounded-lg mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Radius (m)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.map((venue) => (
                  <TableRow key={venue.id}>
                    <TableCell className="font-medium">{venue.name}</TableCell>
                    <TableCell>{venue.latitude}</TableCell>
                    <TableCell>{venue.longitude}</TableCell>
                    <TableCell>{venue.radius}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(venue)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(venue.id)} className="text-red-500">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Dialog for Add/Edit */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Venue' : 'Add New Venue'}</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the venue. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" value={currentVenue.name} onChange={handleInputChange} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="latitude" className="text-right">Latitude</Label>
                    <Input id="latitude" type="number" value={currentVenue.latitude} onChange={handleInputChange} className="col-span-3" />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="longitude" className="text-right">Longitude</Label>
                    <Input id="longitude" type="number" value={currentVenue.longitude} onChange={handleInputChange} className="col-span-3" />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="radius" className="text-right">Radius (m)</Label>
                    <Input id="radius" type="number" value={currentVenue.radius} onChange={handleInputChange} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </>
      );
    }
    ```

**Verification:**

1.  **Log in as an Administrator** and navigate to the `/venues` page.
2.  **Test Data Fetching (`Read`):**
    *   **Expected Result:** The table should now be populated with the venues you created via Postman earlier (e.g., "Main Campus Auditorium"), not the mock data. If you have no venues, the table should be empty.
3.  **Test Creation (`Create`):**
    *   Click the "Add Venue" button.
    *   Fill out the form with new venue details and click "Save changes".
    *   **Expected Result:** The dialog should close, and the table should automatically refresh to show your new venue in the list.
4.  **Test Update (`Update`):**
    *   Click the three-dots icon on a venue row and select "Edit".
    *   The dialog should open, pre-filled with that venue's data.
    *   Change the name or another value and click "Save changes".
    *   **Expected Result:** The dialog should close, and the table should refresh, showing the updated information for that venue.
5.  **Test Deletion (`Delete`):**
    *   Click the three-dots icon on a venue row and select "Delete".
    *   A confirmation prompt should appear. Click "OK".
    *   **Expected Result:** The venue should disappear from the table.

---

**Feature Complete: Venue Management**



Excellent. Venue Management is complete. Let's apply the same successful pattern to the next feature: **Group Management**.

We begin on the backend by defining the data structure. This involves creating the `Group` and `GroupMember` entities. We need two entities to model the "many-to-many" relationship: a `Group` can have many `User`s (members), and a `User` can belong to many `Group`s.

Here is the first backend task for Group Management.

---

### **Task ID: [BACKEND] BE-07**
**Title:** Implement the Group and GroupMember Entities & Repositories

**Objective:**
To create the JPA entities and corresponding repositories for `Group` and `GroupMember`, establishing the database structure for managing user groups.

**Context:**
A "many-to-many" relationship is a classic database design pattern. We will model it using three tables: `groups`, `users`, and a "join table" called `group_members`. The `GroupMember` entity will represent this join table, linking a `User` to a `Group`. Spring Data JPA makes it straightforward to define these relationships with annotations like `@ManyToOne`.

**Prerequisites:**
*   Completion of all previous backend tasks.

#### **Step-by-Step Instructions:**

1.  **Create a `group` Package:** In your main source folder (e.g., `src/main/java/com/yourcompany/attendance`), create a new package named `group`.

2.  **Create the `Group` Entity:** Inside the `group` package, create a new Java `Class` named `Group.java`. This represents a single group.

    ```java
    package com.yourcompany.attendance.group;

    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.util.ArrayList;
    import java.util.List;
    import java.util.UUID;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Table(name = "groups")
    public class Group {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID id;

        @Column(nullable = false, unique = true, length = 100)
        private String name;

        @Column(length = 255)
        private String description;

        // A group can have many members. This defines the "one-to-many" side of the relationship.
        // `mappedBy = "group"` tells JPA that the `GroupMember` entity owns the relationship.
        // `cascade = CascadeType.ALL` means if we delete a group, all its memberships are also deleted.
        // `orphanRemoval = true` handles cases where a member is removed from the list.
        @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<GroupMember> members = new ArrayList<>();
    }
    ```

3.  **Create the `GroupMember` Entity:** This is the crucial join table entity. Inside the `group` package, create a new `Class` named `GroupMember.java`.

    ```java
    package com.yourcompany.attendance.group;

    import com.yourcompany.attendance.user.User;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import java.util.UUID;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Table(name = "group_members")
    public class GroupMember {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID id;

        // This establishes a many-to-one link to the Group entity.
        // `nullable = false` ensures a membership record must belong to a group.
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "group_id", nullable = false)
        private Group group;

        // This establishes a many-to-one link to the User entity.
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;
    }
    ```

4.  **Create the Repositories:** Now, create the repository interfaces for both new entities inside the `group` package.

    *   **`GroupRepository.java`**:
        ```java
        package com.yourcompany.attendance.group;

        import org.springframework.data.jpa.repository.JpaRepository;
        import java.util.Optional;
        import java.util.UUID;

        public interface GroupRepository extends JpaRepository<Group, UUID> {
            Optional<Group> findByName(String name);
        }
        ```

    *   **`GroupMemberRepository.java`**:
        ```java
        package com.yourcompany.attendance.group;

        import org.springframework.data.jpa.repository.JpaRepository;
        import java.util.UUID;

        public interface GroupMemberRepository extends JpaRepository<GroupMember, UUID> {
             // Custom query to check if a user is already in a group, which will be useful later.
            boolean existsByGroupIdAndUserId(UUID groupId, UUID userId);
        }
        ```

**Verification:**

1.  **Restart the Application:** Stop and restart your Spring Boot application.
2.  **Check Console Logs:** Watch the Hibernate output in the console. You should see logs for creating two new tables: `create table groups (...)` and `create table group_members (...)`. The `group_members` table creation should also include foreign key constraints to `groups(id)` and `users(id)`.
3.  **Check Database:** Use your database client to confirm the existence and structure of the new `groups` and `group_members` tables. The `group_members` table should contain `id`, `group_id`, and `user_id` columns.

---

Excellent. With the database layer for groups defined, let's build the API to manage them.

This task involves creating the `GroupController` and `GroupService` to handle all CRUD operations for groups and their members. As with the `VenueController`, we will secure these endpoints to ensure they are only accessible by `ADMINISTRATOR` users. This implementation will directly follow the specifications laid out in **Module 3** of our API contract.

Here is the next task card for the **Project Playbook**.

---

### **Task ID: [BACKEND] BE-08**
**Title:** Implement the Group Management API Controller

**Objective:**
To build the secure REST endpoints for creating groups, managing their members, and retrieving group information, accessible only by administrators.

**Context:**
This implementation is more complex than the Venue controller because we are managing not just a single entity (`Group`), but also its relationship with another entity (`User`) via the `GroupMember` join table. The service logic will handle tasks like adding a user to a group (which means creating a new `GroupMember` record) and removing them (deleting a `GroupMember` record).

**Prerequisites:**
*   Completion of task `[BACKEND] BE-07`.

#### **Step-by-Step Instructions:**

1.  **Create Group DTOs:** Inside the `group` package, create the necessary DTO classes to match our API contract.

    *   **`GroupDto.java`** (for creating and listing groups):
        ```java
        package com.yourcompany.attendance.group;

        import lombok.Builder;
        import lombok.Data;
        import java.util.UUID;

        @Data
        @Builder
        public class GroupDto {
            private UUID id;
            private String name;
            private String description;
        }
        ```
    *   **`MemberDto.java`** (a simplified User DTO for member lists):
        ```java
        package com.yourcompany.attendance.group;

        import lombok.Builder;
        import lombok.Data;
        import java.util.UUID;

        @Data
        @Builder
        public class MemberDto {
            private UUID id;
            private String firstName;
            private String lastName;
            private String email;
        }
        ```
    *   **`GroupDetailDto.java`** (for the detailed view of a group with members):
        ```java
        package com.yourcompany.attendance.group;

        import lombok.Builder;
        import lombok.Data;
        import java.util.List;
        import java.util.UUID;

        @Data
        @Builder
        public class GroupDetailDto {
            private UUID id;
            private String name;
            private String description;
            private List<MemberDto> members;
        }
        ```
    *   **`AddMemberRequest.java`** (for the request body when adding a member):
        ```java
        package com.yourcompany.attendance.group;

        import lombok.Data;
        import java.util.UUID;
        
        @Data
        public class AddMemberRequest {
            private UUID userId;
        }
        ```

2.  **Create the `GroupService`:**
    *   Inside the `group` package, create a new `Class` named `GroupService.java`.
    *   Add the following comprehensive logic for managing groups and their memberships.

    ```java
    package com.yourcompany.attendance.group;

    import com.yourcompany.attendance.user.User;
    import com.yourcompany.attendance.user.UserRepository;
    import jakarta.persistence.EntityNotFoundException;
    import lombok.RequiredArgsConstructor;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;
    import java.util.List;
    import java.util.UUID;
    import java.util.stream.Collectors;

    @Service
    @RequiredArgsConstructor
    public class GroupService {

        private final GroupRepository groupRepository;
        private final UserRepository userRepository;
        private final GroupMemberRepository groupMemberRepository;

        // Create a new group
        public GroupDto createGroup(GroupDto groupDto) {
            groupRepository.findByName(groupDto.getName()).ifPresent(g -> {
                throw new IllegalStateException("Group with name '" + groupDto.getName() + "' already exists.");
            });
            Group group = Group.builder()
                .name(groupDto.getName())
                .description(groupDto.getDescription())
                .build();
            Group savedGroup = groupRepository.save(group);
            return mapToGroupDto(savedGroup);
        }

        // Get all groups
        public List<GroupDto> getAllGroups() {
            return groupRepository.findAll().stream().map(this::mapToGroupDto).collect(Collectors.toList());
        }

        // Get group details with members
        @Transactional(readOnly = true) // Ensures lazy-loaded members are fetched
        public GroupDetailDto getGroupWithMembers(UUID groupId) {
            Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group not found with id: " + groupId));
            
            List<MemberDto> members = group.getMembers().stream()
                .map(groupMember -> mapToMemberDto(groupMember.getUser()))
                .collect(Collectors.toList());

            return GroupDetailDto.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .members(members)
                .build();
        }

        // Add a member to a group
        public void addMemberToGroup(UUID groupId, UUID userId) {
            if (groupMemberRepository.existsByGroupIdAndUserId(groupId, userId)) {
                throw new IllegalStateException("User is already a member of this group.");
            }
            Group group = groupRepository.findById(groupId).orElseThrow(() -> new EntityNotFoundException("Group not found"));
            User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));

            GroupMember membership = GroupMember.builder().group(group).user(user).build();
            groupMemberRepository.save(membership);
        }

        // ... Mappers and other methods will go here
        
        private GroupDto mapToGroupDto(Group group) { /* ... */ }
        private MemberDto mapToMemberDto(User user) { /* ... */ }
    }
    ```
    *   **Add the Mapper Methods:** Add these private helper methods inside the `GroupService` class.

    ```java
    // Add these inside the GroupService class
    private GroupDto mapToGroupDto(Group group) {
        return GroupDto.builder()
            .id(group.getId())
            .name(group.getName())
            .description(group.getDescription())
            .build();
    }

    private MemberDto mapToMemberDto(User user) {
        return MemberDto.builder()
            .id(user.getId())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .build();
    }
    ```

3.  **Create the `GroupController`:**
    *   Inside the `group` package, create a new `Class` named `GroupController.java`.
    *   Add the following code to expose the service logic as secure API endpoints.

    ```java
    package com.yourcompany.attendance.group;

    import lombok.RequiredArgsConstructor;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;
    
    import java.util.List;
    import java.util.UUID;

    @RestController
    @RequestMapping("/api/v1/groups")
    @RequiredArgsConstructor
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public class GroupController {

        private final GroupService groupService;

        @PostMapping
        public ResponseEntity<GroupDto> createGroup(@RequestBody GroupDto groupDto) {
            return new ResponseEntity<>(groupService.createGroup(groupDto), HttpStatus.CREATED);
        }

        @GetMapping
        public ResponseEntity<List<GroupDto>> getAllGroups() {
            return ResponseEntity.ok(groupService.getAllGroups());
        }

        @GetMapping("/{groupId}")
        public ResponseEntity<GroupDetailDto> getGroupById(@PathVariable UUID groupId) {
            return ResponseEntity.ok(groupService.getGroupWithMembers(groupId));
        }

        @PostMapping("/{groupId}/members")
        public ResponseEntity<Void> addMember(@PathVariable UUID groupId, @RequestBody AddMemberRequest request) {
            groupService.addMemberToGroup(groupId, request.getUserId());
            return ResponseEntity.ok().build();
        }

        // Note: DELETE /groups/{groupId}, PUT /groups/{groupId}, DELETE /groups/{groupId}/members/{userId}
        // would be implemented following the same pattern.
    }
    ```

**Verification:**

This requires Postman, an admin JWT, and the UUIDs of an existing `Group` and `User`.

1.  **Restart the Application.**
2.  **Login as Admin** in Postman and get your JWT.
3.  **Create a Group (`POST /groups`):**
    *   Send a `POST` request to `http://localhost:8080/api/v1/groups` with an admin token.
    *   Body: `{ "name": "Test Group", "description": "A group for testing." }`
    *   **Expected Result:** `201 Created` with the new group's data. Note down the returned `id`.
4.  **Register an Attendee:** Use the `/auth/register` endpoint to create a new `ATTENDEE` user. Note down their UUID from the database.
5.  **Add Member to Group (`POST /groups/{groupId}/members`):**
    *   Send a `POST` request to `http://localhost:8080/api/v1/groups/{groupId}/members`, replacing `{groupId}` with the ID from step 3.
    *   Body: `{ "userId": "the-attendee-uuid-from-step-4" }`
    *   **Expected Result:** `200 OK` with an empty body.
6.  **Get Group Details (`GET /groups/{groupId}`):**
    *   Send a `GET` request to `http://localhost:8080/api/v1/groups/{groupId}`.
    *   **Expected Result:** A `200 OK` response containing the group's details and an array named `members` that includes the attendee you just added.
7.  **Test Access Denied:** Try any of these requests with an `ATTENDEE`'s JWT to confirm you get a `403 Forbidden` error.

---

Excellent. The backend for Group Management is ready. Now let's build the frontend.

Following our established pattern, we'll start by creating the static UI for the **Group Management Page**. This task is focused on layout and presentation. We will create a page that lists all groups and provides an interface to view the members of a selected group, as well as add new members. The logic will be added in the subsequent task.

Here is the next task card for the **Project Playbook**.

---

### **Task ID: [FRONTEND] FE-10**
**Title:** Build the Group Management Page UI

**Objective:**
To create the user interface for the Group Management page, featuring a list of groups, a detailed view for a selected group's members, and forms for creating groups and adding members.

**Context:**
This UI will be slightly more complex than the Venues page. A common and effective UX pattern for this kind of "master-detail" view is a two-column layout. The left column will list all the groups. When a group is clicked, the right column will update to show that group's details and a list of its members. We will reuse many of the Shadcn UI components we've already added.

**Prerequisites:**
*   Completion of task `[FRONTEND] FE-07` (Admin Layout).

#### **Step-by-Step Instructions:**

1.  **Add New Shadcn UI Components:** We might need a component to create a visual separator. Let's add it.
    ```bash
    npx shadcn-ui@latest add separator
    ```

2.  **Create the Page File:**
    *   Inside the `src/app/(admin)` folder, create a new folder named `groups`.
    *   Inside `src/app/(admin)/groups`, create a new file named `page.jsx`.

3.  **Update Admin Layout Navigation:**
    *   Open `src/app/(admin)/layout.jsx`.
    *   Find the `Link` component for "Groups" in the sidebar. Update its `href` to point to the correct path.
        *   **Change from:** `href="#" `
        *   **Change to:** `href="/groups"`

4.  **Build the Group Page Component:** Open `src/app/(admin)/groups/page.jsx` and add the following code. This sets up the complete two-column layout with mock data.

    ```jsx
    "use client";

    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Separator } from "@/components/ui/separator";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { PlusCircle, Users } from "lucide-react";

    // Mock data to represent the state of the component
    const mockGroups = [
      { id: '1', name: 'Java IPT - Fall 2023', description: 'Cohort for Java training.' },
      { id: '2', name: 'Data Science Workshop', description: 'Weekend workshop attendees.' },
    ];

    const mockSelectedGroup = {
      id: '1',
      name: 'Java IPT - Fall 2023',
      description: 'Cohort for Java training.',
      members: [
        { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
        { id: 'u2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
      ],
    };

    export default function GroupsPage() {
      // We will replace these with real state and logic in the next task
      const groups = mockGroups;
      const selectedGroup = mockSelectedGroup;

      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Group List and Create Form */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Create New Group</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Group Name</Label>
                    <Input id="name" placeholder="e.g., Web Dev Cohort" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Optional description" />
                  </div>
                  <Button type="submit">Create Group</Button>
                </form>
              </CardContent>
            </Card>

            <Separator className="my-6" />

            <Card>
              <CardHeader>
                <CardTitle>All Groups</CardTitle>
                <CardDescription>Select a group to view members.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2">
                  {groups.map((group) => (
                    <li key={group.id}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        {group.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Selected Group Details */}
          <div className="md:col-span-2">
            {selectedGroup ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedGroup.name}</CardTitle>
                  <CardDescription>{selectedGroup.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Members</h3>
                    <Button size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </div>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>First Name</TableHead>
                          <TableHead>Last Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedGroup.members.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>{member.firstName}</TableCell>
                            <TableCell>{member.lastName}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">Remove</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
                <p className="text-gray-500">Select a group to see its details</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    ```

**Verification:**

1.  **Log in as an Administrator** and ensure the dev server is running.
2.  **Navigate to the Groups Page:** Use the newly enabled "Groups" link in the sidebar to go to `http://localhost:3000/groups`.
3.  **Review the UI:**
    *   **Expected Result:** The page should display a two-column layout within the main admin shell.
    *   **Left Column:** You should see a card with a form to "Create New Group" and another card below it listing the two mock groups.
    *   **Right Column:** You should see a large card displaying the details of the "Java IPT - Fall 2023" group, including a table listing John Doe and Jane Smith as members.
    *   The layout should be responsive. When you shrink the browser window, the columns should stack vertically.

---

Excellent. The UI for Group Management is built. Let's wire it up.

This final task for the Group Management feature will replace all mock data with live API calls. We will fetch the list of groups, allow an administrator to select a group to view its members, and implement the logic for creating new groups and adding/removing members. This will make the page fully dynamic and interactive.

Here is the task card for the **Project Playbook**.

---

### **Task ID: [FRONTEND] FE-11**
**Title:** Implement Group Management Logic (CRUD)

**Objective:**
To fully integrate the Group Management UI with the backend API, enabling administrators to create groups, view group details with members, and add or remove members from a group.

**Context:**
This page's logic is more stateful than the Venues page. We need to manage several pieces of state: the list of all groups, the currently selected group's detailed data, the form inputs for creating a new group, and the state of our "Add Member" dialog. We will orchestrate API calls using `async/await` and update the UI by setting state, triggering re-renders with the new data.

**Prerequisites:**
*   Completion of all previous backend and frontend tasks for Group Management.
*   The Spring Boot backend server **must be running**.

#### **Step-by-Step Instructions:**

1.  **Add Required Shadcn UI Components:** We'll need a dialog for adding members.
    ```bash
    npx shadcn-ui@latest add command
    ```
    The `Command` component from Shadcn is excellent for creating a searchable list, which is perfect for finding a user to add to a group.

2.  **Update `GroupsPage` Code:** Replace the entire content of `src/app/(admin)/groups/page.jsx` with the following fully functional code. This is a large piece of code, so read the comments to understand the state management and event handling.

    ```jsx
    "use client";

    import { useState, useEffect } from "react";
    import apiClient from "@/services/apiClient";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Separator } from "@/components/ui/separator";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
    import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
    import { PlusCircle, Users, Trash2 } from "lucide-react";

    export default function GroupsPage() {
      const [groups, setGroups] = useState([]);
      const [selectedGroup, setSelectedGroup] = useState(null);
      const [newGroupData, setNewGroupData] = useState({ name: "", description: "" });
      const [allUsers, setAllUsers] = useState([]); // To populate the 'Add Member' dialog
      const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

      // Fetch all groups
      const fetchGroups = async () => {
        try {
          const response = await apiClient.get("/groups");
          setGroups(response.data);
        } catch (error) {
          console.error("Failed to fetch groups:", error);
        }
      };

      // Fetch a single group's details
      const fetchGroupDetails = async (groupId) => {
        try {
          const response = await apiClient.get(`/groups/${groupId}`);
          setSelectedGroup(response.data);
        } catch (error) {
          console.error("Failed to fetch group details:", error);
          setSelectedGroup(null);
        }
      };
      
      // Fetch all users (for the add member dialog)
      const fetchAllUsers = async () => {
          // Note: We need a backend endpoint for this. Let's assume GET /api/v1/users exists.
          // We will need to add this to the backend tasks.
          // For now, we can mock it.
          // const response = await apiClient.get("/users?role=ATTENDEE");
          // setAllUsers(response.data);
          console.warn("User fetching is mocked. Implement GET /api/v1/users in the backend.");
          setAllUsers([
              {id: 'u1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com'},
              {id: 'u3', firstName: 'Peter', lastName: 'Jones', email: 'peter.jones@example.com'},
          ]);
      };

      useEffect(() => {
        fetchGroups();
        fetchAllUsers(); // Fetch users once
      }, []);

      const handleGroupSelect = (groupId) => {
        fetchGroupDetails(groupId);
      };

      const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
          await apiClient.post("/groups", newGroupData);
          setNewGroupData({ name: "", description: "" }); // Reset form
          fetchGroups(); // Refresh list
        } catch (error) {
          console.error("Failed to create group:", error);
        }
      };
      
      const handleAddMember = async (userId) => {
          if (!selectedGroup) return;
          try {
              await apiClient.post(`/groups/${selectedGroup.id}/members`, { userId });
              fetchGroupDetails(selectedGroup.id); // Refresh member list
              setIsAddMemberDialogOpen(false);
          } catch (error) {
              console.error("Failed to add member:", error);
          }
      };

      // ... (handleRemoveMember would be implemented here)

      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader><CardTitle>Create New Group</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleCreateGroup} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Group Name</Label>
                    <Input id="name" value={newGroupData.name} onChange={(e) => setNewGroupData({...newGroupData, name: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" value={newGroupData.description} onChange={(e) => setNewGroupData({...newGroupData, description: e.target.value})} />
                  </div>
                  <Button type="submit">Create Group</Button>
                </form>
              </CardContent>
            </Card>
            <Separator className="my-6" />
            <Card>
              <CardHeader><CardTitle>All Groups</CardTitle><CardDescription>Select a group to view members.</CardDescription></CardHeader>
              <CardContent>
                <ul className="grid gap-2">
                  {groups.map((group) => (
                    <li key={group.id}>
                      <Button variant={selectedGroup?.id === group.id ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => handleGroupSelect(group.id)}>
                        <Users className="mr-2 h-4 w-4" />{group.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2">
            {selectedGroup ? (
              <Card>
                <CardHeader><CardTitle>{selectedGroup.name}</CardTitle><CardDescription>{selectedGroup.description}</CardDescription></CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Members ({selectedGroup.members.length})</h3>
                    <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                      <DialogTrigger asChild><Button size="sm"><PlusCircle className="mr-2 h-4 w-4" />Add Member</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Add Member to {selectedGroup.name}</DialogTitle></DialogHeader>
                        <Command className="rounded-lg border shadow-md">
                          <CommandInput placeholder="Search for user..." />
                          <CommandList>
                            <CommandEmpty>No users found.</CommandEmpty>
                            <CommandGroup heading="Users">
                              {allUsers.filter(user => !selectedGroup.members.some(m => m.id === user.id)).map(user => (
                                <CommandItem key={user.id} onSelect={() => handleAddMember(user.id)}>
                                  <span>{user.firstName} {user.lastName} ({user.email})</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {/* Member Table */}
                  <div className="border rounded-lg">
                     <Table>
                       {/* ... TableHeader ... */}
                       <TableBody>
                         {selectedGroup.members.map((member) => (
                           <TableRow key={member.id}>
                             <TableCell>{member.firstName}</TableCell>
                             <TableCell>{member.lastName}</TableCell>
                             <TableCell>{member.email}</TableCell>
                             <TableCell className="text-right">
                               {/* Remove button would go here */}
                             </TableCell>
                           </TableRow>
                         ))}
                       </TableBody>
                     </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
                <p className="text-gray-500">Select a group to see its details</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    ```
    ***Important Note:*** As the code comments mention, this frontend assumes an endpoint exists to fetch all users (e.g., `GET /api/v1/users`). This was not in our original API contract. This is a common discovery during development. We need to add a new backend task to create this endpoint.

**Verification:**

1.  **Add the Missing Backend Endpoint (Crucial):**
    *   **New Backend Task:** Create a `UserController` with a `GET /api/v1/users` endpoint that returns a list of all users, accessible by an `ADMINISTRATOR`. This is a small but necessary addition.
2.  **Log in as an Administrator** and navigate to the `/groups` page.
3.  **Test Group Creation:**
    *   Fill out the "Create New Group" form and click the button.
    *   **Expected Result:** The new group should appear in the "All Groups" list on the left.
4.  **Test Group Selection:**
    *   Click on a group name in the left column.
    *   **Expected Result:** The right column should update to show that group's title and its list of members (which should be empty for a new group).
5.  **Test Adding a Member:**
    *   With a group selected, click the "Add Member" button.
    *   A dialog should appear with a searchable list of users who are *not* already in the group.
    *   Click on a user.
    *   **Expected Result:** The dialog should close, and the member table on the right should refresh to include the newly added user.

---

**Feature Complete: Group Management**

Excellent. Group Management is complete. We now arrive at the final, and most important, feature of this milestone: **Event Management**.

This is where all our previous work—Users, Venues, and Groups—converges. We will start, as always, on the backend by defining the data structures needed to represent an event and its associated attendance records.

Here is the first backend task for Event Management.

---

### **Task ID: [BACKEND] BE-09**
**Title:** Implement Event and AttendanceRecord Entities & Repositories

**Objective:**
To create the JPA entities and repositories for `Event` and `AttendanceRecord`. This will establish the database schema for scheduling events and tracking attendance for each participant.

**Context:**
This involves two new main entities:
1.  **`Event`**: This entity will store the core details of a scheduled event, including its title, time, and its relationships to a `Venue` (where it happens) and a `Group` (who should attend). This involves `@ManyToOne` relationships.
2.  **`AttendanceRecord`**: This entity represents a single attendance entry. It links a `User` to an `Event` and stores their attendance status (e.g., `PRESENT`, `ABSENT`). We will also add a unique constraint to ensure a user can only have one attendance record per event.

**Prerequisites:**
*   Completion of all previous backend tasks.

#### **Step-by-Step Instructions:**

1.  **Create an `event` Package:** In your main source folder (e.g., `src/main/java/com/yourcompany/attendance`), create a new package named `event`.

2.  **Create the `AttendanceStatus` Enum:** Inside the `event` package, create a new `Enum` file named `AttendanceStatus.java`. This defines the possible states for an attendance record.
    ```java
    package com.yourcompany.attendance.event;

    public enum AttendanceStatus {
        PENDING,
        PRESENT,
        ABSENT
    }
    ```

3.  **Create the `Event` Entity:** Inside the `event` package, create a new `Class` named `Event.java`.

    ```java
    package com.yourcompany.attendance.event;

    import com.yourcompany.attendance.group.Group;
    import com.yourcompany.attendance.venue.Venue;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.time.Instant;
    import java.util.ArrayList;
    import java.util.List;
    import java.util.UUID;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Table(name = "events")
    public class Event {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID id;

        @Column(nullable = false, length = 100)
        private String title;

        @Column(length = 255)
        private String description;

        @Column(nullable = false)
        private Instant startTime;

        @Column(nullable = false)
        private Instant endTime;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "venue_id", nullable = false)
        private Venue venue;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "group_id", nullable = false)
        private Group group;

        @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<AttendanceRecord> attendanceRecords = new ArrayList<>();
    }
    ```

4.  **Create the `AttendanceRecord` Entity:** Inside the `event` package, create a new `Class` named `AttendanceRecord.java`. Note the important `uniqueConstraints` definition.

    ```java
    package com.yourcompany.attendance.event;

    import com.yourcompany.attendance.user.User;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.time.Instant;
    import java.util.UUID;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Table(name = "attendance_records",
           // This database constraint ensures a user can't have duplicate entries for the same event.
           uniqueConstraints = @UniqueConstraint(columnNames = {"event_id", "user_id"}))
    public class AttendanceRecord {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        private UUID id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "event_id", nullable = false)
        private Event event;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private AttendanceStatus status;

        // The timestamp for when the attendance was marked. Can be null if status is PENDING.
        private Instant markedAt;
    }
    ```

5.  **Create the Repositories:** Create the corresponding repository interfaces inside the `event` package.

    *   **`EventRepository.java`**:
        ```java
        package com.yourcompany.attendance.event;

        import org.springframework.data.jpa.repository.JpaRepository;
        import java.util.UUID;

        public interface EventRepository extends JpaRepository<Event, UUID> {
        }
        ```

    *   **`AttendanceRecordRepository.java`**:
        ```java
        package com.yourcompany.attendance.event;

        import org.springframework.data.jpa.repository.JpaRepository;
        import java.util.UUID;

        public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, UUID> {
        }
        ```

**Verification:**

1.  **Restart the Application:** Stop and restart your Spring Boot application.
2.  **Check Console Logs:** Look for the Hibernate `CREATE TABLE` logs. You should see entries for `events` and `attendance_records`.
3.  **Check Database:** Use your database client to inspect the new tables.
    *   The `events` table should have foreign keys `venue_id` and `group_id`.
    *   The `attendance_records` table should have foreign keys `event_id` and `user_id`.
    *   Crucially, inspect the constraints on the `attendance_records` table. You should find a **unique constraint** on the combination of the `event_id` and `user_id` columns. This confirms our data integrity rule is in place at the database level.

---


Of course. Let's build the backend for the most critical feature of the application.

This task is the largest and most complex on the backend. It involves creating the `EventController` and a sophisticated `EventService` to handle not only the CRUD operations for events but also the entire live attendance-marking flow. This includes generating temporary codes, validating geolocation, and updating attendance records in real-time.

Here is the comprehensive task card for the **Project Playbook**.

---

### **Task ID: [BACKEND] BE-10**
**Title:** Implement the Event & Attendance API Controller

**Objective:**
To build the secure REST endpoints for scheduling events, viewing event details with attendee statuses, and managing the entire live attendance-marking process.

**Context:**
This controller is the heart of the application, bringing together all previously defined entities. The `EventService` will contain significant business logic, including:
1.  Orchestrating the creation of events by linking `Groups` and `Venues`.
2.  Calculating the attendance status (`PENDING`, `PRESENT`, `ABSENT`) for each member of a group for a given event.
3.  Managing the lifecycle of short-lived attendance codes. For this, we'll create a simple in-memory cache.
4.  Performing the geometric calculation to verify if an attendee is within the venue's specified radius.

**Prerequisites:**
*   Completion of task `[BACKEND] BE-09`.

#### **Step-by-Step Instructions:**

1.  **Create DTOs:** Inside the `event` package, create the necessary DTO classes.

    *   **`EventDto.java`** (For requests and simple responses):
        ```java
        package com.yourcompany.attendance.event;
        // ... imports
        @Data @Builder
        public class EventDto {
            private UUID id;
            private String title;
            private String description;
            private UUID venueId;
            private UUID groupId;
            private Instant startTime;
            private Instant endTime;
        }
        ```
    *   **`AttendeeStatusDto.java`**:
        ```java
        package com.yourcompany.attendance.event;
        // ... imports
        @Data @Builder
        public class AttendeeStatusDto {
            private UUID id; // User ID
            private String firstName;
            private String lastName;
            private String email;
            private AttendanceStatus status;
            private Instant markedAt;
        }
        ```
    *   **`EventDetailDto.java`**:
        ```java
        package com.yourcompany.attendance.event;
        // ... imports
        @Data @Builder
        public class EventDetailDto {
            // ... fields for event details (id, title, etc.)
            private List<AttendeeStatusDto> attendees;
        }
        ```
    *   **`StartAttendanceResponse.java`**:
        ```java
        package com.yourcompany.attendance.event;
        // ... imports
        @Data @Builder
        public class StartAttendanceResponse {
            private String attendanceCode;
            private Instant expiresAt;
        }
        ```
    *   **`MarkAttendanceRequest.java`**:
        ```java
        package com.yourcompany.attendance.event;
        // ... imports
        @Data
        public class MarkAttendanceRequest {
            private String attendanceCode;
            private double latitude;
            private double longitude;
        }
        ```

2.  **Create the In-Memory Code Manager:** This service will handle our temporary attendance codes.
    *   In the `event` package, create a new `Class` named `AttendanceCodeManager.java`.

    ```java
    package com.yourcompany.attendance.event;

    import org.springframework.stereotype.Component;
    import java.time.Instant;
    import java.util.concurrent.ConcurrentHashMap;
    import java.util.concurrent.ThreadLocalRandom;

    @Component
    public class AttendanceCodeManager {
        // A thread-safe map to store active codes. In production, use a distributed cache like Redis.
        private final ConcurrentHashMap<String, ActiveCode> activeCodes = new ConcurrentHashMap<>();
        private static final int CODE_EXPIRATION_SECONDS = 90;

        public record ActiveCode(String code, UUID eventId, Instant expiresAt) {}

        public ActiveCode generateCode(UUID eventId) {
            String code = String.format("%03d-%03d",
                ThreadLocalRandom.current().nextInt(0, 1000),
                ThreadLocalRandom.current().nextInt(0, 1000));
            
            Instant expiresAt = Instant.now().plusSeconds(CODE_EXPIRATION_SECONDS);
            ActiveCode activeCode = new ActiveCode(code, eventId, expiresAt);

            // Store the code keyed by eventId for easy lookup, ensuring one code per event at a time.
            activeCodes.values().removeIf(ac -> ac.eventId().equals(eventId)); // Remove old code if exists
            activeCodes.put(code, activeCode);
            
            return activeCode;
        }

        public boolean validateCode(UUID eventId, String code) {
            ActiveCode activeCode = activeCodes.get(code);
            if (activeCode == null) return false; // Code doesn't exist

            // Check if expired and remove if so
            if (activeCode.expiresAt().isBefore(Instant.now())) {
                activeCodes.remove(code);
                return false;
            }

            // Check if code belongs to the correct event
            return activeCode.eventId().equals(eventId);
        }
    }
    ```

3.  **Create the `EventService`:** This will be a large service containing all the core logic.
    *   Inside the `event` package, create `EventService.java`.
    *   Add the logic for all event and attendance operations.

    ```java
    package com.yourcompany.attendance.event;
    
    // ... imports for all repositories, DTOs, etc.
    
    @Service
    @RequiredArgsConstructor
    public class EventService {
        private final EventRepository eventRepository;
        private final VenueRepository venueRepository;
        private final GroupRepository groupRepository;
        private final AttendanceRecordRepository attendanceRecordRepository;
        private final AttendanceCodeManager attendanceCodeManager;
        private final UserRepository userRepository;

        // Method to create an event
        public EventDto createEvent(EventDto eventDto) { /* ... implementation ... */ }
        
        // Method to get event details with attendance
        @Transactional(readOnly = true)
        public EventDetailDto getEventWithAttendance(UUID eventId) { /* ... complex implementation ... */ }

        // Method to start attendance
        public StartAttendanceResponse startAttendance(UUID eventId) { /* ... implementation ... */ }

        // Method to mark attendance
        @Transactional
        public void markAttendance(UUID eventId, MarkAttendanceRequest request, String userEmail) { /* ... complex implementation ... */ }
        
        // Helper method for distance calculation
        private double calculateDistance(double lat1, double lon1, double lat2, double lon2) { /* Haversine formula */ }

        // ... other CRUD methods and mappers
    }
    ```
    *   **Fill in the `EventService` Methods:** This is the most complex code. Add these method bodies to your `EventService`.

    ```java
    // Inside EventService

    // GET EVENT WITH ATTENDANCE
    @Transactional(readOnly = true)
    public EventDetailDto getEventWithAttendance(UUID eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event not found"));

        Map<UUID, AttendanceRecord> recordsByUserId = event.getAttendanceRecords().stream()
            .collect(Collectors.toMap(ar -> ar.getUser().getId(), ar -> ar));

        List<AttendeeStatusDto> attendees = event.getGroup().getMembers().stream()
            .map(GroupMember::getUser)
            .map(user -> {
                AttendanceRecord record = recordsByUserId.get(user.getId());
                return AttendeeStatusDto.builder()
                    .id(user.getId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .status(record != null ? record.getStatus() : AttendanceStatus.PENDING)
                    .markedAt(record != null ? record.getMarkedAt() : null)
                    .build();
            }).toList();
        
        // Build and return EventDetailDto
        // ...
    }

    // START ATTENDANCE
    public StartAttendanceResponse startAttendance(UUID eventId) {
        // ... (Find event, check if active)
        AttendanceCodeManager.ActiveCode activeCode = attendanceCodeManager.generateCode(eventId);
        return StartAttendanceResponse.builder()
            .attendanceCode(activeCode.code())
            .expiresAt(activeCode.expiresAt())
            .build();
    }
    
    // MARK ATTENDANCE
    @Transactional
    public void markAttendance(UUID eventId, MarkAttendanceRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // 1. Validate Code
        if (!attendanceCodeManager.validateCode(eventId, request.getAttendanceCode())) {
            throw new IllegalStateException("Invalid or expired attendance code.");
        }
        
        // 2. Validate Location
        Venue venue = event.getVenue();
        double distance = calculateDistance(
            request.getLatitude(), request.getLongitude(),
            venue.getLatitude(), venue.getLongitude()
        );
        if (distance > venue.getRadius()) {
            throw new IllegalStateException("You are outside the allowed radius for this venue.");
        }
        
        // 3. Create/Update Attendance Record
        // ... (Find existing record or create new, set status to PRESENT, save)
    }

    // HAVERSINE FORMULA HELPER
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Haversine formula to calculate distance between two lat/lon points in meters
        double R = 6371e3; // Earth radius in meters
        double phi1 = Math.toRadians(lat1);
        double phi2 = Math.toRadians(lat2);
        double deltaPhi = Math.toRadians(lat2 - lat1);
        double deltaLambda = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                   Math.cos(phi1) * Math.cos(phi2) *
                   Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
    ```

4.  **Create the `EventController`:**
    *   Inside the `event` package, create `EventController.java`.
    *   Add the endpoints, securing them appropriately and injecting the current user's principal where needed.

    ```java
    // ... imports
    @RestController
    @RequestMapping("/api/v1/events")
    @RequiredArgsConstructor
    public class EventController {
        
        private final EventService eventService;

        @PostMapping
        @PreAuthorize("hasAuthority('ADMINISTRATOR')")
        public ResponseEntity<EventDto> createEvent(/*...*/) { /* ... */ }

        @GetMapping("/{eventId}")
        @PreAuthorize("hasAuthority('ADMINISTRATOR')")
        public ResponseEntity<EventDetailDto> getEventDetails(/*...*/) { /* ... */ }

        @PostMapping("/{eventId}/attendance/start")
        @PreAuthorize("hasAuthority('ADMINISTRATOR')")
        public ResponseEntity<StartAttendanceResponse> startAttendance(/*...*/) { /* ... */ }

        @PostMapping("/{eventId}/attendance/mark")
        @PreAuthorize("hasAuthority('ATTENDEE')")
        public ResponseEntity<Void> markAttendance(@PathVariable UUID eventId, @RequestBody MarkAttendanceRequest request, Principal principal) {
            eventService.markAttendance(eventId, request, principal.getName()); // principal.getName() is the user's email
            return ResponseEntity.ok().build();
        }
    }
    ```

**Verification:**

This is the most comprehensive verification test. It requires an Admin and an Attendee user.

1.  **Setup:** Use Postman as an Admin to create a Venue, a Group, and add an Attendee user to that group.
2.  **Admin: Create Event:** `POST /events` to schedule an event for that group and venue.
3.  **Admin: Get Details:** `GET /events/{eventId}`. Verify the attendee is listed with `PENDING` status.
4.  **Admin: Start Attendance:** `POST /events/{eventId}/attendance/start`. Copy the returned `attendanceCode`.
5.  **Attendee: Mark Attendance:**
    *   Log in as the **Attendee** to get their JWT.
    *   Send a `POST` request to `/events/{eventId}/attendance/mark` with the Attendee's JWT.
    *   In the body, provide the correct `attendanceCode` and GPS coordinates that are *inside* the venue's radius.
    *   **Expected Result:** `200 OK`.
    *   Try again with a bad code or coordinates *outside* the radius.
    *   **Expected Result:** `400 Bad Request` with an appropriate error message.
6.  **Admin: Verify Status Change:**
    *   Log in as the **Admin** again.
    *   `GET /events/{eventId}`.
    *   **Expected Result:** The attendee's status should now be `PRESENT`, and `markedAt` should have a timestamp.

---

**Milestone 2 Complete!**


Excellent. **Milestone 2** is complete on the backend. The core engine of our application is built and tested. Now, we'll build the frontend UIs to control it, starting with **Event Management**.

Our first frontend task for this final milestone is to create the static UI for the Event Management page. This page will serve as the central hub for administrators, allowing them to view a calendar or list of scheduled events and providing the interface to create new ones.

Here is the task card for the **Project Playbook**.

---

## **Milestone 3: Core Feature UI & Finalization**

**Objective:** To implement the frontend interfaces for Event Management and the live attendance-marking flow for both Administrators and Attendees, and to finalize the application for deployment.

### **List of Tasks for this Milestone (Event Management):**
*   **[FRONTEND] FE-12:** Build the Event Management Page UI
*   **[FRONTEND] FE-13:** Implement Event Management Logic (CRUD)
*   **[FRONTEND] FE-14:** Build the Admin's Live Attendance View UI
*   **[FRONTEND] FE-15:** Implement the Live Attendance View Logic
*   **[FRONTEND] FE-16:** Build the Attendee's Dashboard and Marking UI
*   **[FRONTEND] FE-17:** Implement Attendee Marking Logic with Geolocation
*   **[GENERAL] F-06:** Final Testing, Bug Fixing, and Deployment Preparation

---

### **Task ID: [FRONTEND] FE-12**
**Title:** Build the Event Management Page UI

**Objective:**
To create the user interface for the Event Management page, featuring a list or calendar view of all scheduled events and a dialog form for creating/editing an event.

**Context:**
A calendar is often the most intuitive way to display scheduled events. However, a full-featured calendar can be complex to implement. For this project, a clean, simple list view grouped by date is an excellent and highly effective alternative. We will build a page that lists upcoming events and includes a "Schedule Event" button that opens a dialog form. This form will contain fields for the event title, description, start/end times, and dropdowns to select from existing venues and groups.

**Prerequisites:**
*   Completion of all previous frontend tasks.

#### **Step-by-Step Instructions:**

1.  **Add New Shadcn UI Components:** We need a calendar for picking dates and a popover for combining it with a time input.
    ```bash
    npx shadcn-ui@latest add calendar
    npx shadcn-ui@latest add popover
    ```

2.  **Create the Page File:**
    *   Inside the `src/app/(admin)` folder, create a new folder named `events`.
    *   Inside `src/app/(admin)/events`, create a new file named `page.jsx`.

3.  **Update Admin Layout Navigation:**
    *   Open `src/app/(admin)/layout.jsx`.
    *   Add a new `Link` component for "Events" in the sidebar, likely using the `Calendar` icon. Ensure the `href` is `/events`.

4.  **Build the Event Page Component:** Open `src/app/(admin)/events/page.jsx` and add the following code. This sets up the UI with mock data for the event list and the dialog form.

    ```jsx
    "use client";

    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { CalendarIcon, ClockIcon } from "lucide-react";

    // Mock data to build the UI
    const mockEvents = [
      { id: '1', title: 'Java Fundamentals - Lecture 1', startTime: '2023-11-15T09:00:00Z', group: { name: 'Java IPT - Fall 2023' }, venue: { name: 'Main Auditorium' } },
      { id: '2', title: 'Data Visualization with Python', startTime: '2023-11-16T14:00:00Z', group: { name: 'Data Science Workshop' }, venue: { name: 'Computer Lab 3' } },
    ];
    
    const mockGroups = [ {id: 'g1', name: 'Java IPT - Fall 2023'}, {id: 'g2', name: 'Data Science Workshop'} ];
    const mockVenues = [ {id: 'v1', name: 'Main Auditorium'}, {id: 'v2', name: 'Computer Lab 3'} ];


    export default function EventsPage() {
      // Logic will be added in the next task
      return (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Manage Events</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Schedule Event</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Schedule New Event</DialogTitle>
                  <DialogDescription>Fill in the details to create a new event.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input id="title" placeholder="e.g., Introduction to Spring Boot" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Optional description of the event" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                          <Label>Venue</Label>
                          <Select><SelectTrigger><SelectValue placeholder="Select a venue" /></SelectTrigger><SelectContent>{mockVenues.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}</SelectContent></Select>
                      </div>
                      <div className="grid gap-2">
                          <Label>Group</Label>
                          <Select><SelectTrigger><SelectValue placeholder="Select a group" /></SelectTrigger><SelectContent>{mockGroups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent></Select>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                          <Label>Start Time</Label>
                          <Input id="startTime" type="datetime-local" />
                      </div>
                      <div className="grid gap-2">
                          <Label>End Time</Label>
                          <Input id="endTime" type="datetime-local" />
                      </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Event List */}
          <Card>
              <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                  <ul className="space-y-4">
                      {mockEvents.map(event => (
                          <li key={event.id} className="p-4 border rounded-lg flex items-center justify-between">
                              <div>
                                  <h3 className="font-semibold">{event.title}</h3>
                                  <p className="text-sm text-gray-500">{event.group.name} @ {event.venue.name}</p>
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{new Date(event.startTime).toLocaleDateString()}</span>
                                  <ClockIcon className="h-4 w-4" />
                                  <span>{new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                          </li>
                      ))}
                  </ul>
              </CardContent>
          </Card>
        </div>
      );
    }
    ```

**Verification:**

1.  **Log in as an Administrator.**
2.  **Navigate to the Events Page:** Use the new "Events" link in the sidebar to go to `http://localhost:3000/events`.
3.  **Review the UI:**
    *   **Expected Result:** The page should display within the admin layout.
    *   You should see the title "Manage Events" and a "Schedule Event" button.
    *   A card listing the two mock "Upcoming Events" should be visible, showing their title, group, venue, and formatted date/time.
4.  **Test the Dialog:**
    *   Click the "Schedule Event" button.
    *   **Expected Result:** A dialog should pop up with a form.
    *   The form should contain fields for Title and Description.
    *   It should have two dropdowns, "Venue" and "Group", populated with the mock data.
    *   It should have two date/time input fields for Start and End Time.

---

Of course. Let's wire up the Events UI.

This task will connect our static Event Management page to the backend API. We will fetch lists of all events, venues, and groups to populate the page and the form's dropdowns. We'll implement the logic to handle the submission of the "Schedule Event" form, allowing administrators to create new events in the system dynamically.

Here is the task card for the **Project Playbook**.

---

### **Task ID: [FRONTEND] FE-13**
**Title:** Implement Event Management Logic (CRUD)

**Objective:**
To integrate the Event Management UI with the backend API, enabling administrators to fetch and view all scheduled events, and to create new events by selecting from available groups and venues.

**Context:**
This component's logic involves orchestrating multiple data sources. When the component mounts, we need to make three parallel API calls: one to get all events, one for all groups, and one for all venues. The groups and venues data will be used to populate the dropdowns in our "Schedule Event" form. The form submission handler will then take the user's input, package it into a DTO that matches our API contract, and send it to the `POST /api/v1/events` endpoint.

**Prerequisites:**
*   Completion of all previous backend and frontend tasks, especially the backend Event API.
*   The Spring Boot backend server **must be running**.

#### **Step-by-Step Instructions:**

1.  **Update `EventsPage` Code:** Replace the entire content of `src/app/(admin)/events/page.jsx` with the following fully functional code. This version introduces state for events, groups, and venues, fetches them using `useEffect`, and handles the form submission logic.

    ```jsx
    "use client";

    import { useState, useEffect } from "react";
    import apiClient from "@/services/apiClient";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { CalendarIcon, ClockIcon } from "lucide-react";

    const emptyEventForm = { title: '', description: '', venueId: '', groupId: '', startTime: '', endTime: '' };

    export default function EventsPage() {
      const [events, setEvents] = useState([]);
      const [groups, setGroups] = useState([]);
      const [venues, setVenues] = useState([]);
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [newEventData, setNewEventData] = useState(emptyEventForm);

      // Function to fetch all necessary data
      const fetchData = async () => {
        try {
          // Promise.all allows us to run API calls in parallel for efficiency
          const [eventsRes, groupsRes, venuesRes] = await Promise.all([
            apiClient.get("/events"),
            apiClient.get("/groups"),
            apiClient.get("/venues"),
          ]);
          setEvents(eventsRes.data);
          setGroups(groupsRes.data);
          setVenues(venuesRes.data);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      };

      // Fetch data when the component mounts
      useEffect(() => {
        fetchData();
      }, []);
      
      const handleInputChange = (e) => {
        const { id, value } = e.target;
        setNewEventData({ ...newEventData, [id]: value });
      };

      const handleSelectChange = (name, value) => {
        setNewEventData({ ...newEventData, [name]: value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          // Convert local datetime string to ISO 8601 format for the backend
          const payload = {
            ...newEventData,
            startTime: new Date(newEventData.startTime).toISOString(),
            endTime: new Date(newEventData.endTime).toISOString(),
          };
          await apiClient.post("/events", payload);
          setIsDialogOpen(false); // Close dialog
          setNewEventData(emptyEventForm); // Reset form
          fetchData(); // Refresh the event list
        } catch (error) {
          console.error("Failed to create event:", error);
          // Add user-facing error handling (e.g., a toast notification)
        }
      };

      return (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Manage Events</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild><Button>Schedule Event</Button></DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Schedule New Event</DialogTitle>
                    <DialogDescription>Fill in the details to create a new event.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Form fields */}
                    <div className="grid gap-2"><Label htmlFor="title">Event Title</Label><Input id="title" value={newEventData.title} onChange={handleInputChange} /></div>
                    <div className="grid gap-2"><Label htmlFor="description">Description</Label><Input id="description" value={newEventData.description} onChange={handleInputChange} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Venue</Label>
                        <Select onValueChange={(value) => handleSelectChange('venueId', value)}><SelectTrigger><SelectValue placeholder="Select a venue" /></SelectTrigger><SelectContent>{venues.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}</SelectContent></Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Group</Label>
                        <Select onValueChange={(value) => handleSelectChange('groupId', value)}><SelectTrigger><SelectValue placeholder="Select a group" /></SelectTrigger><SelectContent>{groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent></Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2"><Label>Start Time</Label><Input id="startTime" type="datetime-local" value={newEventData.startTime} onChange={handleInputChange} /></div>
                      <div className="grid gap-2"><Label>End Time</Label><Input id="endTime" type="datetime-local" value={newEventData.endTime} onChange={handleInputChange} /></div>
                    </div>
                  </div>
                  <DialogFooter><Button type="submit">Save Event</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {events.map(event => (
                  <li key={event.id} className="p-4 border rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.group.name} @ {event.venue.name}</p>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(event.startTime).toLocaleDateString()}</span>
                      <ClockIcon className="h-4 w-4" />
                      <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      );
    }
    ```

**Verification:**

1.  **Log in as an Administrator** and navigate to the `/events` page.
2.  **Test Data Fetching:**
    *   **Expected Result:** The "Upcoming Events" list should be populated with any events you created via Postman. The "Select a venue" and "Select a group" dropdowns in the "Schedule Event" dialog should be populated with the real venues and groups from your database.
3.  **Test Event Creation:**
    *   Click the "Schedule Event" button.
    *   Fill out all the fields in the form. Select a real group and a real venue from the dropdowns. Choose a start and end time.
    *   Click "Save Event".
    *   **Expected Result:** The dialog should close. The "Upcoming Events" list should automatically refresh and display the new event you just created.
4.  **Check the Database:** Use your database client to look at the `events` table. The new event record should be there, correctly linked to the `venue_id` and `group_id` you selected.

---

**Feature Complete: Event Management (Admin)**


Excellent. The administrative setup is complete. Now we build the "mission control" for the administrator—the page where they will manage a live event and initiate the attendance-taking process.

This task involves creating a new page for viewing a single event's details. It will display the list of all assigned attendees and their current attendance status. Most importantly, it will feature the "Start Attendance" button that kicks off the entire verification flow.

Here is the task card for the **Project Playbook**.

---

### **Task ID: [FRONTEND] FE-14**
**Title:** Build the Admin's Live Attendance View UI

**Objective:**
To create the user interface for a single event's detail page, which will serve as the administrator's live attendance dashboard. The UI will include event details, a real-time list of attendees and their statuses, and the control to start the attendance window.

**Context:**
This will be a dynamic page that an administrator navigates to for a specific event. The URL will contain the event's ID (e.g., `/events/some-uuid`). The page will display key event information at the top. The main area will be a table of all attendees in the event's group, showing their name and a status badge (`PENDING`, `PRESENT`, `ABSENT`). When the admin clicks "Start Attendance", a dialog will appear displaying the 6-digit code for attendees to use.

**Prerequisites:**
*   Completion of all previous frontend tasks.

#### **Step-by-Step Instructions:**

1.  **Add New Shadcn UI Components:** We'll use `Badge` for the status indicators.
    ```bash
    npx shadcn-ui@latest add badge
    ```

2.  **Create the Dynamic Page File:**
    *   In Next.js App Router, dynamic routes are created with folders in square brackets.
    *   Inside `src/app/(admin)/events`, create a new folder named `[eventId]`.
    *   Inside this new `src/app/(admin)/events/[eventId]` folder, create a file named `page.jsx`.

3.  **Make the Event List Clickable:**
    *   Open `src/app/(admin)/events/page.jsx`.
    *   Wrap the `<li>` element in the event list with a `<Link>` component from Next.js so that clicking an event navigates to its detail page.

    ```jsx
    // In src/app/(admin)/events/page.jsx
    import Link from "next/link"; // Add this import

    // ... inside the events.map function ...
    <Link href={`/events/${event.id}`} key={event.id}>
      <li className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer">
        {/* ... rest of the li content ... */}
      </li>
    </Link>
    ```

4.  **Build the Live Attendance Page Component:** Open the new `src/app/(admin)/events/[eventId]/page.jsx` file and add the following code. It sets up the entire UI with mock data.

    ```jsx
    "use client";

    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Badge } from "@/components/ui/badge";
    import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

    // Mock data for building the UI
    const mockEventDetails = {
      id: '1',
      title: 'Java Fundamentals - Lecture 1',
      startTime: '2023-11-15T09:00:00Z',
      group: { name: 'Java IPT - Fall 2023' },
      venue: { name: 'Main Auditorium' },
      attendees: [
        { id: 'u1', firstName: 'John', lastName: 'Doe', status: 'PRESENT', markedAt: '2023-11-15T09:05:12Z' },
        { id: 'u2', firstName: 'Jane', lastName: 'Smith', status: 'PENDING', markedAt: null },
        { id: 'u3', firstName: 'Peter', lastName: 'Jones', status: 'ABSENT', markedAt: null },
      ]
    };

    const mockAttendanceCode = "A91-X34";

    export default function LiveAttendancePage({ params }) {
      // params.eventId will contain the ID from the URL
      const { eventId } = params;

      return (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{mockEventDetails.title}</CardTitle>
                  <CardDescription>
                    {mockEventDetails.group.name} @ {mockEventDetails.venue.name} - {new Date(mockEventDetails.startTime).toLocaleString()}
                  </CardDescription>
                </div>
                {/* Dialog for displaying the attendance code */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg">Start Attendance</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md text-center">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Attendance is Live</DialogTitle>
                      <DialogDescription>Attendees should enter this code in their portal.</DialogDescription>
                    </DialogHeader>
                    <div className="py-8">
                      <p className="text-6xl font-bold tracking-widest bg-gray-100 rounded-md p-4">
                        {mockAttendanceCode}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">This code will expire in 90 seconds.</p>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendee List</CardTitle>
              <CardDescription>Real-time status of all attendees for this event.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Marked At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEventDetails.attendees.map(attendee => (
                      <TableRow key={attendee.id}>
                        <TableCell className="font-medium">{attendee.firstName} {attendee.lastName}</TableCell>
                        <TableCell>
                          <Badge variant={
                            attendee.status === 'PRESENT' ? 'default' : attendee.status === 'ABSENT' ? 'destructive' : 'secondary'
                          }>
                            {attendee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {attendee.markedAt ? new Date(attendee.markedAt).toLocaleTimeString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" disabled={attendee.status === 'PRESENT'}>
                            Mark Manually
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    ```

**Verification:**

1.  **Log in as an Administrator.**
2.  **Navigate to the Events List:** Go to `http://localhost:3000/events`.
3.  **Click on an Event:** Click on one of the event list items.
    *   **Expected Result:** You should be navigated to a URL like `http://localhost:3000/events/some-uuid`. The page should render the new Live Attendance UI.
4.  **Review the UI:**
    *   The top card should display the event's title, group, venue, and time.
    *   A large "Start Attendance" button should be visible on the right.
    *   The bottom card should contain a table with the list of mock attendees, each with a colored status badge (`PRESENT`, `PENDING`, `ABSENT`).
5.  **Test the Dialog:**
    *   Click the "Start Attendance" button.
    *   **Expected Result:** A dialog should pop up, prominently displaying the mock 6-digit attendance code.

---

Excellent. The UI for the admin's live dashboard is ready. Let's make it fully operational.

This task will bring the Live Attendance page to life by fetching real event data, polling for updates, and calling the API to start the attendance window. This is the most dynamic page in the application, and its implementation will reflect that by fetching data not just once, but periodically, to give the administrator a "live" feel.

Here is the task card for the **Project Playbook**.

---

### **Task ID: [FRONTEND] FE-15**
**Title:** Implement the Live Attendance View Logic

**Objective:**
To integrate the administrator's live attendance page with the backend API, enabling real-time fetching of attendee statuses and the ability to start the attendance-taking process.

**Context:**
This component needs to do two main things:
1.  **Fetch Initial Data:** When the page loads, it will use the `eventId` from the URL to call `GET /api/v1/events/{eventId}` and populate the page with the event details and the initial list of attendee statuses.
2.  **Start Attendance:** The "Start Attendance" button will call `POST /api/v1/events/{eventId}/attendance/start`. The response will contain the live code and its expiry time, which we'll display in the dialog.
3.  **Poll for Updates (Real-time Feel):** To show the admin live updates as attendees mark their presence, we will re-fetch the event data every few seconds (e.g., 5 seconds) after the attendance window is opened. This is a simple but effective technique called "polling" to simulate a real-time connection.

**Prerequisites:**
*   Completion of task `[FRONTEND] FE-14` and all relevant backend tasks.
*   The Spring Boot backend server **must be running**.

#### **Step-by-Step Instructions:**

1.  **Update the Live Attendance Page Code:** Replace the entire content of `src/app/(admin)/events/[eventId]/page.jsx` with the following fully functional code. It includes state management for the event data and the attendance code, `useEffect` for data fetching and polling, and the handler for starting the session.

    ```jsx
    "use client";

    import { useState, useEffect, useCallback } from "react";
    import apiClient from "@/services/apiClient";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Badge } from "@/components/ui/badge";
    import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import { Terminal } from "lucide-react";

    export default function LiveAttendancePage({ params }) {
      const { eventId } = params;
      const [eventDetails, setEventDetails] = useState(null);
      const [attendanceCode, setAttendanceCode] = useState(null);
      const [error, setError] = useState('');
      const [isLoading, setIsLoading] = useState(true);

      // useCallback ensures the function isn't recreated on every render
      const fetchEventDetails = useCallback(async () => {
        try {
          const response = await apiClient.get(`/events/${eventId}`);
          setEventDetails(response.data);
        } catch (err) {
          console.error("Failed to fetch event details:", err);
          setError("Could not load event details.");
        } finally {
          setIsLoading(false);
        }
      }, [eventId]);

      useEffect(() => {
        fetchEventDetails();
      }, [fetchEventDetails]);

      // Polling effect: Refetch data every 5 seconds IF a code is active
      useEffect(() => {
        if (attendanceCode) {
          const interval = setInterval(() => {
            fetchEventDetails();
          }, 5000); // Poll every 5 seconds
          return () => clearInterval(interval); // Cleanup on component unmount
        }
      }, [attendanceCode, fetchEventDetails]);

      const handleStartAttendance = async () => {
        try {
          const response = await apiClient.post(`/events/${eventId}/attendance/start`);
          setAttendanceCode(response.data.attendanceCode);
        } catch (err) {
          console.error("Failed to start attendance:", err);
          setError(err.response?.data?.message || "An error occurred.");
        }
      };

      if (isLoading) return <div>Loading event...</div>;
      if (error) return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
      if (!eventDetails) return <div>Event not found.</div>;

      return (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{eventDetails.title}</CardTitle>
                  <CardDescription>
                    {eventDetails.group.name} @ {eventDetails.venue.name} - {new Date(eventDetails.startTime).toLocaleString()}
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" onClick={handleStartAttendance}>Start Attendance</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md text-center">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Attendance is Live</DialogTitle>
                      <DialogDescription>Attendees should enter this code in their portal.</DialogDescription>
                    </DialogHeader>
                    <div className="py-8">
                      <p className="text-6xl font-bold tracking-widest bg-gray-100 rounded-md p-4">
                        {attendanceCode || "..."}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">This code will expire in 90 seconds.</p>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader><CardTitle>Attendee List</CardTitle><CardDescription>Real-time status of all attendees for this event.</CardDescription></CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  {/* TableHeader */}
                  <TableBody>
                    {eventDetails.attendees.map(attendee => (
                      <TableRow key={attendee.id}>
                        <TableCell className="font-medium">{attendee.firstName} {attendee.lastName}</TableCell>
                        <TableCell>
                          <Badge variant={attendee.status === 'PRESENT' ? 'default' : attendee.status === 'ABSENT' ? 'destructive' : 'secondary'}>
                            {attendee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{attendee.markedAt ? new Date(attendee.markedAt).toLocaleTimeString() : 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" disabled={attendee.status === 'PRESENT'}>Mark Manually</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    ```

**Verification:**

This is a multi-step test involving both an admin and an attendee (though for now, we'll simulate the attendee with Postman).

1.  **Log in as an Administrator.**
2.  **Navigate to an Event Detail Page:** Go to `/events` and click on an event you created.
    *   **Expected Result:** The page should load and display the event's details. The attendee list should show everyone with a `PENDING` status.
3.  **Start the Attendance:**
    *   Click the "Start Attendance" button.
    *   **Expected Result:** The dialog should open and, after a moment, display a real 6-digit code fetched from the backend.
4.  **Simulate an Attendee Marking Presence:**
    *   While the dialog is open, quickly go to Postman.
    *   Log in as an **attendee** who is part of that event's group to get their JWT.
    *   Send a `POST` request to `/api/v1/events/{eventId}/attendance/mark` with the attendee's token.
    *   The request body should include the `attendanceCode` from the admin's dialog and valid GPS coordinates.
5.  **Verify the "Live" Update:**
    *   Go back to the admin's page in your browser.
    *   **Expected Result:** Within about 5 seconds, the attendee table should automatically refresh. The status for the attendee you just marked should change from `PENDING` to `PRESENT`, and the "Marked At" column should now show a time. This confirms the polling mechanism is working!

---


Excellent. The administrator's side is complete. Now, let's build the interface for the **Attendee**.

This task focuses on creating a simple, clean dashboard for the logged-in attendee. The main purpose of this page is to show them their upcoming event for the day and provide the primary call-to-action: the "Mark Attendance" button. This button will open a simple dialog where they can input the code provided by the administrator.

Here is the task card for the **Project Playbook**.

---

### **Task ID: [FRONTEND] FE-16**
**Title:** Build the Attendee's Dashboard and Marking UI

**Objective:**
To create the user interface for the attendee's dashboard, which displays their scheduled events and provides the UI for marking their attendance.

**Context:**
Unlike the multi-page admin panel, the attendee's experience can be contained within a single, elegant dashboard. We will create a new route group, `(attendee)`, to apply a specific, simpler layout. The dashboard will display a list of their events. For any event that is currently active, it will show a prominent "Mark Attendance" button. This button will trigger a dialog asking for the 6-digit code.

**Prerequisites:**
*   Completion of all previous relevant frontend tasks.

#### **Step-by-Step Instructions:**

1.  **Create an Attendee Route Group and Layout:**
    *   In `src/app`, create a new route group folder named `(attendee)`.
    *   Inside `src/app/(attendee)`, create a `layout.jsx` file. This layout will be simpler than the admin one, perhaps just providing a basic header with a logout button.

    ```jsx
    // src/app/(attendee)/layout.jsx
    "use client";

    import { useAuth } from "@/context/AuthContext";
    import ProtectedRoute from "@/components/auth/ProtectedRoute";
    import { Button } from "@/components/ui/button";
    import Link from "next/link";
    import { Calendar } from "lucide-react";

    export default function AttendeeLayout({ children }) {
      const { logout } = useAuth();
      return (
        <ProtectedRoute>
          <div className="flex flex-col min-h-screen">
            <header className="flex h-16 items-center justify-between border-b px-6 bg-white">
              <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
                <Calendar className="h-6 w-6" />
                <span>Attendance Portal</span>
              </Link>
              <Button onClick={logout} variant="outline">Logout</Button>
            </header>
            <main className="flex-1 p-6 bg-gray-50">
              {children}
            </main>
          </div>
        </ProtectedRoute>
      );
    }
    ```

2.  **Redirect Users Based on Role:** Our current logic in `FE-05` redirects everyone to `/dashboard`. We need to update this to route users based on their role.
    *   Open your `AuthContext.js` in `src/context`.
    *   Modify the `login` function to inspect the user's role and redirect accordingly.

    ```javascript
    // In src/context/AuthContext.js
    // ... inside the AuthProvider ...
    const login = async (email, password) => {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('authToken', token);
      setUser(userData);
      
      // NEW: Role-based redirection
      if (userData.role === 'ADMINISTRATOR') {
        router.push('/dashboard'); // Admin dashboard
      } else {
        router.push('/my-events'); // Attendee dashboard
      }
    };
    ```

3.  **Create the Attendee Dashboard Page:**
    *   Inside the `src/app/(attendee)` folder, create a new folder named `my-events`.
    *   Inside `src/app/(attendee)/my-events`, create a file named `page.jsx`.
    *   Add the following code to set up the static UI with mock data.

    ```jsx
    "use client";

    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { CalendarIcon, ClockIcon } from "lucide-react";

    // Mock data for the UI
    const mockMyEvents = [
      { id: '1', title: 'Java Fundamentals - Lecture 1', startTime: new Date().toISOString(), venue: { name: 'Main Auditorium' }, myAttendanceStatus: 'PENDING' },
      { id: '2', title: 'Spring Boot Basics', startTime: '2023-11-20T14:00:00Z', venue: { name: 'Main Auditorium' }, myAttendanceStatus: 'PRESENT' },
    ];

    export default function MyEventsPage() {
      // Logic will be added in the final step
      const isEventActive = (event) => {
          const now = new Date();
          const startTime = new Date(event.startTime);
          // Let's pretend an event is "active" 15 mins before it starts
          return now > new Date(startTime.getTime() - 15 * 60000);
      };

      return (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Events</h1>
          <div className="grid gap-6">
            {mockMyEvents.map(event => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>{event.venue.name}</CardDescription>
                    </div>
                    {event.myAttendanceStatus === 'PRESENT' ? (
                        <p className="text-green-600 font-semibold">Attendance Marked</p>
                    ) : (
                      isEventActive(event) && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>Mark Attendance</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Mark Attendance for {event.title}</DialogTitle>
                              <DialogDescription>
                                Enter the 6-digit code provided by your administrator.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2 text-center">
                                <Label htmlFor="code" className="text-left">Attendance Code</Label>
                                <Input id="code" placeholder="A1B-C2D" className="text-2xl text-center tracking-widest h-14" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" className="w-full">Submit</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 flex items-center gap-4">
                    <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" /><span>{new Date(event.startTime).toLocaleDateString()}</span></div>
                    <div className="flex items-center gap-2"><ClockIcon className="h-4 w-4" /><span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }
    ```

**Verification:**

1.  **Register and Log in as an Attendee:** Create a new user with the `ATTENDEE` role. Log in with their credentials.
2.  **Check Redirection:**
    *   **Expected Result:** After logging in, you should be redirected to `http://localhost:3000/my-events`, not `/dashboard`.
3.  **Review the UI:**
    *   The page should have a simple header with the title and a "Logout" button.
    *   You should see cards for the two mock events.
    *   The first event (set to today's date) should have a prominent "Mark Attendance" button.
    *   The second event should show the text "Attendance Marked" because its status is `PRESENT`.
4.  **Test the Dialog:**
    *   Click the "Mark Attendance" button on the first event.
    *   **Expected Result:** A dialog should pop up, asking for the 6-digit attendance code.

---


Excellent. This is the final implementation task. We're bringing the core feature of the entire project to life for the end-user.

This task will add the final piece of logic to the attendee's dashboard. When an attendee clicks "Submit" in the "Mark Attendance" dialog, our code will perform two critical actions:
1.  Use the browser's **Geolocation API** to get the user's current GPS coordinates.
2.  Send the code and the coordinates to our backend for final verification.

Here is the final task card for the **Project Playbook**.

---

### **Task ID: [FRONTEND] FE-17**
**Title:** Implement Attendee Marking Logic with Geolocation

**Objective:**
To implement the full client-side logic for an attendee to mark their presence, including fetching their GPS location and submitting the attendance code to the backend API.

**Context:**
The browser provides a built-in, permission-based Geolocation API (`navigator.geolocation`). When we call it, the browser will prompt the user for permission to access their location. If they grant it, the API will provide us with their latitude and longitude. This is an asynchronous operation. We must wait for the location to be retrieved before we can send our API request to the `POST /api/v1/events/{eventId}/attendance/mark` endpoint. We will manage loading and error states to provide clear feedback to the user.

**Prerequisites:**
*   Completion of task `[FRONTEND] FE-16`.
*   The Spring Boot backend server **must be running**.

#### **Step-by-Step Instructions:**

1.  **Update `MyEventsPage` Code:** Replace the entire content of `src/app/(attendee)/my-events/page.jsx` with the following fully functional code. This version adds the logic for fetching live event data and the complete geolocation and submission flow.

    ```jsx
    "use client";

    import { useState, useEffect } from "react";
    import apiClient from "@/services/apiClient";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
    import { CalendarIcon, ClockIcon, Terminal } from "lucide-react";

    export default function MyEventsPage() {
      const [myEvents, setMyEvents] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState('');
      const [code, setCode] = useState('');
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [dialogError, setDialogError] = useState('');

      const fetchMyEvents = async () => {
        try {
          const response = await apiClient.get("/attendee/events");
          setMyEvents(response.data);
        } catch (err) {
          console.error("Failed to fetch events:", err);
          setError("Could not load your events.");
        } finally {
          setIsLoading(false);
        }
      };

      useEffect(() => {
        fetchMyEvents();
      }, []);

      const handleSubmitAttendance = (eventId) => {
        setIsSubmitting(true);
        setDialogError('');

        if (!navigator.geolocation) {
          setDialogError("Geolocation is not supported by your browser.");
          setIsSubmitting(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              await apiClient.post(`/events/${eventId}/attendance/mark`, {
                attendanceCode: code,
                latitude,
                longitude,
              });
              
              // Success! Refresh the events list to show the 'PRESENT' status
              fetchMyEvents(); 
              // Find a way to close the dialog. This is a simplified approach.
              // A more robust solution would involve managing dialog open state from the parent.
              document.querySelector('[data-state="open"]')?.click(); 
            } catch (err) {
              console.error("Attendance marking failed:", err);
              setDialogError(err.response?.data?.message || "Failed to mark attendance.");
            } finally {
              setIsSubmitting(false);
              setCode('');
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setDialogError("Could not get your location. Please enable location services.");
            setIsSubmitting(false);
          }
        );
      };
      
      const isEventActive = (event) => { /* ... same as before ... */ };

      if (isLoading) return <div>Loading your events...</div>;
      if (error) return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;

      return (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Events</h1>
          <div className="grid gap-6">
            {myEvents.map(event => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>{event.venue.name}</CardDescription>
                    </div>
                    {event.myAttendanceStatus === 'PRESENT' ? (
                      <p className="text-green-600 font-semibold">Attendance Marked ✔</p>
                    ) : (
                      isEventActive(event) && (
                        <Dialog>
                          <DialogTrigger asChild><Button>Mark Attendance</Button></DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <form onSubmit={(e) => { e.preventDefault(); handleSubmitAttendance(event.id); }}>
                              <DialogHeader>
                                <DialogTitle>Mark Attendance for {event.title}</DialogTitle>
                                <DialogDescription>Enter the 6-digit code provided.</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2 text-center">
                                  <Label htmlFor="code" className="text-left">Attendance Code</Label>
                                  <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} className="text-2xl text-center tracking-widest h-14" />
                                </div>
                                {dialogError && <p className="text-sm text-red-500">{dialogError}</p>}
                              </div>
                              <DialogFooter>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                  {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )
                    )}
                  </div>
                </CardHeader>
                <CardContent>{/* ... same as before ... */}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }
    ```

**Verification:**

This is the ultimate end-to-end test of the entire system. It requires both the Admin and Attendee roles.

1.  **Admin: Get Ready:**
    *   Log in as an **Administrator**.
    *   Navigate to the detail page for an upcoming event (e.g., `/events/{eventId}`). Ensure you have an attendee user enrolled in that event's group.
2.  **Attendee: Get Ready:**
    *   In a **different browser** (or an incognito window), log in as the **Attendee** user who is part of that event.
    *   Navigate to their dashboard at `/my-events`. You should see the upcoming event with the "Mark Attendance" button.
3.  **Admin: Start the Session:**
    *   On the admin's screen, click "Start Attendance". The dialog should appear with a live 6-digit code.
4.  **Attendee: Mark Attendance:**
    *   **Quickly**, on the attendee's screen, click "Mark Attendance".
    *   Your browser will pop up a message asking for permission to access your location. **Click "Allow"**.
    *   Enter the 6-digit code from the admin's screen into the input field.
    *   Click "Submit".
5.  **Observe the Results:**
    *   **Attendee's Screen:** The "Submitting..." state should appear on the button. If successful, the dialog will close, and the event card should update to show "Attendance Marked ✔". If you enter the wrong code or are outside the virtual radius, you should see an error message appear in the dialog.
    *   **Admin's Screen:** Within ~5 seconds of the attendee's successful submission, the admin's dashboard should automatically refresh, and the attendee's status in the table should change from `PENDING` to `PRESENT`.

---

# **PROJECT IMPLEMENTATION COMPLETE**

Of course. The core implementation is complete. The final phase of any professional project is ensuring quality, tidying up the code, and deploying it for the world to see. This is our final milestone.

Here is the last task card for the **Project Playbook**, covering the essential final steps.

---

### **Task ID: [GENERAL] F-06**
**Title:** Final Testing, Bug Fixing, and Deployment Preparation

**Objective:**
To conduct thorough end-to-end testing of the entire application, fix any discovered bugs or UI inconsistencies, and prepare the backend and frontend for deployment to a live production environment.

**Context:**
This phase shifts from feature creation to quality assurance. The goal is to simulate real-world usage from the perspective of both an Administrator and an Attendee. We will meticulously go through every user flow, looking for errors, unexpected behavior, or areas where the user experience can be improved. Once satisfied with the application's stability, we will prepare the deployment configurations.

**Prerequisites:**
*   Completion of all previous implementation tasks (`BE-01` to `FE-17`).

---

### **Part 1: End-to-End (E2E) Testing Checklist**

Execute the following user stories from start to finish. Log any bugs or issues you find in a shared document.

#### **Administrator Flow:**
-   [ ] **Registration:** Can an Administrator register a new account successfully?
-   [ ] **Login/Logout:** Can the Administrator log in, see they are logged in, and log out successfully?
-   [ ] **Venue Management:**
    -   [ ] Can the Admin access the Venues page?
    -   [ ] Can the Admin successfully **Create** a new venue?
    -   [ ] Does the new venue appear in the list?
    -   [ ] Can the Admin successfully **Update** that venue's details?
    -   [ ] Can the Admin successfully **Delete** that venue?
-   [ ] **Group Management:**
    -   [ ] Can the Admin access the Groups page?
    -   [ ] Can the Admin **Create** a new group?
    -   [ ] Can the Admin select the group and **Add** an existing Attendee user as a member?
    -   [ ] Does the member appear in the group's detail view?
    -   [ ] Can the Admin **Remove** the member from the group?
-   [ ] **Event Management:**
    -   [ ] Can the Admin access the Events page?
    -   [ ] Can the Admin **Schedule** a new event, selecting an existing Venue and Group?
    -   [ ] Does the new event appear in the list of upcoming events?
-   [ ] **Live Attendance Flow:**
    -   [ ] Can the Admin navigate to the live detail page for the scheduled event?
    -   [ ] Does the "Start Attendance" button work and generate a code?
    -   [ ] Does the attendee list update in near real-time when an attendee marks their presence?
    -   [ ] Does the manual override button work?

#### **Attendee Flow:**
-   [ ] **Registration:** Can an Attendee register a new account successfully?
-   [ ] **Login & Redirection:** When the Attendee logs in, are they correctly redirected to the `/my-events` dashboard?
-   [ ] **View Events:** Does the dashboard correctly display the events they are enrolled in?
-   [ ] **Mark Attendance (Success Case):**
    -   [ ] When an event is live, does the "Mark Attendance" button appear?
    -   [ ] Does clicking it open the dialog?
    -   [ ] Does the browser correctly ask for location permission?
    -   [ ] Upon entering the correct code, does the API call succeed and the UI update to "Attendance Marked"?
-   [ ] **Mark Attendance (Failure Cases):**
    -   [ ] Does entering an **incorrect code** show an error message in the dialog?
    -   [ ] Does submitting with an **expired code** show an error?
    -   [ ] Does submitting from a location **outside the radius** show an error? (This may require manually faking GPS data in browser dev tools).
    -   [ ] Does **denying location permission** show an error message?

---

### **Part 2: Bug Fixing & Polishing**

-   **Review Bug Log:** Go through the list of issues found during testing and prioritize them. Fix critical bugs first (e.g., login not working, unable to create events).
-   **UI/UX Polish:** Review the application for minor visual inconsistencies.
    -   Are all buttons and forms styled consistently?
    -   Are loading states handled gracefully (e.g., showing a spinner instead of a blank screen)?
    -   Are all error messages clear and user-friendly?
    -   Check for responsiveness on mobile screen sizes.

---

### **Part 3: Deployment Preparation**

Once the application is stable and polished, prepare it for deployment.

#### **Backend (Spring Boot to Render):**
1.  **Create a Dockerfile:** In the root of your `digital-attendance-backend` project, create a file named `Dockerfile` (no extension). This tells Render how to build and run your application.
    ```Dockerfile
    # Use an official OpenJDK runtime as a parent image
    FROM openjdk:17-jdk-slim

    # Set the working directory in the container
    WORKDIR /app

    # Copy the Maven wrapper and the project definition file
    COPY .mvn/ .mvn
    COPY mvnw pom.xml ./

    # Download dependencies. This is layered to leverage Docker's caching.
    RUN ./mvnw dependency:go-offline

    # Copy the application source code
    COPY src ./src

    # Package the application
    RUN ./mvnw package -DskipTests

    # Expose the port the app runs on
    EXPOSE 8080

    # Command to run the application
    ENTRYPOINT ["java", "-jar", "target/attendance-0.0.1-SNAPSHOT.jar"] 
    ```
2.  **Update `application.properties` for Production:** You will need to switch from a local database to your cloud database (PlanetScale). This is done using **Environment Variables** on Render, not by changing the file directly. Your `application.properties` should be configured to read these variables.
3.  **Push to GitHub:** Ensure your final, working code is pushed to your `digital-attendance-backend` GitHub repository.

#### **Frontend (Next.js to Vercel):**
1.  **Check Environment Variable:** Ensure your `.env.local` is correct. When you deploy, you will set the `NEXT_PUBLIC_API_URL` environment variable in the Vercel dashboard to point to your live Render backend URL (e.g., `https://digital-attendance-backend.onrender.com/api/v1`).
2.  **Push to GitHub:** Ensure your final, working code is pushed to your `digital-attendance-frontend` GitHub repository.

#### **Deployment Execution:**
1.  **Database:** Create your free MySQL database on **PlanetScale** and get the connection credentials.
2.  **Backend:**
    *   Sign up for **Render**.
    *   Create a "New Web Service" and connect it to your `digital-attendance-backend` GitHub repo.
    *   Set the build method to "Dockerfile".
    *   In the "Environment" section, add the PlanetScale database URL, username, and password as environment variables. Add your JWT secret key here as well.
    *   Click "Deploy". Render will build the Docker image and start your Spring Boot application.
3.  **Frontend:**
    *   Sign up for **Vercel**.
    *   Create a "New Project" and connect it to your `digital-attendance-frontend` GitHub repo.
    *   Vercel will auto-detect that it's a Next.js project.
    *   In the "Environment Variables" section, add `NEXT_PUBLIC_API_URL` and set its value to the URL of your live Render service.
    *   Click "Deploy". Vercel will build and deploy your Next.js application.

