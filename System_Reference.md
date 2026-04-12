# System Reference Document
**Project:** Hospital Management System (Health-Connect)

This document provides a technical reference for the database models, API endpoints, and system structure. It is intended to help with creating further documentation or diagrams.

## 1. Project Structure
- **frontend/**: React application (Vite + Tailwind CSS).
    - `src/pages/`: Page components/routes.
    - `src/components/`: Reusable UI components.
    - `src/hooks/`: Custom React hooks (e.g., use-auth).
- **backend/**: Node.js/Express server.
    - `src/storage.ts`: Database interface methods.
    - `src/routes.ts`: API route implementation.
- **shared/**: Shared code between frontend and backend.
    - `schema.ts`: Database table definitions (Drizzle ORM) and Zod schemas.
    - `routes.ts`: API route definitions and contract.

## 2. Database Models

### Users (`users`)
Base table for authentication.
- **id**: `Serial (PK)` - Unique User ID.
- **username**: `Text (Unique)` - Login username.
- **password**: `Text` - Hashed password.
- **role**: `Text (Enum: 'admin', 'doctor')` - User role.
- **name**: `Text` - Display name.

### Doctors (`doctors`)
Detailed profile for doctor users.
- **id**: `Serial (PK)` - Unique Doctor ID.
- **userId**: `Integer (FK -> users.id)` - Link to User account.
- **name**: `Text` - Full name.
- **specialization**: `Text` - Medical specialization (e.g., Cardiologist).
- **department**: `Text` - Department name.
- **experience**: `Text` - Years of experience.
- **qualifications**: `Text` - Degrees/Certifications.
- **contact**: `Text` - Contact number.
- **bio**: `Text` - Short biography.
- **image**: `Text` - URL to profile image.
- **isAvailable**: `Boolean` - Availability status.

### Appointments (`appointments`)
Booking records.
- **id**: `Serial (PK)` - Appointment ID.
- **patientName**: `Text` - Patient's full name.
- **patientPhone**: `Text` - Patient's contact.
- **patientEmail**: `Text` - Patient's email.
- **date**: `Timestamp` - Scheduled date/time.
- **department**: `Text` - Selected department.
- **doctorId**: `Integer (FK -> doctors.id)` - Assigned doctor.
- **status**: `Text (Enum: 'pending', 'assigned', 'approved', 'completed', 'cancelled')`.
- **message**: `Text` - Patient's symptom description.
- **createdAt**: `Timestamp` - Record creation time.

### Pharmacies (`pharmacies`)
Networked pharmacy stores.
- **id**: `Serial (PK)` - Pharmacy ID.
- **name**: `Text` - Store name.
- **location**: `Text` - Address.
- **contact**: `Text` - Phone number.
- **description**: `Text` - About the pharmacy.
- **image**: `Text` - Store image URL.
- **isAvailable**: `Boolean` - Operational status.

### Medicines (`medicines`)
Inventory items for a pharmacy.
- **id**: `Serial (PK)` - Medicine ID.
- **pharmacyId**: `Integer (FK -> pharmacies.id)` - Owner pharmacy.
- **name**: `Text` - Medicine name.
- **description**: `Text` - Usage details.
- **price**: `Text` - Price string (e.g., "₹50").
- **stock**: `Integer` - Quantity available.
- **image**: `Text` - Medicine image URL.
- **requiresPrescription**: `Boolean` - If prescription is mandatory.

### Medicine Requests (`medicine_requests`)
Orders placed by users.
- **id**: `Serial (PK)` - Request ID.
- **pharmacyId**: `Integer (FK -> pharmacies.id)` - Target pharmacy.
- **medicineId**: `Integer (FK -> medicines.id)` - Requested item.
- **customerName**: `Text` - Name of buyer.
- **customerPhone**: `Text` - Contact of buyer.
- **customerAddress**: `Text` - Delivery address.
- **status**: `Text (Enum: 'pending', 'approved', 'rejected', 'completed')`.
- **paymentStatus**: `Text (Enum: 'pending', 'paid', 'failed')`.
- **createdAt**: `Timestamp` - Order time.

### Messages (`messages`)
Contact form submissions.
- **id**: `Serial (PK)`
- **name**, **email**, **message**: `Text`
- **status**: `Text (Enum: 'new', 'read', 'replied')`

## 3. API Endpoints

### Authentication
- `POST /api/auth/login`: Login user.
- `POST /api/auth/logout`: Logout user.
- `GET /api/auth/me`: Get current session user.

### Doctors
- `GET /api/doctors`: List all doctors (optional filter by department).
- `GET /api/doctors/:id`: Get specific doctor profile.
- `POST /api/doctors`: Create doctor (Admin only).
- `DELETE /api/doctors/:id`: Delete doctor (Admin only).

### Appointments
- `GET /api/appointments`: List appointments (optional filter by doctorId).
- `POST /api/appointments`: Book new appointment.
- `PATCH /api/appointments/:id/status`: Update status (e.g., 'approved').
- `PATCH /api/appointments/:id/assign`: Assign specific doctor.

### Pharmacies
- `GET /api/pharmacies`: List all pharmacies.
- `GET /api/pharmacies/:id`: Get pharmacy details.
- `POST /api/pharmacies`: Add new pharmacy (Admin only).

### Medicines
- `GET /api/pharmacies/:id/medicines`: List medicines for a pharmacy.
- `POST /api/pharmacies/:id/medicines`: Add medicine to pharmacy (Admin only).

### Medicine Requests
- `GET /api/medicine-requests`: List all requests.
- `POST /api/medicine-requests`: Submit new request.
- `PATCH /api/medicine-requests/:id/status`: Update request status (Admin only).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            