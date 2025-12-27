import { z } from 'zod';
import { insertUserSchema, insertDoctorSchema, insertAppointmentSchema, insertMessageSchema, users, doctors, appointments, messages } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  doctors: {
    list: {
      method: 'GET' as const,
      path: '/api/doctors',
      input: z.object({ department: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof doctors.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/doctors/:id',
      responses: {
        200: z.custom<typeof doctors.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/doctors',
      input: z.object({
        username: z.string(),
        password: z.string(),
        name: z.string(),
        role: z.literal("doctor"),
        doctorProfile: insertDoctorSchema.omit({ userId: true })
      }),
      responses: {
        201: z.custom<typeof doctors.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/doctors/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  appointments: {
    create: {
      method: 'POST' as const,
      path: '/api/appointments',
      input: insertAppointmentSchema,
      responses: {
        201: z.custom<typeof appointments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/appointments',
      input: z.object({ doctorId: z.coerce.number().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof appointments.$inferSelect>()),
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/appointments/:id/status',
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof appointments.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    assign: {
      method: 'PATCH' as const,
      path: '/api/appointments/:id/assign',
      input: z.object({ doctorId: z.number() }),
      responses: {
        200: z.custom<typeof appointments.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  contact: {
    create: {
      method: 'POST' as const,
      path: '/api/contact',
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/contact',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
