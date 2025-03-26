import { ApiPropertyOptional } from '@nestjs/swagger';
import type { TWorkModel } from '../types';

export class QueryDto {
  @ApiPropertyOptional()
  search?: string;

  @ApiPropertyOptional()
  salaryMax?: number;

  @ApiPropertyOptional()
  salaryMin?: number;

  @ApiPropertyOptional({ enum: ['on-site', 'hybrid', 'remote'], isArray: true })
  model?: TWorkModel[];

  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  limit?: number;
}
