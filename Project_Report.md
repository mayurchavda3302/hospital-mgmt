
<br/>
<br/>
<br/>
<center>

# A
# PROJECT REPORT
# ON
# Hospital Management System

**SUBMITTED BY**

**Ms. NANDA ANCHAL VIMAL**

**Mr. KENIL BHANDERI**

<br/>

**ACADEMIC YEAR 2025-26**

**M.S.C IT SEM 3**

<br/>

**UNDER THE GUIDANCE OF**

**Mr. Shaunak Purohit**

<br/>

**SMT. C.Z.M. GOSRANI BCA & M.SC. (IT & CA)**

**COLLEGE JAMNAGAR**

<br/>
<br/>

**SUBMITTED TO**

**SAURASHTRA UNIVERSITY - RAJKOT**

</center>

<div style="page-break-after: always;"></div>

# ABSTRACT

The **Hospital Management System (Health-Connect)** is a modern, full-stack web application designed to streamline healthcare operations and improve patient care. In an era where digital transformation is reshaping industries, this platform offers a unified solution for managing doctors, appointments, and pharmacy operations.

The system features a **Doctor Appointment Booking** module that allows patients to browse specialists, view profiles, and book consultations seamlessly. For healthcare providers, it offers a robust **Admin Dashboard** to manage doctor profiles, track appointments, and handle patient inquiries.

A key highlight of this project is the **Pharmacy Management System**, which bridges the gap between patients and medication availability. Users can browse networked pharmacies, check medicine stock in real-time, and place requests for essential drugs. The system supports a complete workflow from request submission to admin approval.

Built using **React.js** for a dynamic frontend and **Node.js/Express** for a scalable backend, the application ensures high performance and security. It utilizes **PostgreSQL** for reliable data storage. With a focus on user experience, responsive design, and efficient workflow automation, Health-Connect aims to reduce administrative burden and enhance the overall efficiency of healthcare services.

<div style="page-break-after: always;"></div>

# ACKNOWLEDGEMENT

We feel great pleasure in submitting this project report as a part of Our **M.S.C Semester 3** curriculum. A practical study plays an important role in our professional development.

For the successful completion of Our project, We would especially like to thank my parents for their support and unconditional help. We would also like to thank Our Project Guide **Khushal Rajani** for their constant support and help in the implementation of this project.

We are also thankful to our Principal Mam, **Ms. Hetal G. Savla** for all the facilities they provided throughout our semester and for encouraging us to take up this activity.

Lastly, We would also like to thank the faculties and staff members of **Smt. C.Z.M. Gosrani B.C.A. College, Jamnagar** for their guidance.

<div style="page-break-after: always;"></div>

# PROJECT PROFILE

### STUDENT INFORMATION

| Name | Enrollment Numbers |
| :--- | :--- |
| **NANDA ANCHAL VIMAL** | **24CS032PG00105** |
| **KENIL BHANDERI** | **24CS032PG00094** |

### PROJECT DETAILS

| Detail | Description |
| :--- | :--- |
| **Project Title** | **Hospital Management System (Health-Connect)** |
| **Duration** | **4 Months** |
| **Frontend Technology** | **React.js, Tailwind CSS** |
| **Backend Technology** | **Node.js, Express.js** |
| **Database** | **PostgreSQL (via Drizzle ORM)** |
| **Type** | **Web Application** |

<div style="page-break-after: always;"></div>

# INDEX

1. **Introduction**
2. **System Analysis**
   - 2.1 Problem Statement
   - 2.2 Proposed Solution
   - 2.3 Scope of the System
3. **System Design**
   - 3.1 Database Schema (ERD Description)
   - 3.2 Data Flow Diagrams
4. **Implementation**
   - 4.1 Technology Stack
   - 4.2 Key Modules
5. **Testing & Verification**
6. **Conclusion**
7. **Bibliography**

<div style="page-break-after: always;"></div>

# 1. INTRODUCTION

The healthcare industry is one of the most critical sectors in the world. Efficient management of hospital resources, doctor schedules, and patient data is vital for ensuring timely and effective care. **Health-Connect** is a comprehensive Hospital Management System designed to digitize and automate these core processes.

Traditionally, hospitals rely on manual record-keeping or fragmented systems that do not communicate with each other. This leads to inefficiencies such as scheduling conflicts, lost patient records, and difficulties in managing pharmacy inventory. Health-Connect addresses these challenges by providing a centralized platform where patients, doctors, and administrators can interact seamlessly.

The project encompasses three main pillars:
1.  **Patient Services**: Easy appointment booking, doctor transfers, and medicine requests.
2.  **Hospital Administration**: Management of doctor profiles, departments, and appointment schedules.
3.  **Pharmacy Integration**: A dedicated module for managing pharmacy listings, medicine inventory, and fulfilling patient medicine requests.

# 2. SYSTEM ANALYSIS

## 2.1 Problem Statement
-   **Manual Appointment Scheduling**: Traditional systems often lead to long waiting times and double-booking errors.
-   **Lack of Pharmacy Integration**: Patients usually have to visit physical stores to find medicines, often facing stock unavailability.
-   **Data Fragmentation**: Patient records, prescription details, and administrative data are often kept in separate silos.

## 2.2 Proposed Solution
Health-Connect proposes a web-based solution that:
-   Digitizes the appointment booking process with real-time availability.
-   Integrates a pharmacy management module allowing online medicine requests.
-   Provides a centralized dashboard for administrators to view and manage all hospital activities.
-   Ensures data security and role-based access control (Admin, Doctor, Guest).

## 2.3 Scope of the System
The current scope includes:
-   **Authentication**: Secure login for Admins and Doctors.
-   **Doctor Management**: CRUD operations for doctor profiles.
-   **Appointment System**: Booking, status tracking (Pending, Approved, Completed), and history.
-   **Pharmacy System**: Listing pharmacies, managing medicine stock, and processing requests.
-   **Responsive UI**: Accessible on both desktop and mobile devices.

# 3. SYSTEM DESIGN

## 3.1 Database Schema (ERD Description)
The system uses a relational database (PostgreSQL) with the following key entities:

-   **Users**: Stores authentication credentials (username, password, role).
-   **Doctors**: Links to Users and stores professional details (specialization, bio, department).
-   **Appointments**: Connects Patients to Doctors with attributes like date, status, and message.
-   **Pharmacies**: Stores pharmacy details (name, location, contact, image).
-   **Medicines**: Linked to Pharmacies, storing drug details (name, price in INR, stock).
-   **Medicine_Requests**: Tracks patient requests for medicines, linked to both Medicines and Pharmacies.

## 3.2 Key Relationships
-   **One-to-One**: User <-> Doctor (A user account can belong to one doctor profile).
-   **One-to-Many**: Doctor -> Appointments (One doctor has many appointments).
-   **One-to-Many**: Pharmacy -> Medicines (One pharmacy stocks many medicines).
-   **One-to-Many**: Medicine -> Medicine_Requests (A medicine can be requested multiple times).

# 4. IMPLEMENTATION

## 4.1 Technology Stack
-   **Frontend**: React.js (Vite), Tailwind CSS, Shadcn UI, Lucide React Icons.
-   **Backend**: Node.js, Express.js.
-   **Database**: PostgreSQL.
-   **ORM**: Drizzle ORM for type-safe database interactions.
-   **Authentication**: Passport.js (Local Strategy) with session handling.

## 4.2 Key Modules

### A. Admin Dashboard
The command center of the application. Admins can:
-   **Manage Doctors**: Add new doctors with their qualifications and specializations.
-   **Manage Pharmacy**: Add new pharmacies and update medicine inventory.
-   **Handle Requests**: Review and approve/reject medicine requests from patients.

### B. Public Portal
Accessible to all visitors without login.
-   **Doctor Directory**: Filter doctors by department.
-   **Appointment Booking**: Simple form to request an appointment.
-   **Pharmacy Browser**: View available pharmacies and their medicine catalog.

### C. Pharmacy Module
A specialized feature implementing:
-   **Inventory Management**: Tracking stock levels and prices (₹).
-   **Request Workflow**: User Request -> Pending -> Admin Approval -> Completed.

# 5. TESTING & VERIFICATION

The project underwent rigorous testing to ensure reliability.

### 5.1 Manual Testing Results
-   **Authentication Flow**: Verified that Admins and Doctors can login securely. Unauthorized access to admin routes is blocked.
-   **Appointment Booking**: Confirmed that appointments appear in the dashboard immediately after booking.
-   **Pharmacy Seeding**: Successfully ran scripts (`seed_pharmacy.ts`) to populate the database with realistic Indian data (e.g., Apollo Pharmacy, ₹ Pricing).
-   **Medicine Request**: Verified the end-to-end flow of a user requesting "Paracetamol" and an admin approving it from the dashboard.

### 5.2 Automated Checks
-   **Type Safety**: `npm run check` passed 0 errors.
-   **Database Sync**: `drizzle-kit push` successfully synchronized the schema without data loss.

# 6. CONCLUSION

The **Health-Connect** Hospital Management System successfully achieves its goal of digitizing core hospital operations. By integrating appointment booking with pharmacy management, it provides a holistic healthcare solution.

The system is designed to be scalable. Future enhancements could include:
-   **Payment Gateway Integration**: For online appointment and medicine payments.
-   **Symptom Checker AI**: Basic AI diagnosis based on patient inputs.
-   **Mobile Application**: A dedicated Android/iOS app for patients.

The project provided valuable learning exposure to full-stack development, database design, and real-world problem solving.

# 7. BIBLIOGRAPHY

1.  *React Documentation* - https://react.dev/
2.  *Express.js Guide* - https://expressjs.com/
3.  *PostgreSQL Documentation* - https://www.postgresql.org/docs/
4.  *Drizzle ORM Docs* - https://orm.drizzle.team/
5.  *Tailwind CSS* - https://tailwindcss.com/

<br/>
<br/>
<br/>
<center>*** End of Report ***</center>
