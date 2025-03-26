import { TWorkModel } from '../types';

export function generateJobPostsQuery({
  search,
  salaryMax,
  salaryMin,
  models,
}: {
  search?: string;
  salaryMax?: number;
  salaryMin?: number;
  models?: TWorkModel[];
}) {
  const query: {
    bool: {
      should?: unknown[];
      filter?: unknown[];
      minimum_should_match?: number;
    };
  } = {
    bool: {},
  };

  if (search) {
    query.bool.should = [
      {
        multi_match: {
          query: search,
          fields: ['title', 'description'],
          type: 'phrase_prefix',
        },
      },
    ];
    query.bool.minimum_should_match = 1;
  }

  const filters: unknown[] = [];

  if (models && models.length > 0) {
    filters.push({
      terms: {
        workModel: models,
      },
    });
  }

  if (salaryMax) {
    filters.push({
      range: {
        salary: {
          lte: salaryMax,
        },
      },
    });
  }

  if (salaryMin) {
    filters.push({
      range: {
        salary: {
          gte: salaryMin,
        },
      },
    });
  }

  if (filters.length > 0) {
    query.bool.filter = filters;
  }

  return Object.keys(query.bool).length ? query : undefined;
}
