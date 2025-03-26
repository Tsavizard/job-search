#!/bin/bash

docker compose -f 'docker/docker-compose.dev.yml' down mysql-job-board kafka-job-board zookeeper-job-board
docker volume rm mysql_data-job-board-dev zookeeper_data-job-board-dev
docker compose -f 'docker/docker-compose.dev.yml' up -d --build mysql-job-board kafka-job-board zookeeper-job-board