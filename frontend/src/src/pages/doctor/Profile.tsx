import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useDoctors } from "@/hooks/use-doctors";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

export default function DoctorProfile() {
  const { user } = useAuth();
  const { data: allDoctors } = useDoctors();
  const currentDoctor = allDoctors?.find(d => d.userId === user?.id);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: currentDoctor?.name || user?.name || "",
      specialization: currentDoctor?.specialization || "",
      department: currentDoctor?.department || "",
      experience: currentDoctor?.experience || "",
      qualifications: currentDoctor?.qualifications || "",
      contact: currentDoctor?.contact || "",
      bio: currentDoctor?.bio || "",
    }
  });

  const onSubmit = (data: any) => {
    // In this MVP, we just show a toast as profile editing is usually restricted or needs a specific endpoint
    toast({
      title: "Profile Update",
      description: "Profile update functionality would be implemented here.",
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500">View and manage your professional profile.</p>
      </div>

      <div className="max-w-2xl">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input {...form.register("name")} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input {...form.register("department")} disabled />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Input {...form.register("specialization")} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Experience</Label>
                  <Input {...form.register("experience")} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Qualifications</Label>
                <Input {...form.register("qualifications")} disabled />
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input {...form.register("contact")} />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea {...form.register("bio")} className="min-h-[120px]" />
              </div>
              <Button type="submit" className="w-full">Update Profile Settings</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
