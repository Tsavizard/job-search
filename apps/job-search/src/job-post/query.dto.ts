import { ApiPropertyOptional } from '@nestjs/swagger';
import type { TWorkModel } from '../types';

export class QueryDto {
  @ApiPropertyOptional()
  search?: string;

  @ApiPropertyOptional()
  salaryMax?: number;

  @ApiPropertyOptional()
  salaryMin?: number;

  @ApiPropertyOptional({ enum: ['on-site', 'hybrid', 'remote'] })
  model?: TWorkModel;

  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  limit?: number;
}
