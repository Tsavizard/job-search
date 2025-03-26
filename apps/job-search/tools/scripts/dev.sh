#!/bin/bash

docker compose -f 'docker/docker-compose.dev.yml' down elasticsearch-job-search
docker volume rm elasticsearch_data-job-search-dev
docker compose -f 'docker/docker-compose.dev.yml' up -d --build elasticsearch-job-search