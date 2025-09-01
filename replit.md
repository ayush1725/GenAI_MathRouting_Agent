# Overview

Math Routing Agent is an AI-powered mathematical problem-solving system that implements an Agentic-RAG (Retrieval-Augmented Generation) architecture. The application functions as a mathematical professor, providing step-by-step solutions to mathematical problems with intelligent routing between a local knowledge base and web search capabilities. The system features AI guardrails for educational content filtering, human-in-the-loop feedback mechanisms for continuous improvement, and a comprehensive full-stack web application.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **API Design**: RESTful endpoints with Zod schema validation
- **Session Storage**: PostgreSQL-based session storage with connect-pg-simple
- **Development**: Hot reload with tsx and middleware logging

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon Database serverless connection
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations in `/migrations` directory
- **Vector Database**: Mock implementation with plans for Qdrant or Weaviate integration
- **In-Memory Storage**: Fallback memory storage implementation for development

## Core AI Components
- **Math Routing Agent**: Central intelligence that routes problems between knowledge base and web search
- **AI Guardrails**: Content validation system that filters for mathematical/educational content only
- **Vector Database Service**: Similarity search for matching problems in knowledge base
- **Web Search Integration**: MCP (Model Context Protocol) implementation for external knowledge retrieval
- **Feedback System**: Human-in-the-loop learning mechanism for solution improvement

## Database Schema Design
- **users**: User authentication and management
- **math_problems**: Storage for mathematical problems and their structured solutions
- **feedback_entries**: User feedback collection with ratings and comments
- **system_activity**: Activity logging for monitoring and analytics

## API Architecture
- **POST /api/solve**: Main problem-solving endpoint with guardrails and routing logic
- **POST /api/feedback**: Feedback submission for solution improvement
- **GET /api/status**: System health and statistics monitoring
- **Middleware**: Request logging, error handling, and response timing

## Authentication Strategy
- Session-based authentication with PostgreSQL storage
- User management through Drizzle ORM
- Secure password handling (implementation pending)

## Development Workflow
- **Type Safety**: Comprehensive TypeScript coverage across frontend, backend, and shared schemas
- **Path Aliases**: Organized imports with @ aliases for components, utils, and shared code
- **Hot Reload**: Development server with automatic recompilation
- **Build Process**: Separate client and server builds with esbuild for production

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm** and **drizzle-kit**: Type-safe ORM and database toolkit
- **express**: Web application framework for API endpoints
- **@tanstack/react-query**: Server state management for React frontend

## UI Component Libraries
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for styling
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Utility for managing component variants

## Development and Build Tools
- **vite**: Frontend build tool and development server
- **typescript**: Type system for JavaScript
- **tsx**: TypeScript execution for Node.js development
- **esbuild**: Fast bundler for production server builds

## Database and Storage
- **connect-pg-simple**: PostgreSQL session store for Express
- **pg**: PostgreSQL client library
- **zod**: Schema validation for API endpoints and database operations

## Planned Integrations
- **Vector Database**: Qdrant or Weaviate for mathematical problem similarity search
- **Web Search APIs**: Tavily, Exa, or Serper for external knowledge retrieval
- **Model Context Protocol (MCP)**: For standardized AI model interactions
- **DSPy Library**: For advanced prompt optimization and feedback loops (bonus feature)

## Development Environment
- **Replit**: Cloud development platform with live preview capabilities
- **Node.js**: Runtime environment with ES module support
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility