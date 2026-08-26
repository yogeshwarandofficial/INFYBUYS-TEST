# INFYBUYS Frontend

The frontend for INFYBUYS, a premium marketplace platform for business acquisitions.

## Tech Stack

- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **State Management:** Zustand, React Query
- **Styling:** Tailwind CSS, shadcn/ui, Radix UI primitives
- **Routing:** React Router v6
- **API Client:** Axios (configured with interceptors for JWT)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and configure your API URL.
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Folder Structure

- `/src/components` - Reusable UI components (shadcn/ui + shared custom components)
- `/src/pages` - Route components categorized by portal (`/admin`, `/buyer`, `/seller`, `/public`)
- `/src/store` - Zustand state stores (`useUserStore`, `useBuyerStore`, etc.)
- `/src/services` - API client and service wrappers
- `/src/hooks` - React Query hooks for data fetching
- `/src/lib` - Utility functions and validations (Zod schemas)

> Please see the [root README.md](../README.md) for full-stack setup instructions, database seeding, and deployment details.
