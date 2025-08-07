# GiveEase - Donation Platform

## Overview

GiveEase is a full-stack donation platform built with React, Express.js, and PostgreSQL that connects verified users to facilitate the donation of unused items. The platform enables three types of users (donors, recipients, and NGOs) to interact in a secure, transparent ecosystem with admin oversight and role-based access control.

The application features user authentication with ID verification, item donation management with categorized listings, a matching system for connecting donors with recipients, and a proof-of-delivery system with photo uploads and thank-you messages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **Routing**: Wouter for client-side routing with protected routes based on user roles
- **State Management**: TanStack Query for server state management and React Context for authentication and theme state
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS styling
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Framework**: Express.js with TypeScript for RESTful API endpoints
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Uploads**: Multer middleware for handling image uploads with file type validation
- **Storage Pattern**: Abstract storage interface with in-memory implementation for development
- **Middleware**: Custom authentication middleware with role-based access control

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema Structure**: 
  - Users table with role-based access (pending, donor, recipient, ngo, admin)
  - Items table with donation lifecycle tracking (available, claimed, delivered)
  - Delivery proofs table linking items to recipient confirmations
- **Relationships**: Foreign key relationships between users, items, and delivery proofs

### Authentication & Authorization
- **User Verification**: Multi-step process including email verification and admin approval
- **Role-Based Access**: Five user roles with different permissions and dashboard access
- **ID Verification**: Planned OCR-based ID verification using Tesseract.js
- **Session Management**: JWT tokens with secure authentication middleware

### Data Flow Architecture
- **Item Lifecycle**: Available → Claimed → Delivered status progression
- **Matching System**: Location and category-based matching for connecting donors with recipients
- **Badge System**: Gamification with donation count-based badge levels (bronze, silver, gold)
- **Admin Oversight**: Admin approval workflows for user verification and content moderation

## External Dependencies

### Core Framework Dependencies
- **Frontend**: React 18 with TypeScript, Vite build system, and Wouter routing
- **Backend**: Express.js with TypeScript compilation via tsx
- **Database**: PostgreSQL with Neon serverless driver and Drizzle ORM

### UI & Styling
- **Component Library**: Radix UI primitives with Shadcn/ui component system
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Icons**: Lucide React icon library
- **Forms**: React Hook Form with Hookform/resolvers for validation

### Development & Build Tools
- **Build System**: Vite for frontend bundling and ESBuild for backend compilation
- **Type Checking**: TypeScript with strict configuration
- **Package Management**: npm with lockfile for dependency management
- **Development**: Hot module replacement via Vite with Replit-specific plugins

### Authentication & Security
- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: jsonwebtoken library for stateless authentication
- **Session Storage**: Planned connect-pg-simple for PostgreSQL session storage

### File Handling & Storage
- **File Uploads**: Multer for multipart form data handling with image validation
- **Image Processing**: Planned integration for image optimization and storage
- **OCR Processing**: Future Tesseract.js integration for ID document verification

### Database & ORM
- **Database Driver**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: Drizzle ORM with Drizzle Kit for schema migrations
- **Validation**: Drizzle-Zod for schema validation and type safety