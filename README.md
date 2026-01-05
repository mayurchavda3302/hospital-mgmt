# Hospital Management System

This is a full-stack Hospital Management System built with React, Express, and PostgreSQL.

## Local Development Setup

Follow these steps to run the project on your local machine:

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **npm** or **yarn**

### 2. Environment Variables
Create a `.env` file in the root directory and add your PostgreSQL connection string:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/hospital_db
SESSION_SECRET=your_random_secret_here
```

### 3. Install Dependencies
Run the following command to install all required packages for both frontend and backend:
```bash
npm install
```

### 4. Setup Database
Sync the database schema using Drizzle:
```bash
npm run db:push
```

### 5. Start the Application
Run the development server (starts both backend and frontend):
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

### 6. Default Credentials
- **Admin**: `admin` / `admin123`
- **Doctor**: `dr.smith` / `doctor123`
