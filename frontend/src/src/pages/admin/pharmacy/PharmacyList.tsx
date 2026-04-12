import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Pharmacy, insertPharmacySchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pill, MapPin, Upload, Image as ImageIcon } from "lucide-react";
import { ManageMedicines } from "./ManageMedicines";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function PharmacyList() {
    const { data: pharmacies, isLoading } = useQuery<Pharmacy[]>({
        queryKey: ["/api/pharmacies"],
    });

    const [isAddOpen, setIsAddOpen] = useState(false);

    if (isLoading) return <Loader2 className="h-8 w-8 animate-spin" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Pharmacies ({pharmacies?.length || 0})</h2>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" /> Add Pharmacy</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Pharmacy</DialogTitle>
                        </DialogHeader>
                        <AddPharmacyForm onSuccess={() => setIsAddOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pharmacies?.map((pharmacy) => (
                    <Card key={pharmacy.id}>
                        <div className="h-32 bg-slate-100 rounded-t-xl overflow-hidden relative">
                            {pharmacy.image ? (
                                <img src={pharmacy.image} alt={pharmacy.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-300">
                                    {pharmacy.name[0]}
                                </div>
                            )}
                        </div>
                        <CardHeader>
                            <CardTitle>{pharmacy.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-slate-500 space-y-2 mb-4">
                                <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {pharmacy.location}</p>
                                <p className="line-clamp-2">{pharmacy.description}</p>
                            </div>

                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        <Pill className="h-4 w-4 mr-2" /> Manage Medicines
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="sm:max-w-xl">
                                    <SheetHeader>
                                        <SheetTitle>Manage Medicines - {pharmacy.name}</SheetTitle>
                                    </SheetHeader>
                                    <ManageMedicines pharmacyId={pharmacy.id} />
                                </SheetContent>
                            </Sheet>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function AddPharmacyForm({ onSuccess }: { onSuccess: () => void }) {
    const { toast } = useToast();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    
    const form = useForm({
        resolver: zodResolver(insertPharmacySchema),
        defaultValues: {
            name: "",
            location: "",
            contact: "",
            description: "",
            image: "",
            isAvailable: true
        }
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    setPreviewUrl(result);
                };
                reader.readAsDataURL(file);
            } else {
                toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
            }
        }
    };

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            let imagePath = data.image || '';
            
            // If file is selected, upload it first
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                
                if (!uploadRes.ok) {
                    const errorText = await uploadRes.text();
                    throw new Error(`Failed to upload image: ${errorText}`);
                }
                
                const uploadResult = await uploadRes.json();
                imagePath = uploadResult.path;
                console.log('Image uploaded successfully:', imagePath);
            }
            
            // Update data with the actual image path
            const pharmacyData = {
                ...data,
                image: imagePath
            };
            
            const res = await apiRequest("POST", "/api/pharmacies", pharmacyData);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/pharmacies"] });
            toast({ title: "Success", description: "Pharmacy added successfully" });
            onSuccess();
            setSelectedFile(null);
            setPreviewUrl("");
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to add pharmacy", variant: "destructive" });
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pharmacy Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Pharmacy Image (Optional)
                    </label>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="pharmacy-image-upload"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('pharmacy-image-upload')?.click()}
                                className="flex items-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Choose Image
                            </Button>
                            {selectedFile && (
                                <span className="text-sm text-slate-500">{selectedFile.name}</span>
                            )}
                        </div>
                        
                        {previewUrl && (
                            <div className="w-full h-32 rounded-lg border overflow-hidden">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        
                        {!previewUrl && (
                            <div className="w-full h-32 rounded-lg border border-dashed border-slate-300 flex items-center justify-center">
                                <div className="text-center">
                                    <ImageIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">No image selected</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Pharmacy
                </Button>
            </form>
        </Form>
    );
}
