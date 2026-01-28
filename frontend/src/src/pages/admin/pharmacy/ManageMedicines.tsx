import { useQuery, useMutation } from "@tanstack/react-query";
import { Medicine, insertMedicineSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function ManageMedicines({ pharmacyId }: { pharmacyId: number }) {
    const { data: medicines, isLoading } = useQuery<Medicine[]>({
        queryKey: [`/api/pharmacies/${pharmacyId}/medicines`],
    });

    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;

    return (
        <div className="mt-6 space-y-6">
            <div className="space-y-4">
                <h3 className="font-medium">Add New Medicine</h3>
                <AddMedicineForm pharmacyId={pharmacyId} />
            </div>

            <Separator />

            <div className="space-y-4">
                <h3 className="font-medium">Current Inventory ({medicines?.length || 0})</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {medicines?.map((medicine) => (
                        <Card key={medicine.id}>
                            <CardContent className="p-4 flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold">{medicine.name}</h4>
                                    <p className="text-sm text-slate-500">{medicine.description}</p>
                                    <div className="flex gap-4 mt-2 text-sm">
                                        <span className="text-primary font-medium">Price: {medicine.price}</span>
                                        <span className="text-slate-600">Stock: {medicine.stock}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {medicines?.length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-4">No medicines added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function AddMedicineForm({ pharmacyId }: { pharmacyId: number }) {
    const { toast } = useToast();
    // Schema expects pharmacyId but it's part of path param in create, so omit
    const form = useForm({
        resolver: zodResolver(insertMedicineSchema.omit({ pharmacyId: true })),
        defaultValues: {
            name: "",
            description: "",
            price: "",
            stock: 0,
            image: "",
            requiresPrescription: false
        }
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", `/api/pharmacies/${pharmacyId}/medicines`, data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/pharmacies/${pharmacyId}/medicines`] });
            form.reset();
            toast({ title: "Success", description: "Medicine added successfully" });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to add medicine", variant: "destructive" });
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-3 p-4 bg-slate-50 rounded-lg border">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Medicine Name</FormLabel>
                            <FormControl><Input className="h-8" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-3">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs">Price</FormLabel>
                                <FormControl><Input className="h-8" placeholder="₹500" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs">Stock</FormLabel>
                                <FormControl><Input type="number" className="h-8" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Description</FormLabel>
                            <FormControl><Textarea className="min-h-[60px]" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button size="sm" type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Plus className="mr-2 h-3 w-3" />}
                    Add Medicine
                </Button>
            </form>
        </Form>
    );
}
