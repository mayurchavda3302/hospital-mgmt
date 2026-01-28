import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Pharmacy, Medicine, insertMedicineRequestSchema } from "@shared/schema";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Phone, MapPin, Pill, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PharmacyDetails() {
    const { id } = useParams<{ id: string }>();

    const { data: pharmacy, isLoading: loadingPharmacy } = useQuery<Pharmacy>({
        queryKey: [`/api/pharmacies/${id}`],
    });

    const { data: medicines, isLoading: loadingMedicines } = useQuery<Medicine[]>({
        queryKey: [`/api/pharmacies/${id}/medicines`],
        enabled: !!id,
    });

    if (loadingPharmacy || loadingMedicines) {
        return (
            <PublicLayout>
                <div className="h-[600px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </PublicLayout>
        );
    }

    if (!pharmacy) {
        return (
            <PublicLayout>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold">Pharmacy Not Found</h2>
                    <Link href="/pharmacy">
                        <Button variant="link" className="mt-4">Back to Pharmacies</Button>
                    </Link>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/pharmacy" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Pharmacy List
                    </Link>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="h-32 w-32 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                            {pharmacy.image ? (
                                <img src={pharmacy.image} alt={pharmacy.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-600">
                                    {pharmacy.name[0]}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-bold mb-4">{pharmacy.name}</h1>
                            <p className="text-lg text-slate-300 max-w-2xl mb-6">{pharmacy.description}</p>
                            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" /> {pharmacy.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary" /> {pharmacy.contact}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold font-display">Available Medicines</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {medicines?.map((medicine) => (
                        <MedicineCard key={medicine.id} medicine={medicine} pharmacyId={pharmacy.id} />
                    ))}
                    {medicines?.length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-500 bg-slate-50 rounded-lg">
                            No medicines available at this moment.
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}

function MedicineCard({ medicine, pharmacyId }: { medicine: Medicine, pharmacyId: number }) {
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(insertMedicineRequestSchema),
        defaultValues: {
            patientName: "",
            patientPhone: "",
            patientAddress: "",
            pharmacyId: pharmacyId,
            medicineId: medicine.id,
            customerName: "",
            customerPhone: "",
            customerAddress: ""
        }
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            // Map form fields to API fields if they differ or just pass data
            // API expects customerName, customerPhone, customerAddress
            const res = await apiRequest("POST", "/api/medicine-requests", data);
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "Request Submitted",
                description: "The pharmacy will contact you shortly.",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to submit request. Please try again.",
                variant: "destructive"
            });
        }
    });

    return (
        <div className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Pill className="h-6 w-6" />
                    </div>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        Stock: {medicine.stock}
                    </span>
                </div>

                <h3 className="font-bold text-lg mb-2">{medicine.name}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{medicine.description}</p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-primary">{medicine.price}</span>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm">Request</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Request Medicine</DialogTitle>
                                <DialogDescription>
                                    Enter your details to request {medicine.name}.
                                </DialogDescription>
                            </DialogHeader>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4 pt-4">
                                    <FormField
                                        control={form.control}
                                        name="customerName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Your Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="customerPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+1234567890" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="customerAddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Delivery Address</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Enter your full address" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Hidden fields for pharmacy/medicine Ids */}
                                    <FormField
                                        control={form.control}
                                        name="pharmacyId"
                                        render={({ field }) => <input type="hidden" {...field} value={pharmacyId} />}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="medicineId"
                                        render={({ field }) => <input type="hidden" {...field} value={medicine.id} />}
                                    />

                                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                                        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Submit Request
                                    </Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
