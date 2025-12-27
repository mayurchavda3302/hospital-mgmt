import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { format } from "date-fns";

export default function AdminRequests() {
  const { data: messages, isLoading } = useQuery({
    queryKey: [api.contact.list.path],
  });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-slate-900">User Requests</h1>
        <p className="text-slate-500">View and manage contact form submissions from users.</p>
      </div>

      <Card className="shadow-sm border-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : messages?.map((msg: any) => (
                <TableRow key={msg.id}>
                  <TableCell className="font-medium">{msg.name}</TableCell>
                  <TableCell>{msg.email}</TableCell>
                  <TableCell className="max-w-md truncate">{msg.message}</TableCell>
                  <TableCell>{format(new Date(msg.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${msg.status === 'replied' ? 'bg-green-100 text-green-800' :
                        msg.status === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>
                      {msg.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {messages?.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8">No requests found</TableCell></TableRow>
              ) || !messages && !isLoading && (
                 <TableRow><TableCell colSpan={5} className="text-center py-8">No requests found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
