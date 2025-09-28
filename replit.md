# LegalMind - AI-Powered Legal Document Analysis

## Overview
LegalMind is a Next.js application that provides AI-powered document analysis for legal professionals. It helps simplify contracts, agreements, and compliance with AI technology.

## Current State
- Successfully imported from GitHub and configured for Replit environment
- Next.js 15.3.3 application running on port 5000
- Uses Google Genkit for AI functionality
- Built with React, TypeScript, Tailwind CSS, and Radix UI components
- Deployment configured for autoscale

## Recent Changes
- **2025-09-28**: Initial project import and setup
  - Installed all dependencies
  - Fixed Next.js configuration for Replit environment
  - Updated dev server to run on port 5000 with host 0.0.0.0
  - Added allowedDevOrigins configuration for cross-origin support
  - Configured deployment settings for production

## Project Architecture
- **Frontend**: Next.js 15 with React 18, TypeScript
- **Styling**: Tailwind CSS with Radix UI components
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

## Configuration Notes
- Next.js configured with allowedDevOrigins for Replit proxy support
- TypeScript errors ignored during build for rapid development
- ESLint errors ignored during builds
- Remote image patterns configured for placehold.co

## AI Configuration
- Requires GEMINI_API_KEY environment variable for AI features
- AI functionality gracefully disabled if API key is not present
- Includes flows for risk analysis and clause summarization