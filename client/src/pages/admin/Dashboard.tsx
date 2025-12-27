import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointments } from "@/hooks/use-appointments";
import { useDoctors } from "@/hooks/use-doctors";
import { Users, Calendar, Activity, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function AdminDashboard() {
  const { data: appointments } = useAppointments();
  const { data: doctors } = useDoctors();

  const totalAppts = appointments?.length || 0;
  const pendingAppts = appointments?.filter(a => a.status === 'pending').length || 0;
  const activeDoctors = doctors?.length || 0;
  const completedAppts = appointments?.filter(a => a.status === 'completed').length || 0;

  // Mock data for chart
  const data = [
    { name: 'Mon', visits: 40 },
    { name: 'Tue', visits: 30 },
    { name: 'Wed', visits: 45 },
    { name: 'Thu', visits: 55 },
    { name: 'Fri', visits: 60 },
    { name: 'Sat', visits: 25 },
    { name: 'Sun', visits: 10 },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Appointments", value: totalAppts, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Active Doctors", value: activeDoctors, icon: Users, color: "text-teal-600", bg: "bg-teal-50" },
          { title: "Pending Requests", value: pendingAppts, icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
          { title: "Completed Visits", value: completedAppts, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="visits" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#0f766e' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments?.slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center font-bold text-primary shadow-sm border">
                      {apt.patientName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{apt.patientName}</p>
                      <p className="text-xs text-muted-foreground">{apt.department}</p>
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full font-medium capitalize 
                    ${apt.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      apt.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {apt.status}
                  </div>
                </div>
              ))}
              {(!appointments || appointments.length === 0) && (
                <div className="text-center text-muted-foreground py-8">No appointments found</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
