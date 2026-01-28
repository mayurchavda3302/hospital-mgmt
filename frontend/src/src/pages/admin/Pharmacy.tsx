import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PharmacyList } from "./pharmacy/PharmacyList";
import { RequestsList } from "./pharmacy/RequestsList";

export default function AdminPharmacy() {
    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900">Pharmacy Management</h1>
                    <p className="text-slate-500">Manage pharmacies, medicines, and medicine requests</p>
                </div>
            </div>

            <Tabs defaultValue="pharmacies" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
                    <TabsTrigger value="requests">Requests</TabsTrigger>
                </TabsList>

                <TabsContent value="pharmacies">
                    <PharmacyList />
                </TabsContent>

                <TabsContent value="requests">
                    <RequestsList />
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
}
