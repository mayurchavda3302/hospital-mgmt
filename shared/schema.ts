import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "doctor"] }).notNull().default("doctor"),
  name: text("name").notNull(),
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  department: text("department").notNull(),
  experience: text("experience").notNull(),
  qualifications: text("qualifications").notNull(),
  contact: text("contact").notNull(),
  bio: text("bio").notNull(),
  image: text("image"), // URL or placeholder
  isAvailable: boolean("is_available").default(true),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  patientPhone: text("patient_phone").notNull(),
  patientEmail: text("patient_email").notNull(),
  date: timestamp("date").notNull(),
  department: text("department").notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id),
  status: text("status", { enum: ["pending", "assigned", "confirmed", "completed", "cancelled"] }).notNull().default("pending"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["new", "read", "replied"] }).default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, {
    fields: [doctors.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.id],
  }),
}));

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertDoctorSchema = createInsertSchema(doctors).omit({ id: true });
export const insertAppointmentSchema = z.object({
  patientName: z.string().min(2, "Name is too short"),
  patientPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  patientEmail: z.string().email("Invalid email address"),
  department: z.string().min(1, "Department is required"),
  date: z.any(),
  message: z.string().optional().nullable(),
  doctorId: z.any().optional().nullable(),
});
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true, status: true });

// === TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Request Types
export type LoginRequest = { username: string; password: string };
export type CreateDoctorRequest = InsertUser & { doctorProfile: Omit<InsertDoctor, "userId"> };
export type UpdateAppointmentStatusRequest = { status: string };
export type AssignDoctorRequest = { doctorId: number };
