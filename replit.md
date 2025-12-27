# MediCare Hospital Management System

## Overview

This is a full-stack hospital management web application built with React frontend and Express backend. The system provides three user interfaces: a public-facing website for patients to view hospital information and book appointments, an admin dashboard for managing doctors and appointments, and a doctor portal for viewing assigned appointments.

The application follows a monorepo structure with shared code between client and server, using TypeScript throughout. It implements a medical/healthcare theme with departments including Cardiology, Neurology, Pediatrics, Orthopedics, and more.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and entry animations
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy, session-based auth using express-session
- **Session Storage**: MemoryStore (development) with connect-pg-simple available for production
- **Password Hashing**: Node.js crypto module with scrypt algorithm

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit for database migrations (`npm run db:push`)

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── hooks/       # Custom React hooks (auth, doctors, appointments)
│       ├── pages/       # Page components (public, admin, doctor)
│       └── lib/         # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database access layer
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle table definitions
│   └── routes.ts     # API contract definitions with Zod
└── migrations/       # Database migrations
```

### Authentication Flow
- Role-based access control with "admin" and "doctor" roles
- Protected routes redirect unauthenticated users to login
- Session cookies maintain authentication state

### API Design
- RESTful API endpoints defined in `shared/routes.ts`
- Zod schemas for request/response validation
- Type-safe API contracts shared between frontend and backend

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database queries and schema management

### UI Components
- **Radix UI**: Headless UI primitives (dialogs, dropdowns, forms, etc.)
- **shadcn/ui**: Pre-styled component library built on Radix
- **Lucide React**: Icon library

### Authentication
- **Passport.js**: Authentication middleware
- **passport-local**: Username/password authentication strategy
- **express-session**: Session management

### Form Handling
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Zod integration for form validation

### Data Fetching
- **TanStack React Query**: Server state management with caching

### Date Handling
- **date-fns**: Date formatting and manipulation
- **react-day-picker**: Calendar component for date selection

### Charts (for admin dashboard)
- **Recharts**: Dashboard analytics charts