# Team Members

O.P.N.Y.K Bandara
K.A.D.D Dananajana
M.D.K.D Malidu
M.J.H Pinto
M.T.N.S Perera

# BoardWise

BoardWise is a comprehensive boarding management system designed to streamline the experience for both boarding owners and students. It facilitates efficient management of properties, rooms, tenants, and payments, while helping students find their ideal accommodation near universities.

## Features

### For Owners

- **Dashboard**: Overview of properties, occupancy, and financials.
- **Property Management**: Manage boardings, rooms, and assigning tenants.
- **Tenant Management**: Track student details and occupancy.
- **Financials**: Manage monthly bills, rent payments, and view financial reports.
- **Role-based Access**: Secure owner accounts.

### For Students

- **Search & Discovery**: Find boardings near universities.
- **AI Recommendations**: Personalized boarding recommendations using Gemini AI based on preferences.
- **Profile Management**: Manage personal details and preferences.
- **Payments**: View and manage rent and bill payments (if applicable).

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Authentication**: JWT (Jose), Bcrypt
- **AI Integration**: Google Gemini AI (`@google/generative-ai`)
- **State Management/Data Fetching**: SWR
- **Forms**: Formik, Yup
- **Icons**: Lucide React, Tabler Icons

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB (Local or Atlas)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd boardwise
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up environment variables:
    Please ask the team members for the environment variables or just access the website using the public link.
    Create a `.env` file in the root directory based on `.env.example`:

    ```bash
    cp .env.example .env
    ```

    Required environment variables:

    ```env
    # Database
    DATABASE_URL="mongodb://localhost:27017/boardwise"

    # Authentication
    JWT_SECRET="your-secret-key-here"

    # AI Integration
    GEMINI_API_KEY="your-gemini-api-key"

    # Email Configuration (for password reset)
    EMAIL_USER="your-email@gmail.com"
    EMAIL_PASSWORD="your-app-password"

    # Application URL (required for password reset emails)
    # For local: http://localhost:3000
    # For production: https://your-domain.vercel.app
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

    **Note for Production Deployment (Vercel):**
    - Set `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL (e.g., `https://board-wise-five.vercel.app`)
    - This is required for password reset emails to work correctly

4.  Run the development server:

    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/(owner)`: Routes specific to boarding owners.
- `app/(students)`: Routes specific to students.
- `app/api`: API routes for data handling.
- `models`: Mongoose data models (User, Boarding, Room, etc.).
- `lib`: Utility functions (DB connection, Auth, etc.).
- `_components`: Reusable UI components.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs ESLint.

## License

[MIT](LICENSE)
