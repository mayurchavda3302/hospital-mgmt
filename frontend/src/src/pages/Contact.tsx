import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppointmentSchema, type InsertAppointment } from "@shared/schema";
import { useCreateAppointment } from "@/hooks/use-appointments";
import { useToast } from "@/hooks/use-toast";
import { useDoctors } from "@/hooks/use-doctors";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const { mutate, isPending } = useCreateAppointment();
  const { data: doctors } = useDoctors();

  const form = useForm({
    resolver: zodResolver(insertAppointmentSchema),
    defaultValues: {
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      department: "General",
      date: new Date().toISOString().split('T')[0],
      message: "",
      doctorId: "0"
    }
  });

  const onSubmit = (data: any) => {
    const payload = { 
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientEmail: data.patientEmail,
      department: data.department,
      message: data.message || "",
      date: String(data.date),
      doctorId: data.doctorId && String(data.doctorId) !== "0" ? String(data.doctorId) : null
    };
    
    console.log("Submitting appointment payload:", payload);
    mutate(payload as any, {
      onSuccess: () => {
        toast({
          title: "Appointment Request Sent",
          description: "We will confirm your appointment shortly via email/phone.",
        });
        form.reset();
      },
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <PublicLayout>
      <div className="bg-slate-50 py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Contact & Appointments</h1>
          <p className="text-slate-500">Book your visit or get in touch with our team.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Appointment Form */}
          <div>
            <h2 className="text-2xl font-bold font-display mb-6">Book an Appointment</h2>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input {...form.register("patientName")} placeholder="John Doe" />
                  {form.formState.errors.patientName && <p className="text-xs text-red-500">{form.formState.errors.patientName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input {...form.register("patientPhone")} placeholder="+1 (555) 000-0000" />
                  {form.formState.errors.patientPhone && <p className="text-xs text-red-500">{form.formState.errors.patientPhone.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input {...form.register("patientEmail")} type="email" placeholder="john@example.com" />
                {form.formState.errors.patientEmail && <p className="text-xs text-red-500">{form.formState.errors.patientEmail.message}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select onValueChange={(val) => form.setValue("department", val)} defaultValue={form.getValues("department")}>
                    <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gynaecology">Gynaecology & Obstetrics</SelectItem>
                      <SelectItem value="IVF">Test Tube Baby Center</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics & Neonatology</SelectItem>
                      <SelectItem value="Medicine">General Medicine & Surgery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Doctor (Optional)</Label>
                  <Select onValueChange={(val) => form.setValue("doctorId", val === "0" ? "0" : val)} defaultValue={form.getValues("doctorId")}>
                    <SelectTrigger><SelectValue placeholder="Any Doctor" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Doctor</SelectItem>
                      {doctors?.map(d => (
                        <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.doctorId && <p className="text-xs text-red-500">{form.formState.errors.doctorId.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Appointment Date</Label>
                <Input {...form.register("date")} type="date" />
                {form.formState.errors.date && <p className="text-xs text-red-500">{form.formState.errors.date.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Message / Symptoms</Label>
                <Textarea {...form.register("message")} placeholder="Describe your symptoms briefly..." className="min-h-[120px]" />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                {isPending ? "Booking..." : "Confirm Appointment"}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold font-display mb-6">Get in Touch</h2>
            <div className="grid gap-6">
              {[
                { icon: Phone, title: "Phone Support", desc: "24/7 Emergency", detail: "+91 288-2510017" },
                { icon: Mail, title: "Email Us", desc: "For general inquiries", detail: "info@svhospitals.in" },
                { icon: MapPin, title: "Location", desc: "Jamnagar", detail: "Siddhi Vinayak Hospital, Jamnagar, Gujarat" },
                { icon: Clock, title: "Working Hours", desc: "Emergency is 24/7", detail: "Mon - Sat: 8:00 AM - 9:00 PM" },
              ].map((item, i) => (
                <Card key={i} className="p-6 flex items-start gap-4 hover:shadow-md transition-all">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                    <p className="text-primary font-medium mt-1">{item.detail}</p>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Map Placeholder */}
            <div className="h-64 bg-slate-100 rounded-2xl border flex items-center justify-center text-slate-400">
              Google Maps Integration
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
