import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppointments, useAssignDoctor, useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import { useDoctors } from "@/hooks/use-doctors";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminAppointments() {
  const { data: appointments, isLoading } = useAppointments();
  const { data: doctors } = useDoctors();
  const { mutate: assignDoctor } = useAssignDoctor();
  const { mutate: updateStatus } = useUpdateAppointmentStatus();
  const { toast } = useToast();

  const handleAssign = (apptId: number, doctorIdStr: string) => {
    assignDoctor({ id: apptId, doctorId: parseInt(doctorIdStr) }, {
      onSuccess: () => toast({ title: "Success", description: "Doctor assigned successfully" }),
      onError: () => toast({ title: "Error", description: "Failed to assign doctor", variant: "destructive" }),
    });
  };

  const handleUpdateStatus = (id: number, status: string) => {
    updateStatus({ id, status }, {
      onSuccess: () => toast({ title: "Success", description: `Appointment ${status} successfully` }),
      onError: () => toast({ title: "Error", description: "Failed to update status", variant: "destructive" }),
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Appointments</h1>
        <p className="text-slate-500">Manage patient appointments and assign doctors.</p>
      </div>

      <Card className="shadow-sm border-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>Patient</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Doctor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : appointments?.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell>
                    <div className="font-medium">{apt.patientName}</div>
                    <div className="text-xs text-muted-foreground">{apt.patientPhone}</div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(apt.date), "MMM d, yyyy")}
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(apt.date), "h:mm a")}
                    </div>
                  </TableCell>
                  <TableCell>{apt.department}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        apt.status === 'approved' ? 'bg-teal-100 text-teal-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {apt.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select 
                        defaultValue={apt.doctorId?.toString()} 
                        onValueChange={(val) => handleAssign(apt.id, val)}
                      >
                        <SelectTrigger className="w-[180px] h-8 text-sm">
                          <SelectValue placeholder="Assign Doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors?.map(d => (
                            <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {apt.status === 'assigned' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleUpdateStatus(apt.id, 'approved')}
                        >
                          Approve
                        </Button>
                      )}
                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {appointments?.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8">No appointments found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
