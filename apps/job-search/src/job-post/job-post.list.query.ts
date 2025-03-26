import { TWorkModel } from '../types';

export function generateJobPostsQuery({
  search,
  salaryMax,
  salaryMin,
  model,
}: {
  search?: string;
  salaryMax?: number;
  salaryMin?: number;
  model?: TWorkModel;
}) {
  const query: { bool: { should?: unknown[]; must?: unknown[] } } = {
    bool: {},
  };

  if (search) {
    query.bool.should = [
      {
        query: search,
        fields: ['title', 'description'],
      },
    ];
  }

  if (salaryMax || salaryMin || model) {
    query.bool.must = [];

    if (model) {
      query.bool.must.push({
        term: {
          workModel: model,
        },
      });
    }

    if (salaryMax) {
      query.bool.must.push({
        range: {
          salary: {
            lte: salaryMax,
          },
        },
      });
    }

    if (salaryMin) {
      query.bool.must.push({
        range: {
          salary: {
            gte: salaryMin,
          },
        },
      });
    }
  }

  return Object.keys(query.bool).length ? query : undefined;
}
