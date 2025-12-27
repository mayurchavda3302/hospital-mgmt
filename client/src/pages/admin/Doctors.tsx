import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDoctors, useCreateDoctor, useDeleteDoctor } from "@/hooks/use-doctors";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { type InsertDoctor, type InsertUser } from "@shared/schema";

// Combined type for the form
type CreateDoctorForm = {
  name: string;
  specialization: string;
  department: string;
  experience: string;
  qualifications: string;
  contact: string;
  bio: string;
  username: string; // for user account
  password: string; // for user account
};

export default function DoctorsPage() {
  const { data: doctors, isLoading } = useDoctors();
  const { mutate: createDoctor, isPending } = useCreateDoctor();
  const { mutate: deleteDoctor } = useDeleteDoctor();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const form = useForm<CreateDoctorForm>();

  const onSubmit = (data: CreateDoctorForm) => {
    createDoctor({
      username: data.username,
      password: data.password,
      name: data.name,
      role: "doctor",
      doctorProfile: {
        name: data.name,
        specialization: data.specialization,
        department: data.department,
        experience: data.experience,
        qualifications: data.qualifications,
        contact: data.contact,
        bio: data.bio,
        image: null,
        isAvailable: true,
      }
    }, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
        toast({ title: "Success", description: "Doctor created successfully" });
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      deleteDoctor(id, {
        onSuccess: () => toast({ title: "Deleted", description: "Doctor removed" }),
      });
    }
  };

  const filteredDoctors = doctors?.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Doctors Management</h1>
          <p className="text-slate-500">Add, edit or remove doctors from the system.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" /> Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Doctor</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input {...form.register("name")} required placeholder="Dr. John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select onValueChange={(v) => form.setValue("department", v)}>
                    <SelectTrigger><SelectValue placeholder="Select Dept" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Input {...form.register("specialization")} required placeholder="e.g. Cardiologist" />
                </div>
                <div className="space-y-2">
                  <Label>Experience</Label>
                  <Input {...form.register("experience")} required placeholder="e.g. 10 Years" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Qualifications</Label>
                <Input {...form.register("qualifications")} required placeholder="MBBS, MD" />
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input {...form.register("contact")} required />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea {...form.register("bio")} required placeholder="Short biography..." />
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-2">User Account Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input {...form.register("username")} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" {...form.register("password")} required />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isPending}>
                {isPending ? "Creating..." : "Create Doctor Profile"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search doctors..." 
          className="pl-10" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors?.map((doctor) => (
          <Card key={doctor.id} className="group hover:shadow-lg transition-all border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  {doctor.name[0]}
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-destructive" onClick={() => handleDelete(doctor.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-bold text-lg text-slate-900">{doctor.name}</h3>
              <p className="text-primary text-sm font-medium mb-2">{doctor.department}</p>
              <div className="space-y-1 text-sm text-slate-500">
                <p>{doctor.qualifications}</p>
                <p>{doctor.contact}</p>
                <p className="line-clamp-2 text-xs mt-2">{doctor.bio}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredDoctors?.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
            No doctors found
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
