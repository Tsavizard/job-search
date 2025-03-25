#!/bin/bash

docker compose -f 'docker/docker-compose.dev.yml' down mysql kafka zookeeper
docker volume prune -f
docker compose -f 'docker/docker-compose.dev.yml' up -d --build mysql kafka zookeeper