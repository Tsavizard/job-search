import type { ApiOperationOptions } from '@nestjs/swagger';

const swaggerCookieAuth = {
  name: 'authToken',
  in: 'cookie' as const,
  required: true,
  description: 'Authentication token',
  schema: {
    type: 'string',
  },
};

const jobPostSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    salary: { type: 'number' },
    employmentType: { type: 'string' },
  },
  required: ['id', 'title', 'description', 'salary', 'employmentType'],
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

const forbiddenResponse = {
  403: {
    description: 'Forbidden',
    ...errorBody,
  },
};

export const indexSwagger: ApiOperationOptions = {
  summary: 'Retrieve all job posts for user',
  parameters: [swaggerCookieAuth],
  security: [{ authToken: [] }],
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
  },
};

export const showSwagger: ApiOperationOptions = {
  summary: 'Retrieve job post by id and userId',
  parameters: [
    { name: 'id', in: 'path' as const, required: true },
    swaggerCookieAuth,
  ],
  security: [{ authToken: [] }],
  responses: {
    200: {
      description: 'Job post found',
      content: {
        'application/json': { schema: jobPostSchema },
      },
    },
    404: {
      description: 'Job post not found',
      ...errorBody,
    },
    ...forbiddenResponse,
  },
};

export const postSwaggerBody: ApiOperationOptions = {
  summary: 'Create job post by id and userId',
  parameters: [swaggerCookieAuth],
  security: [{ authToken: [] }],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            salary: { type: 'number' },
            employmentType: { type: 'string' },
          },
          required: ['title', 'description', 'salary', 'employmentType'],
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
    400: {
      description: 'Bad request',
      ...errorBody,
    },
    ...forbiddenResponse,
  },
};

export const putSwaggerBody: ApiOperationOptions = {
  summary: 'Update job post by id and userId',
  parameters: [
    { name: 'id', in: 'path' as const, required: true },
    swaggerCookieAuth,
  ],
  security: [{ authToken: [] }],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            salary: { type: 'number' },
            employmentType: { type: 'string' },
          },
          required: ['title', 'description', 'salary', 'employmentType'],
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Job post updated',
      content: {
        'application/json': { schema: jobPostSchema },
      },
    },
    400: {
      description: 'Bad request',
      ...errorBody,
    },
    ...forbiddenResponse,
  },
};

export const deleteSwagger: ApiOperationOptions = {
  summary: 'Delete job post by id and userId',
  parameters: [
    { name: 'id', in: 'path' as const, required: true },
    swaggerCookieAuth,
  ],
  security: [{ authToken: [] }],
  responses: {
    204: {
      description: 'Job post deleted',
    },
    400: {
      description: 'Bad request',
      ...errorBody,
    },
    ...forbiddenResponse,
  },
};
