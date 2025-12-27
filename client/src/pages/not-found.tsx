import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md mx-4 text-center p-8">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="w-full">Return Home</Button>
        </Link>
      </Card>
    </div>
  );
}
