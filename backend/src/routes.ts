import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import * as schema from "@shared/schema";
import { storage } from "./storage";
import { eq, desc } from "drizzle-orm";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import MemoryStore from "memorystore";
import { z } from "zod";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not logged in" });
    res.json(req.user);
  });

  // === DOCTOR ROUTES ===
  app.get("/api/doctors", async (req, res) => {
    const department = req.query.department as string | undefined;
    const doctors = await storage.getDoctors(department);
    res.json(doctors);
  });

  app.get("/api/doctors/:id", async (req, res) => {
    const doctor = await storage.getDoctor(Number(req.params.id));
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  });

  app.post("/api/doctors", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = req.body;
      const doctor = await storage.createDoctor(input);
      res.status(201).json(doctor);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json(err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete("/api/doctors/:id", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await storage.deleteDoctor(Number(req.params.id));
    res.status(204).send();
  });

  // === APPOINTMENT ROUTES ===
  app.post("/api/appointments", async (req, res) => {
    try {
      console.log("Received appointment request:", JSON.stringify(req.body));
      const input = req.body;
      const appt = await storage.createAppointment({
        patientName: input.patientName,
        patientPhone: input.patientPhone,
        patientEmail: input.patientEmail,
        department: input.department,
        message: input.message || null,
        date: new Date(String(input.date)),
        doctorId: input.doctorId && String(input.doctorId) !== "0" ? Number(input.doctorId) : null,
      });
      console.log("Created appointment:", appt);
      res.status(201).json(appt);
    } catch (err) {
      console.error("Appointment creation error detail:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: err.errors
        });
      }
      res.status(500).json({
        message: "Internal server error",
        error: err instanceof Error ? err.message : String(err)
      });
    }
  });

  app.get("/api/appointments", async (req, res) => {
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

  app.patch("/api/appointments/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    const { status } = req.body;
    const updated = await storage.updateAppointmentStatus(Number(req.params.id), status);
    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.json(updated);
  });

  app.patch("/api/appointments/:id/assign-doctor", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { doctorId } = req.body;
    const updated = await storage.assignDoctorToAppointment(Number(req.params.id), doctorId);
    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.json(updated);
  });

  // === CONTACT ROUTES ===
  app.post("/api/messages", async (req, res) => {
    try {
      const input = req.body;
      const msg = await storage.createMessage(input);
      res.status(201).json(msg);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json(err);
      throw err;
    }
  });

  app.get("/api/messages", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const msgs = await storage.getMessages();
    res.json(msgs);
  });

  // === PHARMACY ROUTES ===
  app.get("/api/pharmacies", async (req, res) => {
    const pharmacies = await storage.getPharmacies();
    res.json(pharmacies);
  });

  app.post("/api/pharmacies", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      console.log("Pharmacy creation request:", req.body);
      const input = req.body;
      const pharmacy = await storage.createPharmacy(input);
      console.log("Pharmacy created successfully:", pharmacy);
      res.status(201).json(pharmacy);
    } catch (err) {
      console.error("Pharmacy creation error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: err.errors 
        });
      }
      res.status(500).json({ 
        message: "Failed to create pharmacy: " + (err as Error).message 
      });
    }
  });

  app.delete("/api/pharmacies/:id", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      await storage.deletePharmacy(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      console.error("Pharmacy deletion error:", err);
      res.status(500).json({ 
        message: "Failed to delete pharmacy: " + (err as Error).message 
      });
    }
  });

  // === MEDICINE ROUTES ===
  app.get("/api/pharmacies/:id/medicines", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const medicines = await storage.getMedicines(Number(req.params.id));
    res.json(medicines);
  });

  app.get("/api/medicines/:id", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const medicine = await storage.getMedicine(Number(req.params.id));
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.json(medicine);
  });

  app.post("/api/pharmacies/:id/medicines", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = req.body;
      const medicine = await storage.createMedicine({
        ...input,
        pharmacyId: Number(req.params.id)
      });
      res.status(201).json(medicine);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json(err);
      throw err;
    }
  });

  // === FILE UPLOAD ROUTE ===
  const upload = multer({ 
    dest: 'uploads/',
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  });

  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      console.log('Upload request received:', req.file, req.body);
      
      if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
      }
      
      // Generate unique filename
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `pharmacy-${Date.now()}${fileExtension}`;
      const targetPath = path.join(__dirname, '../../../Health-Connect/frontend/public/images', fileName);
      
      console.log('Moving file to:', targetPath);
      
      // Ensure directory exists
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Move file from temp location to target
      fs.renameSync(req.file.path, targetPath);
      
      console.log('File moved successfully');
      
      res.json({ 
        message: "File uploaded successfully",
        path: `/images/${fileName}`
      });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ message: "Upload failed: " + (err as Error).message });
    }
  });

  // === MEDICINE REQUEST ROUTES ===
  app.post("/api/medicine-requests", async (req, res) => {
    try {
      const input = req.body;
      const request = await storage.createMedicineRequest(input);
      res.status(201).json(request);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json(err);
      throw err;
    }
  });

  app.get("/api/medicine-requests", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const requests = await storage.getMedicineRequests();
    res.json(requests);
  });

  app.patch("/api/medicine-requests/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { status } = req.body;
    const updated = await storage.updateMedicineRequestStatus(Number(req.params.id), status);
    if (!updated) return res.status(404).json({ message: "Request not found" });
    res.json(updated);
  });
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

    const docPass = await hashPassword("doctor123");
    let docUser1 = await storage.getUserByUsername("dr.gayatri");
    if (!docUser1) {
      docUser1 = await storage.createUser({
        username: "dr.gayatri",
        password: docPass,
        role: "doctor",
        name: "Dr. Gayatri Thaker"
      });
      await storage.createDoctor({
        userId: docUser1.id,
        name: "Dr. Gayatri Thaker",
        specialization: "Obstetrician & Gynaecologist",
        department: "Gynaecology",
        experience: "20+ years",
        qualifications: "M.D.(O&G) GOLD MEDALIST",
        contact: "+91 288-2510077",
        bio: "Experienced Obstetrician, Gynaecologist & Sonologist. Gold Medalist in M.D.(O&G).",
        image: "/images/dr_gayatri.jpg"
      });
      console.log("Seeded Dr. Gayatri Thaker");
    }

    let docUser2 = await storage.getUserByUsername("dr.suresh");
    if (!docUser2) {
      docUser2 = await storage.createUser({
        username: "dr.suresh",
        password: docPass,
        role: "doctor",
        name: "Dr. Suresh Thaker"
      });
      await storage.createDoctor({
        userId: docUser2.id,
        name: "Dr. Suresh Thaker",
        specialization: "Pediatrician & Neonatologist",
        department: "Pediatrics",
        experience: "20+ years",
        qualifications: "Children Specialist & Neonatologist",
        contact: "+91 288-2557197",
        bio: "Head Dept of Pediatrics. Dedicated Children Specialist & Neonatologist.",
        image: "/images/dr_suresh.png"
      });
      console.log("Seeded Dr. Suresh Thaker");
    }

    // Seed Pharmacy data
    const existingPharmacy = await storage.getPharmacies();
    if (existingPharmacy.length === 0) {
      await storage.createPharmacy({
        name: "City Medical Pharmacy",
        location: "Near Hospital Gate, Jamnagar",
        contact: "+91 288-2561234",
        description: "24/7 pharmacy service with all medicines available",
        image: "/images/pharmacy-city-medical.jpg"
      });
      
      await storage.createPharmacy({
        name: "SVH Hospital Pharmacy",
        location: "Inside Hospital Building, Ground Floor",
        contact: "+91 288-2510017",
        description: "In-house pharmacy with immediate medicine availability",
        image: "/images/pharmacy-svh-hospital.jpg"
      });
      
      await storage.createPharmacy({
        name: "MediCare Plus",
        location: "Main Road, Jamnagar",
        contact: "+91 288-2578912",
        description: "Complete medical store with surgical supplies",
        image: "/images/pharmacy-medicare-plus.jpg"
      });
      
      console.log("Seeded pharmacy data");
    }
  }

  return httpServer;
}
