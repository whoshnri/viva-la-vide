# Project Structure

## Root Configuration
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration with path aliases (`@/*`)
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration

## Application Structure (`app/`)
Uses Next.js App Router with file-based routing:

### Core Pages
- `app/page.tsx` - Landing page
- `app/layout.tsx` - Root layout with fonts and global components
- `app/globals.css` - Global styles

### Authentication Routes
- `app/login/` - Login page and form component
- `app/register/` - Registration page and form component

### Dashboard Routes (Protected)
- `app/dashboard/page.tsx` - Main dashboard
- `app/dashboard/layout.tsx` - Dashboard layout
- `app/dashboard/halls/` - Hall management
- `app/dashboard/students/` - Student and department management
- `app/dashboard/exams/` - Exam creation and management
- `app/dashboard/exams/[id]/` - Individual exam details

### API Routes
- `app/api/db-status/route.ts` - Database connectivity check

### Generated Code
- `app/generated/prisma/` - Auto-generated Prisma client and types

## Library Code (`lib/`)
- `lib/db.ts` - Prisma client configuration and connection
- `lib/actions.ts` - Server actions for form handling and data mutations
- `lib/logic.ts` - Core business logic and database operations

## Database (`prisma/`)
- `prisma/schema.prisma` - Database schema definition
- `prisma/migrations/` - Database migration files
- `prisma.config.ts` - Prisma configuration

## Components (`components/`)
- Reusable UI components
- `DbStatus.tsx` - Database connection status indicator

## Utilities (`scripts/`)
- `scripts/debug-allocation.ts` - Debugging utilities

## Static Assets (`public/`)
- SVG icons and static files

## Architecture Patterns

### Data Flow
1. **Client Components** - Handle user interactions and form state
2. **Server Actions** - Process form submissions and mutations (`lib/actions.ts`)
3. **Business Logic** - Core operations and validations (`lib/logic.ts`)
4. **Database Layer** - Prisma ORM with PostgreSQL

### Authentication Pattern
- JWT tokens stored in HTTP-only cookies
- Server actions validate authentication before operations
- `requireAuth()` helper for protected routes

### File Naming Conventions
- Page components: `page.tsx`
- Layout components: `layout.tsx`
- Client components: `ComponentName.tsx` (PascalCase)
- Server actions: `actions.ts`
- Business logic: `logic.ts`
- Database config: `db.ts`

### Import Aliases
- `@/*` - Maps to project root for clean imports
- Generated Prisma client: `@/app/generated/prisma/client`