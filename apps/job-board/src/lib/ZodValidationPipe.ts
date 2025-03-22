import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, type ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(this.formatZodError(result.error));
    }
    return result.data;
  }

  private formatZodError(error: ZodError) {
    return error.errors.map((err) => ({
      message: err.message,
      path: err.path.join('.'),
    }));
  }
}
