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
  "title": "Java Spring Boot Developer",
  "userId": "3f2ecdea-02fe-48e1-bf7b-89ec6d028823",
  "workModel": "on-site"
}'

curl -X POST "http://localhost:9200/job-posts/_doc/" -H "Content-Type: application/json" -d '{
  "description": "Backend developer position for Nodejs applications",
  "id": "9495b509-1fa6-479a-ab28-3f706474a314",
  "salary": 55000,
  "title": "Nodejs Developer",
  "userId": "3f2ecdea-02fe-48e1-bf7b-89ec6d028823",
  "workModel": "on-site"
}'

curl -X POST "http://localhost:9200/job-posts/_doc/" -H "Content-Type: application/json" -d '{
  "description": "Backend developer position for GoLang applications",
  "id": "9495b509-1fa6-479a-ab28-3f706474a315",
  "salary": 65000,
  "title": "Go Developer",
  "userId": "3f2ecdea-02fe-48e1-bf7b-89ec6d028823",
  "workModel": "on-site"
}'

curl -X POST "http://localhost:9200/job-posts/_doc/" -H "Content-Type: application/json" -d '{
  "description": "Backend developer position for Rust applications",
  "id": "9495b509-1fa6-479a-ab28-3f706474a316",
  "salary": 60000,
  "title": "Rust Developer",
  "userId": "3f2ecdea-02fe-48e1-bf7b-89ec6d028823",
  "workModel": "on-site"
}'

curl -X POST "http://localhost:9200/job-posts/_doc/" -H "Content-Type: application/json" -d '{
  "description": "Backend developer position for Java Spring Boot applications",
  "id": "9495b509-1fa6-479a-ab28-3f706474a317",
  "salary": 50000,
  "title": "Backend Developer",
  "userId": "3f2ecdea-02fe-48e1-bf7b-89ec6d028823",
  "workModel": "on-site"
}'

curl -X POST "http://localhost:9200/job-posts/_doc/" -H "Content-Type: application/json" -d '{
  "description": "Quality assurance",
  "id": "9495b509-1fa6-479a-ab28-3f706474a318",
  "salary": 80000,
  "title": "QA Engineer",
  "userId": "3f2ecdea-02fe-48e1-bf7b-89ec6d028823",
  "workModel": "remote"
}'

curl -X POST "http://localhost:9200/job-posts/_doc/" -H "Content-Type: application/json" -d '{
  "description": "Backend developer position for Ruby applications",
  "id": "9495b509-1fa6-479a-ab28-3f706474a319",
  "salary": 90000,
  "title": "Backend Developer",
  "userId": "3f2ecdea-02fe-48e1-bf7b-89ec6d028823",
  "workModel": "hybrid"
}'