import { PublicLayout } from "@/components/PublicLayout";
import { useDoctors } from "@/hooks/use-doctors";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { Search, MapPin, Calendar, Star } from "lucide-react";
import { useState } from "react";

export default function Doctors() {
  const [deptFilter, setDeptFilter] = useState<string>("");
  const { data: doctors, isLoading } = useDoctors(deptFilter === "all" ? undefined : deptFilter);

  // Fallback image if user hasn't set one
  const getDoctorImage = (idx: number) => {
    // Array of doctor images from Unsplash
    const images = [
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80",
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80",
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80",
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&q=80",
    ];
    return images[idx % images.length];
  };

  return (
    <PublicLayout>
      <div className="bg-slate-50 py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Find a Doctor</h1>
          <p className="text-slate-500 max-w-2xl">
            Browse our list of specialist doctors and book an appointment with the one that suits your needs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 bg-white p-4 rounded-xl border shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search doctor by name..." className="pl-10 border-slate-200" />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-full md:w-[250px] border-slate-200">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Cardiology">Cardiology</SelectItem>
              <SelectItem value="Neurology">Neurology</SelectItem>
              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
              <SelectItem value="General">General Medicine</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Doctor Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors?.map((doctor, idx) => (
              <Card key={doctor.id} className="overflow-hidden border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img 
                    src={doctor.image || getDoctorImage(idx)} 
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 z-20 text-white">
                    <Badge className="bg-primary/90 hover:bg-primary mb-2 border-none">
                      {doctor.department}
                    </Badge>
                    <h3 className="text-xl font-bold">{doctor.name}</h3>
                    <p className="text-white/80 text-sm">{doctor.specialization}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span>{doctor.experience} Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>Medical City, Building A</span>
                    </div>
                    <div className="pt-2">
                      <p className="line-clamp-2 text-xs text-muted-foreground">{doctor.bio}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Link href={`/contact?doctor=${doctor.id}`} className="w-full">
                    <Button className="w-full gap-2">
                      <Calendar className="h-4 w-4" /> Book Appointment
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
