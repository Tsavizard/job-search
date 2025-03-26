#!/bin/bash

docker compose -f 'docker/docker-compose.prod.yml' down mysql-job-board kafka-job-board zookeeper-job-board
docker volume rm mysql_data-job-board-prod zookeeper_data-job-board-prod
docker compose -f 'docker/docker-compose.prod.yml' up -d --build mysql-job-board kafka-job-board zookeeper-job-board