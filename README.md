# Real Estate Management System

A full-stack real estate platform with a Spring Boot + MongoDB backend and a React + Vite frontend. The application supports JWT authentication, role-based access, property management, image uploads, buyer purchase flows, and an admin dashboard.

## Current Stack

### Backend
- Java 17
- Spring Boot 3.4.4
- Spring Web
- Spring Security
- Spring Data MongoDB
- JWT (`jjwt`)
- Bean Validation
- Lombok
- Docker

### Frontend
- React 19
- Vite 6
- React Router DOM 7
- Axios
- Tailwind CSS
- Framer Motion
- Lucide React

## Repository Structure

```text
Realestate-Management-System/
├── RealestateApiServer/      # Spring Boot backend
├── realestate-frontend/      # React Vite frontend
└── .github/workflows/        # GitHub Actions workflows
```

## Implemented Features

### Authentication
- User registration
- Login with JWT access and refresh tokens
- Automatic token refresh in Axios interceptor
- Role-based route protection

### Roles
- `ROLE_BUYER`
- `ROLE_AGENT`
- `ROLE_ADMIN`

### Property Management
- Create property listings with multipart image upload
- Update property details and images
- Delete listings
- Browse available properties
- Property details page
- Property purchase flow for buyers
- Owned properties page for buyers
- My Listings page for agents and admins

### Admin Module
- Admin dashboard overview
- User listing and user details
- Role update for users
- Global property management
- Property details and agent reassignment

### Media Handling
- Filesystem-based image storage
- Static image serving from backend
- Multiple image upload
- Frontend fallback handling for missing/broken images

## Architecture

### Backend Layers
- `Controller`: REST endpoints
- `Service`: business logic
- `Repository`: MongoDB data access
- `Security`: JWT filter, token service, user details service
- `Config`: security, password encoder, static resource mapping

### Frontend Structure
- `src/modules`: feature pages grouped by domain
- `src/components`: reusable UI
- `src/api`: Axios configuration
- `src/utils`: auth, property, theme helpers
- `src/shared`: shared constants and helpers

## Main API Areas

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### Properties
- `GET /api/properties`
- `GET /api/properties/search`
- `GET /api/properties/{id}`
- `GET /api/properties/buyer/{buyerId}`
- `POST /api/properties/add`
- `PUT /api/properties/{id}`
- `PATCH /api/properties/{id}/purchase/{buyerId}`
- `DELETE /api/properties/{id}`

### Uploads
- `POST /api/upload/images`
- `GET /api/upload/images/{filename}`

### Admin
- `GET /api/admin/summary`
- `GET /api/admin/users`
- `GET /api/admin/users/{id}`
- `PATCH /api/admin/users/{id}/role`
- `GET /api/admin/properties`
- `GET /api/admin/properties/{id}`
- `PATCH /api/admin/properties/{id}/reassign-agent`

## Environment Configuration

### Backend
Set these as environment variables or rely on local defaults where noted:

```bash
MONGODB_URI=mongodb://localhost:27017/realestate_db
UPLOAD_DIR=/var/www/realestate/uploads
JWT_SECRET=change-this-to-a-strong-secret-with-32-plus-characters
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

Useful defaults from `application.properties`:
- MongoDB defaults to `mongodb://localhost:27017/realestate_db`
- access token expiry: 15 minutes
- refresh token expiry: 7 days

### Frontend

```bash
VITE_API_BASE_URL=http://localhost:8080
```

For GitHub Pages deployment, set the repository variable:

```bash
VITE_API_BASE_URL=https://your-backend-domain
```

## Local Development

### Backend

```bash
cd RealestateApiServer
mvn spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

### Frontend

```bash
cd realestate-frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

## Build

### Backend

```bash
cd RealestateApiServer
mvn -q -DskipTests compile
```

### Frontend

```bash
cd realestate-frontend
npm run build
```

## Docker

The backend includes a Dockerfile:

```bash
cd RealestateApiServer
docker build -t realestate-api .
docker run -p 8080:8080 realestate-api
```

## GitHub Pages Deployment

The frontend now includes a GitHub Actions workflow:

- `.github/workflows/deploy-frontend.yml`

It:
- installs frontend dependencies
- builds the Vite app
- publishes `realestate-frontend/dist` to GitHub Pages

### Required GitHub Setup
- Go to repository `Settings > Pages`
- Set source to `GitHub Actions`
- Add repository variable `VITE_API_BASE_URL` if your backend is deployed elsewhere

## Important Notes

- The frontend uses `BrowserRouter` with a Vite `base` path so GitHub Pages subpath deployment works.
- The backend stores uploaded images on the server filesystem, so production deployments must ensure `UPLOAD_DIR` is writable and persistent.
- Admin routes exist on both backend and frontend, but admin registration is not public.

## Verification Status

Current project state has been verified with:

```bash
cd RealestateApiServer && mvn -q -DskipTests compile
cd realestate-frontend && npm run build
```

## Authors
- Rahul Raman Dash
- Ayush Samanta
