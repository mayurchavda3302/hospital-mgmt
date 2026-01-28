import { useQuery } from "@tanstack/react-query";
import { Pharmacy } from "@shared/schema";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

export default function PharmacyList() {
    const { data: pharmacies, isLoading } = useQuery<Pharmacy[]>({
        queryKey: ["/api/pharmacies"],
    });

    return (
        <PublicLayout>
            <div className="bg-slate-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">
                            Pharmacy & Medicines
                        </h1>
                        <p className="text-lg text-slate-600">
                            Browse our trusted network of pharmacies and request essential medicines online.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="min-h-[400px] flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pharmacies?.map((pharmacy) => (
                                <Link key={pharmacy.id} href={`/pharmacy/${pharmacy.id}`}>
                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-none shadow-md overflow-hidden group">
                                        <div className="h-48 bg-slate-200 relative overflow-hidden">
                                            {pharmacy.image ? (
                                                <img
                                                    src={pharmacy.image}
                                                    alt={pharmacy.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                                    <span className="text-4xl font-bold font-display">
                                                        {pharmacy.name[0]}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <h3 className="text-xl font-bold">{pharmacy.name}</h3>
                                            </div>
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <p className="text-slate-600 text-sm line-clamp-2">
                                                    {pharmacy.description}
                                                </p>

                                                <div className="space-y-2 text-sm text-slate-500">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-primary" />
                                                        {pharmacy.location}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-primary" />
                                                        {pharmacy.contact}
                                                    </div>
                                                </div>

                                                <Button className="w-full group-hover:bg-primary/90">
                                                    View Medicines
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
