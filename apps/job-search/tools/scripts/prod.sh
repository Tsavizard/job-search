#!/bin/bash

docker compose -f 'docker/docker-compose.dev.yml' down elasticsearch-job-search
docker compose -f 'docker/docker-compose.dev.yml' up -d --build elasticsearch-job-search