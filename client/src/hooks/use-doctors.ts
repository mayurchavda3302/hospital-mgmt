import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateDoctorRequest } from "@shared/routes";
import { z } from "zod";

export function useDoctors(department?: string) {
  return useQuery({
    queryKey: [api.doctors.list.path, department],
    queryFn: async () => {
      const url = department 
        ? `${api.doctors.list.path}?department=${encodeURIComponent(department)}`
        : api.doctors.list.path;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch doctors");
      return api.doctors.list.responses[200].parse(await res.json());
    },
  });
}

export function useDoctor(id: number) {
  return useQuery({
    queryKey: [api.doctors.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.doctors.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch doctor");
      return api.doctors.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.doctors.create.input>) => {
      const res = await fetch(api.doctors.create.path, {
        method: api.doctors.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create doctor");
      }
      return api.doctors.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.doctors.list.path] }),
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.doctors.delete.path, { id });
      const res = await fetch(url, { 
        method: api.doctors.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete doctor");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.doctors.list.path] }),
  });
}
