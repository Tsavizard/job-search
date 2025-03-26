#!/bin/bash

nvm install 23.8.0
nvm use 23.8.0
npm install

npx nx run-many @karriera-test/job-board:build:production @karriera-test/job-search:build:production
