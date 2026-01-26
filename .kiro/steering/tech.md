# Technology Stack

## Framework & Runtime
- **Next.js 16.0.8** - React framework with App Router
- **React 19.2.1** - UI library
- **TypeScript 5** - Type safety and development experience
- **Node.js** - Runtime environment

## Database & ORM
- **PostgreSQL** - Primary database
- **Prisma 7.1.0** - Database ORM and schema management
- **@prisma/adapter-pg** - PostgreSQL adapter for Prisma

## Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Geist Font** - Typography (Sans & Mono variants)
- **PostCSS** - CSS processing

## Authentication & Security
- **bcryptjs** - Password hashing
- **jose** - JWT token handling
- **server-only** - Server-side code protection

## Development Tools
- **ESLint 9** - Code linting with Next.js config
- **tsx** - TypeScript execution
- **dotenv** - Environment variable management

## Common Commands

### Development
```bash
pnpm dev          # Start development server
pnpm build        # Build for production (includes Prisma generate)
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database
```bash
npx prisma generate    # Generate Prisma client
npx prisma migrate dev # Run database migrations
npx prisma studio      # Open Prisma Studio
```

### Package Management
- Uses **pnpm** as the package manager
- Lock file: `pnpm-lock.yaml`

## Build Process
1. Prisma client generation (`prisma generate`)
2. Next.js build process
3. TypeScript compilation
4. Tailwind CSS processing

## Environment Requirements
- Node.js (compatible with TypeScript 5)
- PostgreSQL database
- Environment variables for database connection