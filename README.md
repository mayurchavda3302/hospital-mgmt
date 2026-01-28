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

### 6. Default Credentials & Seeding
On the first run, the system automatically creates the following default accounts if they don't exist:

**Admin Account:**
- **Username**: `admin`
- **Password**: `admin123`

**Doctor Accounts (Automatically seeded with profiles):**
- **Dr. Gayatri Thaker** (Gynaecologist)
  - **Username**: `dr.gayatri`
  - **Password**: `doctor123`
- **Dr. Suresh Thaker** (Pediatrician)
  - **Username**: `dr.suresh`
  - **Password**: `doctor123`

*> Note: These accounts are created automatically when the server starts. You do not need to run a manual script for them.*


### 7. Pharmacy Management Setup
To populate the database with test pharmacies and medicines (Indian context), run the seeding script:

**Clean and Seed (Resets Pharmacy Data):**
```bash
npx tsx script/clear_pharmacy.ts && npx tsx script/seed_pharmacy.ts
```

This will create:
- 6 Pharmacies (Apollo, MedPlus, Wellness Forever, etc.)
- ~30 Medicines with INR pricing
- Real images for pharmacies and medicines

### 8. Features
- **Doctor Appointment Booking**: Patients can book appointments with doctors.
- **Admin Dashboard**: Manage doctors, appointments, and requests.
- **Pharmacy Management**: 
  - Admin can add/edit pharmacies and medicines.
  - Users can browse pharmacies and request medicines.
  - Admin can approve/reject medicine requests.
