import { db } from "./db";
import { 
  users, doctors, appointments, messages,
  type User, type InsertUser, 
  type Doctor, type InsertDoctor,
  type Appointment, type InsertAppointment,
  type Message, type InsertMessage
} from "@shared/schema";
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
}

export class DatabaseStorage implements IStorage {
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
}

export const storage = new DatabaseStorage();
