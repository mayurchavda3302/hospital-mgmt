import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import MemoryStore from "memorystore";

const scryptAsync = promisify(scrypt);
const SessionStore = MemoryStore(session);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === AUTH SETUP ===
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "super_secret_session_key",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({ checkPeriod: 86400000 }),
      cookie: { maxAge: 86400000 },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // === AUTH ROUTES ===
  app.post(api.auth.login.path, (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not logged in" });
    res.json(req.user);
  });

  // === DOCTOR ROUTES ===
  app.get(api.doctors.list.path, async (req, res) => {
    const department = req.query.department as string | undefined;
    const doctors = await storage.getDoctors(department);
    res.json(doctors);
  });

  app.get(api.doctors.get.path, async (req, res) => {
    const doctor = await storage.getDoctor(Number(req.params.id));
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  });

  app.post(api.doctors.create.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.doctors.create.input.parse(req.body);
      const hashedPassword = await hashPassword(input.password);
      
      const user = await storage.createUser({
        username: input.username,
        password: hashedPassword,
        role: "doctor",
        name: input.name
      });

      const doctor = await storage.createDoctor({
        ...input.doctorProfile,
        userId: user.id,
        name: input.name
      });
      
      res.status(201).json(doctor);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.doctors.delete.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await storage.deleteDoctor(Number(req.params.id));
    res.status(204).send();
  });

  // === APPOINTMENT ROUTES ===
  app.post(api.appointments.create.path, async (req, res) => {
    try {
      const input = api.appointments.create.input.parse(req.body);
      const appt = await storage.createAppointment({
        ...input,
        date: new Date(input.date),
      });
      res.status(201).json(appt);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.appointments.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    // If doctor, only show their appointments (or if admin, show all or filter)
    const currentUser = req.user as any;
    let doctorId = undefined;
    
    if (currentUser.role === 'doctor') {
      const doctor = await storage.getDoctorByUserId(currentUser.id);
      if (doctor) doctorId = doctor.id;
    } else if (req.query.doctorId) {
        doctorId = Number(req.query.doctorId);
    }

    const appts = await storage.getAppointments(doctorId);
    res.json(appts);
  });

  app.patch(api.appointments.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const { status } = req.body;
    const updated = await storage.updateAppointmentStatus(Number(req.params.id), status);
    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.json(updated);
  });

  app.patch(api.appointments.assign.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { doctorId } = req.body;
    const updated = await storage.assignDoctorToAppointment(Number(req.params.id), doctorId);
    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.json(updated);
  });

  // === CONTACT ROUTES ===
  app.post(api.contact.create.path, async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      const msg = await storage.createMessage(input);
      res.status(201).json(msg);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json(err);
      throw err;
    }
  });

  app.get(api.contact.list.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const msgs = await storage.getMessages();
    res.json(msgs);
  });

  // === SEED DATA ===
  const existingUsers = await storage.getUserByUsername("admin");
  if (!existingUsers) {
    const hashedPassword = await hashPassword("admin123");
    await storage.createUser({
      username: "admin",
      password: hashedPassword,
      role: "admin",
      name: "Super Admin"
    });
    console.log("Seeded admin user");

    // Seed some doctors
    const docPass = await hashPassword("doctor123");
    const docUser1 = await storage.createUser({ username: "dr.smith", password: docPass, role: "doctor", name: "Dr. John Smith" });
    await storage.createDoctor({
      userId: docUser1.id,
      name: "Dr. John Smith",
      specialization: "Cardiology",
      department: "General Medicine",
      experience: "15 years",
      qualifications: "MBBS, MD",
      contact: "555-0101",
      bio: "Expert cardiologist with 15 years of experience.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300"
    });

    const docUser2 = await storage.createUser({ username: "dr.jane", password: docPass, role: "doctor", name: "Dr. Jane Doe" });
    await storage.createDoctor({
      userId: docUser2.id,
      name: "Dr. Jane Doe",
      specialization: "Pediatrician",
      department: "Pediatrics",
      experience: "10 years",
      qualifications: "MBBS, DCH",
      contact: "555-0102",
      bio: "Caring pediatrician specialized in child healthcare.",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300"
    });
  }

  return httpServer;
}
