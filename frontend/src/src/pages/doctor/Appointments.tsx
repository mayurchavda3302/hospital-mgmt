import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { useAppointments, useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import { useDoctors } from "@/hooks/use-doctors";
import { format } from "date-fns";
import { CheckCircle, XCircle, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DoctorAppointments() {
  const { user } = useAuth();
  const { data: allDoctors } = useDoctors();
  const currentDoctor = allDoctors?.find(d => d.userId === user?.id);
  const { data: appointments, isLoading } = useAppointments(currentDoctor?.id);
  const { mutate: updateStatus } = useUpdateAppointmentStatus();

  const activeAppts = appointments?.filter(a => a.status === 'assigned' || a.status === 'approved' || a.status === 'pending');
  const pastAppts = appointments?.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">My Appointments</h1>
        <p className="text-slate-500">Manage your active and past patient visits.</p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            Active Appointments
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {activeAppts?.length || 0}
            </Badge>
          </h2>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Patient</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Symptoms</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeAppts?.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium">{apt.patientName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {apt.patientPhone}</span>
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {apt.patientEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{format(new Date(apt.date), "MMM d, yyyy")}</div>
                        <div className="text-xs text-slate-500">{format(new Date(apt.date), "h:mm a")}</div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-slate-600 italic">
                        {apt.message ? `"${apt.message}"` : "No notes provided"}
                      </TableCell>
                      <TableCell>
                        <Badge className={apt.status === 'approved' ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'}>
                          {apt.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-green-600 hover:bg-green-50"
                            onClick={() => updateStatus({ id: apt.id, status: 'completed' })}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Finish
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-red-600 hover:bg-red-50"
                            onClick={() => updateStatus({ id: apt.id, status: 'cancelled' })}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!activeAppts || activeAppts.length === 0) && (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">No active appointments</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-slate-600">Past Appointments</h2>
          <Card className="border-none shadow-sm opacity-80">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastAppts?.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium text-slate-600">{apt.patientName}</TableCell>
                      <TableCell className="text-slate-500">{format(new Date(apt.date), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-slate-500">{apt.department}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={apt.status === 'completed' ? 'text-green-600 border-green-200' : 'text-slate-400 border-slate-200'}>
                          {apt.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!pastAppts || pastAppts.length === 0) && (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-slate-400">No history found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminLayout>
  );
}
