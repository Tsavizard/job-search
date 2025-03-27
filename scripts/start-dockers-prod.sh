#!/bin/bash

npx nx run-many -t build -p @karriera-test/job-board @karriera-test/job-search
docker compose -f 'docker/docker-compose.prod.yml' down && docker compose -f 'docker/docker-compose.prod.yml' up -d --build