#!/bin/bash

docker compose -f 'apps/job-board/docker/docker-compose.dev.yml' down mysql-dev job-board-kafka job-board-zookeeper
docker volume prune -f
docker compose -f 'apps/job-board/docker/docker-compose.dev.yml' up -d --build mysql-dev job-board-kafka job-board-zookeeper