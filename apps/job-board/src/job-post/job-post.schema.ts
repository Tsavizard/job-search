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
    employmentType: z
      .string({
        required_error: 'Employment type is required',
        invalid_type_error: 'Employment type must be a string',
      })
      .trim(),
  })
  .required()
  .strict();

// Type for the CreateUserDto based on the Zod schema
export type CreateUserDto = z.infer<typeof JobPostSchema>;
