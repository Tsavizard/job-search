#!/bin/bash

curl -X POST "http://localhost:9200/job-posts/_doc/" -H "Content-Type: application/json" -d '{
  "description": "We are looking for a senior software engineer with React experience",
  "id": "9495b509-1fa6-479a-ab28-3f706474a311",
  "salary": 75000,
  "title": "Senior Frontend Developer",
  "userId": "3f2ecdea-02fe-48e1-bf7b-89ec6d028823",
  "workModel": "remote"
}'

curl -X POST "http://localhost:9200/job-posts/_doc/" -H "Content-Type: application/json" -d '{
  "description": "DevOps engineer needed for maintaining cloud infrastructure",
  "id": "9495b509-1fa6-479a-ab28-3f706474a312",
  "salary": 85000,
  "title": "DevOps Engineer",
  "userId": "3f2ecdea-02fe-48e1-bf7b-89ec6d028824",
  "workModel": "hybrid"
}'

curl -X POST "http://localhost:9200/job-posts/_doc/" -H "Content-Type: application/json" -d '{
  "description": "Backend developer position for Java Spring Boot applications",
  "id": "9495b509-1fa6-479a-ab28-3f706474a313",
  "salary": 70000,
  "title": "Backend Developer",
  "userId": "3f2ecdea-02fe-48e1-bf7b-89ec6d028823",
  "workModel": "on-site"
}'

curl -X POST "http://localhost:9200/job-posts/_doc/" -H "Content-Type: application/json" -d '{
  "description": "Backend developer position for Java Spring Boot applications",
  "id": "9495b509-1fa6-479a-ab28-3f706474a314",
  "salary": 70000,
  "title": "Backend Developer",
  "userId": "3f2ecdea-02fe-48e1-bf7b-89ec6d028823",
  "workModel": "on-site"
}'