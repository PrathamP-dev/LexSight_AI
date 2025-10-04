# LegalMind - AI-Powered Legal Document Analysis

## Overview
LegalMind is a Next.js application that makes legal documents simple and accessible for everyone. It helps simplify contracts, agreements, and compliance with AI technology for both legal and non-legal users.

## Current State
- Successfully imported from GitHub and configured for Replit environment
- Next.js 15.3.3 application running on port 5000
- Uses Google Genkit for AI functionality
- Built with React, TypeScript, Tailwind CSS, and Radix UI components
- Deployment configured for autoscale (npm run build -> npm start)
- Frontend fully functional with responsive design
- **Database**: Supabase PostgreSQL for persistent user and document storage
- Authentication system with secure password hashing

## Recent Changes
- **2025-10-04**: Supabase Database Integration
  - Integrated Supabase for persistent data storage
  - Created database schema for users and documents tables
  - Updated db.ts to use Supabase client instead of in-memory storage
  - Stored Supabase credentials securely in environment variables
  - Documents now persist across restarts and device changes
  - Access control enforced at application layer via session-based authentication
  - All database operations are server-side through authenticated API routes
  - See SUPABASE_SETUP.md for database setup instructions

- **2025-10-04**: Fresh GitHub import successfully configured for Replit
  - Installed all npm dependencies (633 packages)
  - Configured Next.js for Replit proxy environment with allowedDevOrigins
  - Dev server running on port 5000 with host 0.0.0.0 (required for Replit)
  - Updated deployment configuration for autoscale production
  - Verified frontend displays correctly - landing page, auth flows working
  - WebGL 3D effects gracefully fallback to solid background in headless environments
  - All TypeScript and LSP errors resolved

## Project Architecture
- **Frontend**: Next.js 15 with React 18, TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **Database**: Supabase (PostgreSQL) for persistent data storage
- **Authentication**: Custom auth with bcrypt password hashing
- **AI Integration**: Google Genkit with Google AI (Gemini)
- **Build Tool**: Next.js with Turbopack
- **3D Graphics**: OGL library for visual effects

## Key Features
- AI-powered document analysis
- Risk analysis for legal documents
- Clause summarization
- Dark/light theme support
- Responsive design with modern UI components

## Environment Setup
- Node.js application
- Development server: `npm run dev` (port 5000)
- Build command: `npm run build`
- Production server: `npm start`

## Database Setup
- **Database**: Supabase PostgreSQL
- **Required Secrets**: SUPABASE_URL, SUPABASE_ANON_KEY (already configured)
- **Setup Instructions**: See SUPABASE_SETUP.md for table creation
- **Tables**: users, documents
- **Security**: Application-layer access control via session authentication
- **API Routes**: All database operations are server-side and session-protected

## Configuration Notes
- Next.js configured with allowedDevOrigins for Replit proxy support
- TypeScript errors ignored during build for rapid development
- ESLint errors ignored during builds
- Remote image patterns configured for placehold.co

## AI Configuration
- Requires GEMINI_API_KEY environment variable for AI features
- AI functionality gracefully disabled if API key is not present
- Includes flows for risk analysis and clause summarization