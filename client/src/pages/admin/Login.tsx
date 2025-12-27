import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { type LoginRequest } from "@shared/schema";
import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function AdminLogin() {
  const { login, isLoggingIn } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      toast({ title: "Welcome back!", description: "Successfully logged in." });
    } catch (error: any) {
      toast({ 
        title: "Login failed", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="bg-slate-900 text-white p-12 hidden lg:flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-3xl z-0" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <Heart className="h-6 w-6 fill-primary text-primary" />
            <span className="text-xl font-bold font-display">MediCare</span>
          </Link>
          <h1 className="text-5xl font-display font-bold mb-6">Professional Healthcare Management</h1>
          <p className="text-slate-300 text-lg max-w-md">Streamline hospital operations, manage appointments, and coordinate staff efficiently.</p>
        </div>
        <div className="relative z-10 text-sm opacity-50">© 2024 Medicare Portal System</div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <Card className="w-full max-w-md shadow-xl border-slate-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Portal Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...register("username")} placeholder="admin" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? "Authenticating..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
               <Link href="/" className="hover:text-primary underline">Return to Website</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
