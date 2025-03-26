import { z } from 'zod';

export const listSchema = z
  .object({
    search: z.string(),
    salaryMax: z.coerce.number().min(0).safe().nonnegative(),
    salaryMin: z.coerce.number().min(0).safe().nonnegative(),
    model: z.union([
      z.enum(['on-site', 'hybrid', 'remote']),
      z.enum(['on-site', 'hybrid', 'remote']).array(),
    ]),
    page: z.coerce.number().min(1).safe().nonnegative(),
    limit: z.coerce.number().min(1).safe().nonnegative(),
  })
  .partial()
  .strict();

export const JobPostSchema = z
  .object({
    id: z.string().uuid(),
    description: z.string(),
    salary: z.coerce.number().nonnegative().safe(),
    title: z.string(),
    workModel: z.enum(['on-site', 'hybrid', 'remote']),
    userId: z.string().uuid(),
  })
  .required()
  .strict();
