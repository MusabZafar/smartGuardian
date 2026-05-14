# SmartGuardian

SmartGuardian is a full-stack resource and management system that combines user authentication, employee and group management, geofence creation, location monitoring, and real-time WebSocket communication. The project is organised into a Spring Boot backend and a Next.js frontend.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Main Features](#main-features)
3. [Technology Stack](#technology-stack)
4. [Repository Structure](#repository-structure)
5. [System Architecture](#system-architecture)
6. [Backend Explanation](#backend-explanation)
7. [Frontend Explanation](#frontend-explanation)
8. [Authentication Flow](#authentication-flow)
9. [Geofence Flow](#geofence-flow)
10. [WebSocket Flow](#websocket-flow)
11. [API Endpoints](#api-endpoints)
12. [Prerequisites](#prerequisites)
13. [Backend Setup](#backend-setup)
14. [Frontend Setup](#frontend-setup)
15. [Environment Variables](#environment-variables)
16. [How to Run the Project](#how-to-run-the-project)
17. [Testing the Project](#testing-the-project)
18. [Important Review Notes and Fixes](#important-review-notes-and-fixes)
19. [Recommended Improvements](#recommended-improvements)
20. [Future Scope](#future-scope)

---

## Project Overview

SmartGuardian is designed as a monitoring and management platform. It can be used to manage users, employees, groups, and geofence zones. The system allows an authenticated user to create and manage geofences, track geofence entries and exits, and receive location-related updates through WebSocket topics.

The application has two main parts:

```text
SmartGuardian(backend)   -> Spring Boot REST API, security, database, WebSocket logic
SmartGuardian(frontend)  -> Next.js user interface, maps, pages, dashboards, API calls
```

The backend handles authentication, authorization, database operations, JWT validation, geofence APIs, user management, password reset, OAuth2 login support, and real-time communication.

The frontend provides the user interface for login, registration, dashboard pages, employee management, group management, geofence creation, attendance-related pages, profile pages, and map-based interaction.

---

## Main Features

### 1. User Authentication

The project supports a complete authentication flow using Spring Security and JWT.

Main authentication features include:

- User registration
- User login
- JWT-based protected API access
- OAuth2 login support
- Password reset request
- OTP verification
- Password reset after OTP verification
- Role-based access protection for selected operations

### 2. Employee Management

The backend contains employee-related APIs and frontend pages for managing employees.

Employee features include:

- Create employee
- Get employee by ID
- Get all employees
- Update employee
- Delete employee

### 3. Group Management

Groups can be created and assigned in the system. Some group actions are protected with admin-level authorization.

Group features include:

- Create group
- Get group by ID
- Get all groups
- Update group
- Delete group

### 4. Geofence Management

The project includes geofence functionality, which is one of the core modules of SmartGuardian.

Geofence features include:

- Create geofence
- Store polygon-based geofence boundaries
- Get all geofences
- Get geofence by ID
- Update geofence
- Delete geofence
- Associate geofence data with users or groups

### 5. Geofence Entry and Exit Tracking

The backend contains a geofence entry module that can record when a user enters and exits a geofence area.

This module can be used for:

- Attendance tracking
- Location monitoring
- Security monitoring
- Time spent inside a zone
- Real-time geofence event broadcasting

### 6. Real-Time Location Updates

The project uses WebSocket/STOMP communication for real-time updates.

Real-time features include:

- Location updates
- Geofence entry events
- Geofence exit events
- Topic-based broadcasting to frontend clients

### 7. Map-Based Frontend

The frontend uses Google Maps-related packages. The geofence screen allows polygon drawing and map interaction.

Map-related features include:

- Current location detection through browser geolocation
- Google Map rendering
- Drawing polygon-based zones
- Collecting polygon coordinates
- Choosing polygon color
- Selecting employees and groups for geofence usage

---

## Technology Stack

### Backend

- Java 21
- Spring Boot 3.3.4
- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT using JJWT
- OAuth2 Client
- Spring Mail
- Twilio SDK
- WebSocket/STOMP
- Lombok
- Maven Wrapper

### Frontend

- Next.js 14
- React 18
- JavaScript
- Tailwind CSS
- Axios
- Google Maps React API
- STOMP.js
- SockJS Client
- Firebase
- Framer Motion
- Chart.js
- React Hook Form
- React Google reCAPTCHA

### Database

- PostgreSQL

### External Services

Depending on the final configuration, the project can use:

- Google Maps API
- Google OAuth2
- SMTP email service
- Twilio WhatsApp/SMS service
- Firebase

---

## Repository Structure

The repository is divided into two main folders:

```text
smartGuardian/
│
├── SmartGuardian(backend)/
│   ├── .mvn/wrapper/
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   │       └── com/smartguardian/app/
│   │   │           ├── config/
│   │   │           ├── controller/
│   │   │           ├── dto/
│   │   │           ├── entity/
│   │   │           ├── repository/
│   │   │           ├── security/
│   │   │           ├── service/
│   │   │           ├── AuthenticationReactBackendApplication.java
│   │   │           └── WebConfig.java
│   │   └── test/
│   ├── mvnw
│   ├── mvnw.cmd
│   └── pom.xml
│
└── SmartGuardian(frontend)/
    ├── public/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── lib/
    │   └── styles/
    ├── package.json
    ├── next.config.mjs
    ├── tailwind.config.js
    └── README.md
```

---

## System Architecture

SmartGuardian follows a common full-stack architecture:

```text
User Browser
    |
    |  Next.js UI
    v
Frontend Application
    |
    |  REST API calls with JWT Bearer token
    |  WebSocket/STOMP connection
    v
Spring Boot Backend
    |
    |  Controller -> Service -> Repository
    v
PostgreSQL Database
```

### Backend Layering

The backend follows a layered architecture:

```text
Controller Layer
    Receives HTTP requests and returns API responses.

Service Layer
    Contains business logic such as authentication, employee logic, group logic, and geofence logic.

Repository Layer
    Communicates with the database using Spring Data JPA.

Entity Layer
    Represents database tables such as User, Employee, Group, GeoFence, and GeoFenceEntry.

DTO Layer
    Transfers request and response data between frontend and backend.

Security Layer
    Handles JWT validation, user details, authentication entry point, and security filters.
```

---

## Backend Explanation

The backend is a Spring Boot application. It exposes REST APIs for authentication, employees, groups, geofences, users, user types, and geofence entries.

### Important Backend Packages

#### `config`

Contains application configuration classes.

Examples:

- `SpringSecurityConfig.java`
- `WebSocketConfig.java`
- `WebSocketAuthInterceptor.java`
- `TwilioConfig.java`
- `DataInitializer.java`

This package is responsible for security configuration, WebSocket configuration, Twilio configuration, and initial application data.

#### `controller`

Contains REST and WebSocket controllers.

Important controllers include:

- `AuthController.java`
- `EmployeeController.java`
- `GroupController.java`
- `GeoFenceController.java`
- `GeoFenceEntryController.java`
- `GeoFenceWebSocketController.java`
- `LocationWebSocketController.java`
- `OAuth2Controller.java`
- `PasswordController.java`
- `UserController.java`
- `UserTypeController.java`

These controllers define the API endpoints used by the frontend.

#### `dto`

Contains request and response objects.

Examples:

- `LoginDto.java`
- `RegisterDto.java`
- `JwtAuthResponse.java`
- `EmployeeRequest.java`
- `EmployeeResponse.java`
- `GroupRequest.java`
- `GroupResponse.java`
- `GeoFenceDTO.java`
- `GeoFenceEntryDTO.java`
- `LocationUpdateDTO.java`

DTOs help keep API data clean and separate from database entities.

#### `entity`

Contains database entities.

Important entities include:

- `User`
- `Role`
- `UserType`
- `Employee`
- `Group`
- `GeoFence`
- `GeoFenceEntry`
- `Point`
- `Polygon`

These classes represent the main database tables and relationships.

#### `repository`

Contains Spring Data JPA repositories.

Examples:

- `UserRepository`
- `RoleRepository`
- `EmployeeRepository`
- `GroupRepository`
- `GeoFenceRepository`
- `GeoFenceEntryRepository`
- `UserTypeRepository`

Repositories are used to perform database operations without writing manual SQL for common CRUD operations.

#### `security`

Contains JWT and Spring Security-related classes.

Examples:

- `JwtAuthenticationFilter`
- `JwtAuthenticationEntryPoint`
- `JwtTokenProvider`
- `CustomUserDetailsService`
- `CustomOAuth2SuccessHandler`

This package is responsible for validating JWT tokens, loading users, handling unauthorized requests, and processing OAuth2 success logic.

#### `service`

Contains service interfaces and implementations.

Examples:

- `AuthService`
- `AuthServiceImpl`
- `EmployeeService`
- `GroupService`
- `GeoFenceService`
- `GeoFenceEntryService`
- `UserService`
- `UserTypeService`
- `EmailService`
- `WhatsAppService`

The service layer contains the main business logic of the application.

---

## Frontend Explanation

The frontend is a Next.js application. It contains different pages and components for user interaction.

### Important Frontend Folders

#### `src/app`

This folder contains application routes and pages.

Important route folders include:

- `login`
- `register`
- `dashboard`
- `EmployeesPage`
- `GroupsPage`
- `GeoFence`
- `SelfAttendance`
- `attendance`
- `profile`
- `VerifyOtp`
- `RequestReset`
- `ResetPassword`
- `OAuth2Redirect`
- `IPS`

These folders represent different pages of the application.

#### `src/components`

Contains reusable UI components.

#### `src/components/ui`

Contains reusable UI elements such as:

- `button.jsx`
- `alert-dialog.jsx`

#### `src/lib`

Contains utility functions.

#### `src/styles`

Contains custom CSS files such as animated logo and hero button styling.

---

## Authentication Flow

The authentication flow works like this:

```text
1. User registers or logs in from the frontend.
2. Frontend sends credentials to the backend authentication API.
3. Backend validates the credentials.
4. Backend generates a JWT token.
5. Frontend stores the token.
6. Frontend sends the token in future API requests.
7. Backend JWT filter validates the token before allowing protected access.
```

Example Authorization header:

```http
Authorization: Bearer your_jwt_token_here
```

The backend security configuration allows public access to authentication routes and protects other application routes.

---

## Geofence Flow

A geofence is a virtual boundary drawn on a map. In this project, geofences are polygon-based.

Expected geofence flow:

```text
1. User opens the GeoFence page.
2. Frontend loads employees and groups from the backend.
3. Browser gets the current location of the user.
4. User draws a polygon on Google Maps.
5. Frontend collects polygon coordinates.
6. User selects related employees or groups.
7. Frontend sends geofence data to the backend.
8. Backend stores the geofence in the database.
9. When location updates happen, entries and exits can be tracked.
10. Real-time events can be broadcast to connected frontend clients.
```

### Important Note

The reviewed frontend snippet stores geofence data in local component state. For full persistence, the frontend should send the geofence form data to the backend `/api/geofences` endpoint.

---

## WebSocket Flow

The backend supports WebSocket communication using STOMP.

### WebSocket Endpoint

```text
/ws
```

### Application Destination Prefix

```text
/app
```

### Broadcast Topics

```text
/topic/geofence-entries
/topic/geofence-exits
/topic/locations
```

### Example Flow

```text
1. Frontend connects to /ws using SockJS/STOMP.
2. Frontend subscribes to a topic such as /topic/locations.
3. Frontend sends location updates to /app/location/update.
4. Backend receives the message.
5. Backend broadcasts location updates to subscribed clients.
```

This is useful for live monitoring dashboards and real-time geofence tracking.

---

## API Endpoints

### Authentication APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/loginPage` | Login and receive JWT |
| POST | `/api/auth/oauth2/success` | Handle OAuth2 success login |
| POST | `/api/auth/forgot-password` | Request password reset OTP |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/reset-password` | Reset password |

### Employee APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/employees` | Create employee |
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/{id}` | Get employee by ID |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |

### Group APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/groups` | Create group |
| GET | `/api/groups` | Get all groups |
| GET | `/api/groups/{id}` | Get group by ID |
| PUT | `/api/groups/{id}` | Update group |
| DELETE | `/api/groups/{id}` | Delete group |

Some group endpoints are protected with admin role authorization.

### Geofence APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/geofences` | Create geofence |
| GET | `/api/geofences` | Get all geofences |
| GET | `/api/geofences/{id}` | Get geofence by ID |
| PUT | `/api/geofences/{id}` | Update geofence |
| DELETE | `/api/geofences/{id}` | Delete geofence |

### Geofence Entry APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/geofence-entries` | Record geofence entry |
| PATCH | `/api/geofence-entries/{id}/exit` | Record geofence exit |

### User APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users/by-email` | Get user by email |
| GET | `/api/users/by-username` | Get user by username |
| PUT | `/api/users/update-image` | Update user profile image |

### User Type APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/user-types` | Get all user types |
| POST | `/api/user-types` | Create user type |
| GET | `/api/user-types/{id}` | Get user type by ID |
| DELETE | `/api/user-types/{id}` | Delete user type |

---

## Prerequisites

Before running the project, install the following:

- Java 21
- Maven or use the included Maven Wrapper
- Node.js 18 or newer
- npm
- PostgreSQL
- Git
- Google Maps API key
- SMTP email account or app password
- Twilio account if WhatsApp/SMS features are required
- Google OAuth client credentials if OAuth2 login is required

---

## Backend Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MusabZafar/smartGuardian.git
cd smartGuardian
```

### 2. Go to Backend Folder

```bash
cd "SmartGuardian(backend)"
```

### 3. Create PostgreSQL Database

Create a database manually in PostgreSQL:

```sql
CREATE DATABASE smartguardian;
```

### 4. Create Backend Configuration File

Create this file if it does not already exist:

```text
src/main/resources/application.properties
```

Example configuration:

```properties
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/smartguardian
spring.datasource.username=postgres
spring.datasource.password=your_database_password
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

app.jwt-secret=replace_this_with_a_strong_secret_key
app.jwt-expiration-milliseconds=86400000

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_email_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Twilio configuration. Adjust property names if TwilioConfig.java uses different names.
twilio.account-sid=your_twilio_account_sid
twilio.auth-token=your_twilio_auth_token
twilio.whatsapp-from=whatsapp:+14155238886

# Google OAuth2 configuration
spring.security.oauth2.client.registration.google.client-id=your_google_client_id
spring.security.oauth2.client.registration.google.client-secret=your_google_client_secret
spring.security.oauth2.client.registration.google.scope=email,profile
```

### 5. Build Backend

For Windows:

```bash
mvnw.cmd clean install
```

For macOS/Linux:

```bash
./mvnw clean install
```

### 6. Run Backend

For Windows:

```bash
mvnw.cmd spring-boot:run
```

For macOS/Linux:

```bash
./mvnw spring-boot:run
```

Backend should start at:

```text
http://localhost:8080
```

---

## Frontend Setup

### 1. Go to Frontend Folder

From the repository root:

```bash
cd "SmartGuardian(frontend)"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Frontend Environment File

Create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### 4. Run Frontend

```bash
npm run dev
```

Frontend should start at:

```text
http://localhost:3000
```

---

## Environment Variables

### Why Environment Variables Are Important

API keys, database passwords, JWT secrets, OAuth credentials, and Twilio credentials should not be hard-coded inside source code.

Use environment files for local development and secure secret managers for production.

### Important Security Note

A Google Maps API key appears in the reviewed frontend map-related code. Because frontend keys are visible in the browser, you should restrict the key in Google Cloud Console and rotate it if it was committed publicly.

Recommended actions:

1. Move the key to `.env.local`.
2. Use `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in the frontend code.
3. Restrict the key by domain.
4. Restrict the key by API usage.
5. Rotate the key if it has already been exposed publicly.

Example usage in frontend:

```javascript
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
```

---

## How to Run the Project

### Step 1: Start PostgreSQL

Make sure PostgreSQL is running and the `smartguardian` database exists.

### Step 2: Start Backend

```bash
cd "SmartGuardian(backend)"
./mvnw spring-boot:run
```

On Windows:

```bash
cd "SmartGuardian(backend)"
mvnw.cmd spring-boot:run
```

### Step 3: Start Frontend

Open another terminal:

```bash
cd "SmartGuardian(frontend)"
npm run dev
```

### Step 4: Open the Application

Open:

```text
http://localhost:3000
```

---

## Testing the Project

### Test Authentication

1. Open the registration page.
2. Register a new user.
3. Login with the same user.
4. Confirm that a token is returned.
5. Use the token to access protected APIs.

### Test Employee APIs

Use Postman or Thunder Client:

```http
GET http://localhost:8080/api/employees
Authorization: Bearer your_jwt_token
```

### Test Group APIs

```http
GET http://localhost:8080/api/groups
Authorization: Bearer your_jwt_token
```

For create, update, and delete operations, make sure the logged-in user has the required admin role.

### Test Geofence APIs

```http
GET http://localhost:8080/api/geofences
Authorization: Bearer your_jwt_token
```

### Test WebSocket

Use a WebSocket/STOMP client and connect to:

```text
http://localhost:8080/ws
```

Subscribe to:

```text
/topic/locations
/topic/geofence-entries
/topic/geofence-exits
```

Send location update messages to:

```text
/app/location/update
```

---

## Important Review Notes and Fixes

These are important points found during the repository review.


Recommended fix:

- Replace old `net.javaguides.todo` imports with the correct `com.smartguardian.app` package.
- Update package names consistently across controllers, services, repositories, entities, DTOs, and security classes.
- Update Maven metadata in `pom.xml` so the project name matches SmartGuardian.

### 2. Backend Application Properties File

The backend source tree reviewed from GitHub does not clearly show a committed `src/main/resources/application.properties` file.

Recommended fix:

- Add an example file such as `application-example.properties`.
- Keep real secrets out of Git.
- Add the real `application.properties` to `.gitignore` if it contains secrets.

### 3. Hard-Coded API URLs in Frontend

The reviewed frontend code calls backend APIs using hard-coded URLs like:

```text
http://localhost:8080
```

Recommended fix:

Use an environment variable:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
```

Then call:

```javascript
axios.get(`${API_BASE_URL}/api/employees`);
```

### 4. Hard-Coded Google Maps Key

The reviewed geofence component contains a Google Maps API key directly in frontend code.

Recommended fix:

- Move the key to `.env.local`.
- Restrict the key in Google Cloud Console.
- Rotate the exposed key.



### 6. Geofence Persistence Needs Frontend Integration

The reviewed geofence frontend snippet stores created geofences in local state.

Recommended fix:

Connect the form submission to the backend API:

```http
POST /api/geofences
```

This will make the geofence data persistent in PostgreSQL.

### 7. Production WebSocket Security

The WebSocket configuration allows broad origins in the reviewed code.

Recommended fix:

For production, restrict allowed origins to your frontend domain only.

Example:

```java
.setAllowedOrigins("https://your-production-domain.com")
```

### 8. JWT Storage

The frontend appears to use browser storage for JWT tokens.

For a student project this is common and simple, but for a production system, consider using secure HTTP-only cookies to reduce token exposure risk.

---

## Recommended Improvements

### Backend Improvements

- Add Swagger/OpenAPI documentation.
- Add global exception handling using `@ControllerAdvice`.
- Add validation annotations in DTO classes.
- Add pagination for employee, group, and geofence lists.
- Add audit fields like `createdAt`, `updatedAt`, `createdBy`, and `updatedBy`.
- Add unit tests for services.
- Add integration tests for controllers.
- Improve package naming consistency.
- Add role and permission documentation.
- Add API response standardization.

### Frontend Improvements

- Replace hard-coded backend URLs with environment variables.
- Move all API calls into a separate service layer.
- Add loading states and error messages.
- Add form validation.
- Add map error handling when geolocation permission is denied.
- Add reusable layout and sidebar components.
- Add route guards for protected pages.
- Add a logout flow.
- Add better mobile responsiveness.
- Add screenshots to the README.

### Security Improvements

- Rotate exposed API keys.
- Keep secrets out of Git.
- Use restricted API keys.
- Restrict CORS and WebSocket origins in production.
- Use stronger JWT secret management.
- Add rate limiting for login and OTP endpoints.
- Add account lockout after repeated failed login attempts.
- Validate uploaded profile images.

---

## Future Scope

SmartGuardian can be extended with the following features:

- Live employee tracking dashboard
- Mobile application
- Real-time alert notifications
- Admin analytics dashboard
- Attendance reports
- Export reports as PDF or Excel
- Role and permission management panel
- AI-based anomaly detection for suspicious location activity
- Geofence violation alerts
- Push notifications
- Multi-tenant organization support
- Device-based tracking integration

---



