#!/bin/bash

docker compose -f 'docker/docker-compose.prod.yml' down elasticsearch-job-search
docker volume rm elasticsearch_data-job-search-prod
docker compose -f 'docker/docker-compose.prod.yml' up -d --build elasticsearch-job-search