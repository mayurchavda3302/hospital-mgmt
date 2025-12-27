import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertAppointment } from "@shared/routes";

export function useAppointments(doctorId?: number) {
  return useQuery({
    queryKey: [api.appointments.list.path, doctorId],
    queryFn: async () => {
      let url = api.appointments.list.path;
      if (doctorId) {
        url += `?doctorId=${doctorId}`;
      }
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return api.appointments.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateAppointment() {
  return useMutation({
    mutationFn: async (data: InsertAppointment) => {
      const res = await fetch(api.appointments.create.path, {
        method: api.appointments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to book appointment");
      }
      return api.appointments.create.responses[201].parse(await res.json());
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const url = buildUrl(api.appointments.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.appointments.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update status");
      return api.appointments.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.appointments.list.path] }),
  });
}

export function useAssignDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, doctorId }: { id: number; doctorId: number }) => {
      const url = buildUrl(api.appointments.assign.path, { id });
      const res = await fetch(url, {
        method: api.appointments.assign.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to assign doctor");
      return api.appointments.assign.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.appointments.list.path] }),
  });
}
