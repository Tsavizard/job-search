import { TIndexSchema } from '../../../types/elastic'

export const jobPostIndexSchema: TIndexSchema = {
  index: 'job-posts', // TODO: extract to constants
  body: {
    settings: {
      number_of_shards: 1,
      number_of_replicas: 1,
      analysis: {
        analyzer: {
          job_analyzer: {
            type: 'custom',
            tokenizer: 'standard',
            filter: ['lowercase', 'asciifolding'],
          },
        },
      },
    },
    mappings: {
      properties: {
        title: {
          type: 'text',
          analyzer: 'job_analyzer',
          fields: {
            keyword: { type: 'keyword' },
          },
        },
        description: { type: 'text', analyzer: 'job_analyzer' },
        salary: { type: 'float' },
        model: {
          type: 'text',
          fields: {
            keyword: { type: 'keyword' },
          },
        },
        userId: { type: 'keyword' },
      },
    },
  },
};
