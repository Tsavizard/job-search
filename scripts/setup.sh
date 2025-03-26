#!/bin/bash

nvm install 23.8.0
nvm use 23.8.0
npm install

npx nx run-many -t build -p @karriera-test/job-board @karriera-test/job-search
