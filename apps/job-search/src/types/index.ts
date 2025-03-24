export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type TListQuery = {
  search?: string;
  salaryMax?: number;
  salaryMin?: number;
  model?: TWorkModel;
  page?: number;
  limit?: number;
};
export type TWorkModel = 'on-site' | 'hybrid' | 'remote';

export type JobPost = {
  description: string;
  id: string;
  salary: number;
  title: string;
  userId: string;
  workModel: TWorkModel;
};
