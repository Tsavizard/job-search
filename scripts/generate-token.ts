#!/usr/bin/env node

const dotenv = require('dotenv'); // dotenv is a nestjs dependency
const { Authenticator } = require('../apps/job-board/src/lib/Authenticator.ts');

// Load environment variables
dotenv.config({
  path: `apps/job-board/envs/.env.development`,
});

// Create a simple config service implementation that works outside NestJS
const configService = {
  get: (key: string) => process.env[key],
};

// Instantiate the Authenticator
const authenticator = new Authenticator(configService);

// Parse command line arguments
const userId = process.argv[2];

// Execute different methods based on commands

if (!userId) {
  console.error('Error: userId is required');
  process.exit(1);
}
const token = authenticator.createAuthToken(userId);
console.log(token);
