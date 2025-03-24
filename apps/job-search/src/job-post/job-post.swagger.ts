import type { ApiOperationOptions } from '@nestjs/swagger';

const jobPostSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    salary: { type: 'number' },
    workModel: { type: 'string' },
  },
  required: ['id', 'title', 'description', 'salary', 'workModel'],
};

const errorBody = {
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
        required: ['message'],
      },
    },
  },
};

const badRequestResponse = {
  400: {
    description: 'Bad request',
    ...errorBody,
  },
};

const forbiddenResponse = {
  403: {
    description: 'Forbidden',
    ...errorBody,
  },
};

const internalError = {
  500: {
    description: 'Internal Server Error',
    ...errorBody,
  },
};

export const listSwagger: ApiOperationOptions = {
  summary: 'Retrieve all job posts for user',
  responses: {
    200: {
      description: 'Job posts found',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: jobPostSchema,
          },
        },
      },
    },
    ...forbiddenResponse,
    ...internalError,
  },
};

export const saveSwagger: ApiOperationOptions = {
  summary: 'Create job post by id and userId',
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            salary: { type: 'number' },
            workModel: { type: 'string' },
          },
          required: ['title', 'description', 'salary', 'workModel'],
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Job post created',
      content: {
        'application/json': { schema: jobPostSchema },
      },
    },
    ...badRequestResponse,
    ...forbiddenResponse,
    ...internalError,
  },
};

export const deleteSwagger: ApiOperationOptions = {
  summary: 'Delete job post by id and userId',
  parameters: [{ name: 'id', in: 'path', required: true }],
  responses: {
    204: {
      description: 'Job post deleted',
    },
    ...badRequestResponse,
    ...forbiddenResponse,
    ...internalError,
  },
};
