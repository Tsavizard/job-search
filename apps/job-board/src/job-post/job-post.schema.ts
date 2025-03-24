import { z } from 'zod';

// Define the schema for creating a user
export const JobPostSchema = z
  .object({
    title: z.string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    }),
    description: z.string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    }),
    salary: z
      .number({
        required_error: 'Salary is required',
        invalid_type_error: 'Salary must be a non-negative number',
      })
      .nonnegative('Salary must be a non-negative number')
      .safe(),
    workModel: z
      .string({
        required_error: 'Work model is required',
        invalid_type_error: 'Work model must be a string',
      })
      .trim(),
  })
  .required()
  .strict();

export const PageSchema = z
  .number({
    invalid_type_error: 'Page must be a positive number',
  })
  .int()
  .min(1);

export const LimitSchema = z
  .number({
    invalid_type_error: 'Page must be a positive number',
  })
  .int()
  .min(1);
