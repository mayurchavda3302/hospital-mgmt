import { useQuery, useMutation } from "@tanstack/react-query";
import { MedicineRequest, Medicine, Pharmacy } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Extended type for joining data (in real app, use a join query or fetch separately)
// For simplicity, we'll fetch all and filter/match in UI or just show IDs if we want to save time,
// but let's try to be nice.
// Actually, the storage getMedicineRequests just returns the requests.
// We might need to fetch medicines and pharmacies to show names.
// Or we can just show IDs for now.
// Let's assume we can fetch them or we just show the request info.

export function RequestsList() {
    const { data: requests, isLoading } = useQuery<MedicineRequest[]>({
        queryKey: ["/api/medicine-requests"],
    });

    // We should ideally fetch related data, but to keep it simple we'll just show the request details
    // provided by the user (customerName, medicine, etc).
    // Wait, request has medicineId and pharmacyId.
    // We can fetch all pharmacies and medicines or just show IDs.
    // Let's show IDs for now or maybe we can fetch references if we have time.
    // Actually, let's just show the user provided info and update status.

    if (isLoading) return <Loader2 className="h-8 w-8 animate-spin" />;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Medicine Requests ({requests?.length || 0})</h2>

            <div className="grid gap-4">
                {requests?.map((request) => (
                    <RequestCard key={request.id} request={request} />
                ))}
                {requests?.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg">
                        No active requests found.
                    </div>
                )}
            </div>
        </div>
    );
}

function RequestCard({ request }: { request: MedicineRequest }) {
    const { toast } = useToast();

    const mutation = useMutation({
        mutationFn: async (status: string) => {
            const res = await apiRequest("PATCH", `/api/medicine-requests/${request.id}/status`, { status });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/medicine-requests"] });
            toast({ title: "Status Updated", description: "Request status has been updated." });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "approved": return "bg-blue-100 text-blue-800";
            case "completed": return "bg-green-100 text-green-800";
            case "rejected": return "bg-red-100 text-red-800";
            default: return "bg-slate-100 text-slate-800";
        }
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className={getStatusColor(request.status || "pending")}>
                                {(request.status || "pending").toUpperCase()}
                            </Badge>
                            <span className="text-sm text-slate-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {request.createdAt ? format(new Date(request.createdAt), "PPP p") : "Just now"}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg">{request.customerName}</h3>
                        <div className="text-sm text-slate-600 mt-1 space-y-1">
                            <p>Phone: {request.customerPhone}</p>
                            <p>Address: {request.customerAddress}</p>
                            <p className="mt-2 font-medium text-primary">
                                Requested Medicine ID: {request.medicineId} from Pharmacy ID: {request.pharmacyId}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {request.status === "pending" && (
                            <>
                                <Button
                                    size="sm"
                                    onClick={() => mutation.mutate("approved")}
                                    disabled={mutation.isPending}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Approve
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => mutation.mutate("rejected")}
                                    disabled={mutation.isPending}
                                >
                                    Reject
                                </Button>
                            </>
                        )}
                        {request.status === "approved" && (
                            <Button
                                size="sm"
                                onClick={() => mutation.mutate("completed")}
                                disabled={mutation.isPending}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Mark Completed
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
