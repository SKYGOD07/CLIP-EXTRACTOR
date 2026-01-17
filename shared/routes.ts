import { z } from 'zod';
import { insertVideoSchema, videos, clips } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
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
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  videos: {
    list: {
      method: 'GET' as const,
      path: '/api/videos',
      responses: {
        200: z.array(z.custom<typeof videos.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/videos/:id',
      responses: {
        200: z.custom<typeof videos.$inferSelect & { clips: typeof clips.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
    process: {
      method: 'POST' as const,
      path: '/api/videos/upload', // Uses multer, not JSON body
      responses: {
        201: z.custom<typeof videos.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    // We might need a separate endpoint to trigger processing if upload is separate,
    // but for now we'll assume upload triggers processing or returns immediately.
    // Let's add a restart endpoint just in case.
    restart: {
      method: 'POST' as const,
      path: '/api/videos/:id/process',
      responses: {
        200: z.object({ message: z.string() }),
        404: errorSchemas.notFound,
      },
    }
  },
};

// ============================================
// HELPER
// ============================================
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
