        # INFYBUYS

        INFYBUYS is a premium marketplace platform connecting buyers and sellers for business acquisitions. The platform provides a secure environment for business listings, buyer-seller messaging, Non-Disclosure Agreements (NDAs), and subscription-based access tiers.

        ## Project Structure

        This repository is organized as a monorepo with two main components:

        - `/frontend` - React/Vite frontend application
        - `/backend` - NestJS/TypeScript backend API

        ## 🚀 Quick Start

        ### Prerequisites

        - Node.js (v18+)
        - PostgreSQL
        - AWS S3 (for media storage)

        ### 1. Database Setup

        Ensure you have PostgreSQL running. Create a new database for the project.

        ### 2. Backend Setup

        ```bash
        cd backend
        npm install
        ```

        Copy the `.env.example` file to `.env` and fill in your credentials:
        ```bash
        cp .env.example .env
        ```

        Set up the database schema and seed the initial data (admin user and subscription plans):
        ```bash
        npx prisma generate
        npx prisma db push
        npm run seed
        ```

        Start the backend server:
        ```bash
        npm run start:dev
        ```
        The backend API will be available at `http://localhost:3000`.

        ### 3. Frontend Setup

        ```bash
        cd frontend
        npm install
        ```

        Copy the `.env.example` file to `.env`:
        ```bash
        cp .env.example .env
        ```
        *(Ensure `VITE_API_URL` is set to `http://localhost:3000`)*

        Start the development server:
        ```bash
        npm run dev
        ```
        The frontend will be available at `http://localhost:5173`.

        ## 🛠️ Tech Stack

        ### Frontend
        - **Framework:** React 18 with Vite
        - **Language:** TypeScript
        - **State Management:** Zustand, React Query
        - **Styling:** Tailwind CSS, shadcn/ui, Radix UI primitives
        - **Routing:** React Router v6
        - **Forms:** React Hook Form + Zod validation

        ### Backend
        - **Framework:** NestJS
        - **Language:** TypeScript
        - **Database:** PostgreSQL
        - **ORM:** Prisma
        - **Authentication:** JWT (JSON Web Tokens)
        - **Storage:** AWS S3 (Presigned URLs for secure media uploads)

        ## 🌟 Key Features

        - **Role-Based Access Control (RBAC):** Distinct portals for Buyers, Sellers, and Admins.
        - **Secure Media Uploads:** Direct-to-S3 uploads using short-lived presigned URLs.
        - **Subscription Tiers:** Gated features (like unlimited searches and messaging) using a robust subscription engine.
        - **NDA Management:** Built-in Non-Disclosure Agreement flows to protect sensitive business financials.
        - **Real-time Messaging:** Enquiry and messaging threads between buyers and sellers.

        ## 🚢 Deployment

        The application is configured to run on AWS EC2. 
        Build both applications before deploying:

        ```bash
        # Build Backend
        cd backend
        npm run build

        # Build Frontend
        cd frontend
        npm run build
        ```

        *Note: During EC2 testing, email verification can be bypassed by setting `EMAIL_VERIFICATION_ENABLED=false` and `VITE_EMAIL_VERIFICATION_ENABLED=false` in your respective `.env` files.*
