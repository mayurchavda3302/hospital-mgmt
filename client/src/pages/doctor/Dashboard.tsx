import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useAppointments, useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useDoctors } from "@/hooks/use-doctors";

export default function DoctorDashboard() {
  const { user } = useAuth();
  
  // In a real app, we'd have an endpoint to get doctor profile by user ID. 
  // Here we cheat by fetching all doctors and finding the match.
  const { data: allDoctors } = useDoctors();
  const currentDoctor = allDoctors?.find(d => d.userId === user?.id);

  const { data: appointments } = useAppointments(currentDoctor?.id);
  const { mutate: updateStatus } = useUpdateAppointmentStatus();

  const today = new Date().toDateString();
  const todaysAppts = appointments?.filter(a => new Date(a.date).toDateString() === today);
  const pendingAppts = appointments?.filter(a => a.status === 'assigned' || a.status === 'pending' || a.status === 'approved');

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Dr. {user?.name}</h1>
        <p className="text-slate-500">Here's your schedule for today, {format(new Date(), "MMMM d, yyyy")}.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary text-white border-none shadow-lg shadow-primary/20 hover-elevate">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium opacity-90">Today's Visits</h3>
            <p className="text-4xl font-bold mt-2">{todaysAppts?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-slate-500">Active Total</h3>
            <p className="text-4xl font-bold mt-2 text-slate-900">{pendingAppts?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-slate-500">Overall Patients</h3>
            <p className="text-4xl font-bold mt-2 text-slate-900">{appointments?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Today's Schedule</h2>
        <Button variant="link" onClick={() => window.location.href='/doctor/appointments'}>View All Appointments</Button>
      </div>
      <div className="space-y-4">
        {todaysAppts?.map((apt) => (
          <Card key={apt.id} className="border-l-4 border-l-primary shadow-sm hover-elevate transition-all">
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-primary font-bold">
                  {format(new Date(apt.date), "h:mm")}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{apt.patientName}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {apt.patientPhone}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {apt.patientEmail}</span>
                  </div>
                  {apt.message && <p className="text-sm mt-2 text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">"{apt.message}"</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => updateStatus({ id: apt.id, status: 'completed' })}
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> Mark Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {todaysAppts?.length === 0 && (
          <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No appointments scheduled for today.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.href='/doctor/appointments'}>View Future Appointments</Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
