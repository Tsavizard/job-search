#!/bin/bash

docker compose -f 'docker/docker-compose.prod.yml' down mysql kafka zookeeper
docker compose -f 'docker/docker-compose.prod.yml' up -d --build mysql kafka zookeeper