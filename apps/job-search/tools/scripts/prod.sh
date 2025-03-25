#!/bin/bash

docker compose -f 'docker/docker-compose.prod.yml' down elasticsearch
docker compose -f 'docker/docker-compose.prod.yml' up -d --build elasticsearch