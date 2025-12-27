import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import Home from "@/pages/Home";
import Doctors from "@/pages/Doctors";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminDoctors from "@/pages/admin/Doctors";
import AdminAppointments from "@/pages/admin/Appointments";
import AdminRequests from "@/pages/admin/Requests";
import DoctorDashboard from "@/pages/doctor/Dashboard";
import DoctorProfile from "@/pages/doctor/Profile";
import NotFound from "@/pages/not-found";

// Protected Route Wrapper
function ProtectedRoute({ 
  component: Component, 
  role 
}: { 
  component: React.ComponentType, 
  role: "admin" | "doctor" 
}) {
  const { user, isLoading } = useAuth();
  const [_, setLocation] = useLocation();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!user || user.role !== role) {
    // Redirect logic: if trying to access admin but not admin, go to login
    setTimeout(() => setLocation("/admin/login"), 0);
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/doctors" component={Doctors} />
      <Route path="/departments" component={Home} /> {/* Reuse Home for now or add page */}
      <Route path="/about" component={Home} />
      <Route path="/contact" component={Contact} />

      {/* Auth Routes */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        <ProtectedRoute component={AdminDashboard} role="admin" />
      </Route>
      <Route path="/admin/doctors">
        <ProtectedRoute component={AdminDoctors} role="admin" />
      </Route>
      <Route path="/admin/appointments">
        <ProtectedRoute component={AdminAppointments} role="admin" />
      </Route>
      <Route path="/admin/requests">
        <ProtectedRoute component={AdminRequests} role="admin" />
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor/dashboard">
        <ProtectedRoute component={DoctorDashboard} role="doctor" />
      </Route>
      <Route path="/doctor/appointments">
        <ProtectedRoute component={DoctorDashboard} role="doctor" />
      </Route>
      <Route path="/doctor/profile">
        <ProtectedRoute component={DoctorProfile} role="doctor" />
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
