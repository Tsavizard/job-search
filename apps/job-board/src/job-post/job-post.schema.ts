import { z } from 'zod';

export const JobPostSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    salary: z.coerce.number().nonnegative().safe(),
    workModel: z.enum(['on-site', 'hybrid', 'remote']),
  })
  .required()
  .strict();

export const NumberSchema = z
  .number({
    invalid_type_error: 'Page must be a positive number',
  })
  .int()
  .min(1);
