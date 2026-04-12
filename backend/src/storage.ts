import { db } from "./db";
import { db as dbSqlite } from "./db_sqlite";
import {
  users, doctors, appointments, messages, pharmacies, medicines, medicineRequests,
  type User, type InsertUser,
  type Doctor, type InsertDoctor,
  type Appointment, type InsertAppointment,
  type Message, type InsertMessage,
  type Pharmacy, type InsertPharmacy,
  type Medicine, type InsertMedicine,
  type MedicineRequest, type InsertMedicineRequest
} from "@shared/schema";
import * as schemaSqlite from "@shared/schema_sqlite";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Doctor
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  getDoctor(id: number): Promise<Doctor | undefined>;
  getDoctorByUserId(userId: number): Promise<Doctor | undefined>;
  getDoctors(department?: string): Promise<Doctor[]>;
  deleteDoctor(id: number): Promise<void>;

  // Appointment
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(doctorId?: number): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;
  assignDoctorToAppointment(id: number, doctorId: number): Promise<Appointment | undefined>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;

  // Pharmacy
  createPharmacy(pharmacy: InsertPharmacy): Promise<Pharmacy>;
  getPharmacies(): Promise<Pharmacy[]>;
  getPharmacy(id: number): Promise<Pharmacy | undefined>;
  deletePharmacy(id: number): Promise<void>;

  // Medicine
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  getMedicines(pharmacyId: number): Promise<Medicine[]>;
  getMedicine(id: number): Promise<Medicine | undefined>;

  // Medicine Requests
  createMedicineRequest(request: InsertMedicineRequest): Promise<MedicineRequest>;
  getMedicineRequests(): Promise<MedicineRequest[]>;
  updateMedicineRequestStatus(id: number, status: string): Promise<MedicineRequest | undefined>;
}

export class PostgresStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const [newDoctor] = await db.insert(doctors).values(doctor).returning();
    return newDoctor;
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor;
  }

  async getDoctorByUserId(userId: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.userId, userId));
    return doctor;
  }

  async getDoctors(department?: string): Promise<Doctor[]> {
    if (department) {
      return await db.select().from(doctors).where(eq(doctors.department, department));
    }
    return await db.select().from(doctors);
  }

  async deleteDoctor(id: number): Promise<void> {
    await db.delete(doctors).where(eq(doctors.id, id));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppt] = await db.insert(appointments).values({
      patientName: appointment.patientName,
      patientPhone: appointment.patientPhone,
      patientEmail: appointment.patientEmail,
      department: appointment.department,
      message: appointment.message || null,
      date: new Date(String(appointment.date)),
      doctorId: appointment.doctorId ? Number(appointment.doctorId) : null,
    }).returning();
    return newAppt;
  }

  async getAppointments(doctorId?: number): Promise<Appointment[]> {
    if (doctorId) {
      return await db.select().from(appointments).where(eq(appointments.doctorId, doctorId)).orderBy(desc(appointments.date));
    }
    return await db.select().from(appointments).orderBy(desc(appointments.date));
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appt] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appt;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments)
      .set({ status: status as any })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  async assignDoctorToAppointment(id: number, doctorId: number): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments)
      .set({ doctorId, status: "assigned" })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [msg] = await db.insert(messages).values(message).returning();
    return msg;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  // Pharmacy
  async createPharmacy(pharmacy: InsertPharmacy): Promise<Pharmacy> {
    const [newPharmacy] = await db.insert(pharmacies).values(pharmacy).returning();
    return newPharmacy;
  }

  async getPharmacies(): Promise<Pharmacy[]> {
    return await db.select().from(pharmacies);
  }

  async getPharmacy(id: number): Promise<Pharmacy | undefined> {
    const [pharmacy] = await db.select().from(pharmacies).where(eq(pharmacies.id, id));
    return pharmacy;
  }

  async deletePharmacy(id: number): Promise<void> {
    await db.delete(pharmacies).where(eq(pharmacies.id, id));
  }

  // Medicine
  async createMedicine(medicine: InsertMedicine): Promise<Medicine> {
    const [newMedicine] = await db.insert(medicines).values(medicine).returning();
    return newMedicine;
  }

  async getMedicines(pharmacyId: number): Promise<Medicine[]> {
    return await db.select().from(medicines).where(eq(medicines.pharmacyId, pharmacyId));
  }

  async getMedicine(id: number): Promise<Medicine | undefined> {
    const [medicine] = await db.select().from(medicines).where(eq(medicines.id, id));
    return medicine;
  }

  // Medicine Requests
  async createMedicineRequest(request: InsertMedicineRequest): Promise<MedicineRequest> {
    const [newRequest] = await db.insert(medicineRequests).values(request).returning();
    return newRequest;
  }

  async getMedicineRequests(): Promise<MedicineRequest[]> {
    return await db.select().from(medicineRequests).orderBy(desc(medicineRequests.createdAt));
  }

  async updateMedicineRequestStatus(id: number, status: string): Promise<MedicineRequest | undefined> {
    const [updated] = await db.update(medicineRequests)
      .set({ status: status as any })
      .where(eq(medicineRequests.id, id))
      .returning();
    return updated;
  }
}

export class SqliteStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await dbSqlite.select().from(schemaSqlite.users).where(eq(schemaSqlite.users.id, id));
    return user as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await dbSqlite.select().from(schemaSqlite.users).where(eq(schemaSqlite.users.username, username));
    return user as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await dbSqlite.insert(schemaSqlite.users).values(user).returning();
    return newUser as User;
  }

  async createDoctor(doctor: InsertDoctor): Promise<Doctor> {
    const [newDoctor] = await dbSqlite.insert(schemaSqlite.doctors).values(doctor).returning();
    return newDoctor as Doctor;
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    const [doctor] = await dbSqlite.select().from(schemaSqlite.doctors).where(eq(schemaSqlite.doctors.id, id));
    return doctor as Doctor;
  }

  async getDoctorByUserId(userId: number): Promise<Doctor | undefined> {
    const [doctor] = await dbSqlite.select().from(schemaSqlite.doctors).where(eq(schemaSqlite.doctors.userId, userId));
    return doctor as Doctor;
  }

  async getDoctors(department?: string): Promise<Doctor[]> {
    if (department) {
      const docs = await dbSqlite.select().from(schemaSqlite.doctors).where(eq(schemaSqlite.doctors.department, department));
      return docs as Doctor[];
    }
    const docs = await dbSqlite.select().from(schemaSqlite.doctors);
    return docs as Doctor[];
  }

  async deleteDoctor(id: number): Promise<void> {
    await dbSqlite.delete(schemaSqlite.doctors).where(eq(schemaSqlite.doctors.id, id));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppt] = await dbSqlite.insert(schemaSqlite.appointments).values({
      patientName: appointment.patientName,
      patientPhone: appointment.patientPhone,
      patientEmail: appointment.patientEmail,
      department: appointment.department,
      message: appointment.message || null,
      date: new Date(String(appointment.date)),
      doctorId: appointment.doctorId ? Number(appointment.doctorId) : null,
    }).returning();
    return newAppt as Appointment;
  }

  async getAppointments(doctorId?: number): Promise<Appointment[]> {
    if (doctorId) {
      const appts = await dbSqlite.select().from(schemaSqlite.appointments).where(eq(schemaSqlite.appointments.doctorId, doctorId)).orderBy(desc(schemaSqlite.appointments.date));
      return appts as Appointment[];
    }
    const appts = await dbSqlite.select().from(schemaSqlite.appointments).orderBy(desc(schemaSqlite.appointments.date));
    return appts as Appointment[];
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appt] = await dbSqlite.select().from(schemaSqlite.appointments).where(eq(schemaSqlite.appointments.id, id));
    return appt as Appointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const [updated] = await dbSqlite.update(schemaSqlite.appointments)
      .set({ status: status as any })
      .where(eq(schemaSqlite.appointments.id, id))
      .returning();
    return updated as Appointment;
  }

  async assignDoctorToAppointment(id: number, doctorId: number): Promise<Appointment | undefined> {
    const [updated] = await dbSqlite.update(schemaSqlite.appointments)
      .set({ doctorId, status: "assigned" })
      .where(eq(schemaSqlite.appointments.id, id))
      .returning();
    return updated as Appointment;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [msg] = await dbSqlite.insert(schemaSqlite.messages).values(message).returning();
    return msg as Message;
  }

  async getMessages(): Promise<Message[]> {
    const msgs = await dbSqlite.select().from(schemaSqlite.messages).orderBy(desc(schemaSqlite.messages.createdAt));
    return msgs as Message[];
  }

  // Pharmacy
  async createPharmacy(pharmacy: InsertPharmacy): Promise<Pharmacy> {
    const [newPharmacy] = await dbSqlite.insert(schemaSqlite.pharmacies).values(pharmacy).returning();
    return newPharmacy as Pharmacy;
  }

  async getPharmacies(): Promise<Pharmacy[]> {
    const pharms = await dbSqlite.select().from(schemaSqlite.pharmacies);
    return pharms as Pharmacy[];
  }

  async getPharmacy(id: number): Promise<Pharmacy | undefined> {
    const [pharmacy] = await dbSqlite.select().from(schemaSqlite.pharmacies).where(eq(schemaSqlite.pharmacies.id, id));
    return pharmacy as Pharmacy;
  }

  async deletePharmacy(id: number): Promise<void> {
    await dbSqlite.delete(schemaSqlite.pharmacies).where(eq(schemaSqlite.pharmacies.id, id));
  }

  // Medicine
  async createMedicine(medicine: InsertMedicine): Promise<Medicine> {
    const [newMedicine] = await dbSqlite.insert(schemaSqlite.medicines).values(medicine).returning();
    return newMedicine as Medicine;
  }

  async getMedicines(pharmacyId: number): Promise<Medicine[]> {
    const meds = await dbSqlite.select().from(schemaSqlite.medicines).where(eq(schemaSqlite.medicines.pharmacyId, pharmacyId));
    return meds as Medicine[];
  }

  async getMedicine(id: number): Promise<Medicine | undefined> {
    const [medicine] = await dbSqlite.select().from(schemaSqlite.medicines).where(eq(schemaSqlite.medicines.id, id));
    return medicine as Medicine;
  }

  // Medicine Requests
  async createMedicineRequest(request: InsertMedicineRequest): Promise<MedicineRequest> {
    const [newRequest] = await dbSqlite.insert(schemaSqlite.medicineRequests).values(request).returning();
    return newRequest as MedicineRequest;
  }

  async getMedicineRequests(): Promise<MedicineRequest[]> {
    const reqs = await dbSqlite.select().from(schemaSqlite.medicineRequests).orderBy(desc(schemaSqlite.medicineRequests.createdAt));
    return reqs as MedicineRequest[];
  }

  async updateMedicineRequestStatus(id: number, status: string): Promise<MedicineRequest | undefined> {
    const [updated] = await dbSqlite.update(schemaSqlite.medicineRequests)
      .set({ status: status as any })
      .where(eq(schemaSqlite.medicineRequests.id, id))
      .returning();
    return updated as MedicineRequest;
  }
}

export const storage = process.env.DATABASE_URL ? new PostgresStorage() : new SqliteStorage();
