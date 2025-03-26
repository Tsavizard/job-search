# KarrieraTest

## Setup

Close repo with https or ssh eg `git clone git@github.com:Tsavizard/karriera-test.git`\
Run script `scripts/setup.sh` (install node 23.8.0, npm install, nx run app build:production)

## Run both apps

Run `npm run serve-dockerized`

## Swagger

encrypted token 3f2ecdea-02fe-48e1-bf7b-89ec6d028823.26dafafdd0de8ba46ebbdd02b1a67e04.7f7f9b79a8527b2b7c9a537f62258d2c4bf5583c82307b5199dd3eeabf66f7fb807b1614ed9b890d2a0130745d613f413ae7c05d5180764cc30c037789fba1e4
for user making the requests will also make the job posts for them.

- JobBoard at `http://localhost:3000/api/swagger`
- JobSearch at `http://localhost:3001/swagger`\
  Both will need an auth token as authorization. Currently must be the userId we wish to use (uuid)

## Important for both apps

- Job post id and userId fields are uuid format eg `86c92e48-ad6f-4ef9-8203-3c2ef340aa2e`
- We can generate a uuid via `npm run generate-id` script
- Endpoints all need Bearer token authentication header (normally userId would be encrypted in the token and the server would decrypt to authenticate said token and retrieve userId)
- Scripts: `./apps/XXXXX/tools/scripts/prod.sh` remove the containers and respective volumes for cleanup

## JobBoard Demo

Run from root `./apps/job-board/tools/scripts/prod.sh`\
There is a Kafka consumer to send job posts to JobSearch app. If the JobSearch is not up then it will fail and keep trying with kafkajs default behaviour.\
We can turn off the consumption by changing the env variable DISABLE_CONSUMERS in apps/job-board/envs/.env.production

## JobSearch Demo

Run from root `./apps/job-search/tools/scripts/prod.sh`

#### Notable Commands from root

- Generate id: `npm run generate-id`
- Build job-board and job-search for production (in place of setup.sh) `npm run setup`
- Start both docker applications: `npm run serve-dockerized`
- Tests:
  - Unit:
    - `nx run @karriera-test/job-board:test`
    - `nx run @karriera-test/job-search:test`
  - E2E:
    - `npx nx run @karriera-test/job-board-e2e:e2e`
    - `npx nx run @karriera-test/job-search-e2e:e2e`
- See kafka topic offsets\
  `docker exec -it karriera-job-board-kafka kafka-consumer-groups --bootstrap-server localhost:9092 --all-groups --describe`

### Notes

Logging: bare minimum following tactic "no news is good news".

- Logger error for errors when they occur.
- Logger info for index creation in JobSearch.
- Logger info application start.
- Logger debug (dev only) for kafka event emission and elastic indexing success
  Sanity checks:
- Due to use of Kafka for event retention / retrial no extra checks were added.
  Throttling:
- Used example from https://docs.nestjs.com/security/rate-limiting on both applications. Ideally this shouldn't be handled in the application but by firewall / proxy.
  Environment variables:
- apps/job-board/envs/.env.development apps/job-search/envs/.env.development

  - Used in development, when apps are run without container. When running the apps in container use docker-compose-dev.yml where env vars needed for network are overridden

- envs/ directory contains the env files for development/production for mysql, kafka, zookeeper, elasticsearch containers. Again mainly the hosts change from localhost to the container name but it is a good practice to have per NODE_ENV since normally the production one would be kept on server not in git

## Future steps
- Handle kafka consumer errors more gracefully. Default does exponential backoff and is vulnerable to poison pill.
eg during testing I created via swagger a job post, then updated, then deleted. Each action has its own topic and because I had error in the update handler when I fixed it
the topic resumed but the delete action had already happened so the update got pilled with 404.


## Examples

Use Authorization: Bearer 3f2ecdea-02fe-48e1-bf7b-89ec6d028823.26dafafdd0de8ba46ebbdd02b1a67e04.7f7f9b79a8527b2b7c9a537f62258d2c4bf5583c82307b5199dd3eeabf66f7fb807b1614ed9b890d2a0130745d613f413ae7c05d5180764cc30c037789fba1e4

Create job post in job-board
curl -X 'POST' \
 'http://localhost:3000/api/job-posts' \
 -H 'accept: application/json' \
 -H 'Authorization: Bearer 3f2ecdea-02fe-48e1-bf7b-89ec6d028823.26dafafdd0de8ba46ebbdd02b1a67e04.7f7f9b79a8527b2b7c9a537f62258d2c4bf5583c82307b5199dd3eeabf66f7fb807b1614ed9b890d2a0130745d613f413ae7c05d5180764cc30c037789fba1e4' \
 -H 'Content-Type: application/json' \
 -d '{
"title": "Sanitation manager",
"description": "Glorified name for cleaning lady",
"salary": 1000000,
"workModel": "on-site"
}'

List job posts from job-search
curl -X 'GET' \
 'http://localhost:3001/api/job-posts' \
 -H 'accept: application/json' \
 -H 'Authorization: Bearer 3f2ecdea-02fe-48e1-bf7b-89ec6d028823.26dafafdd0de8ba46ebbdd02b1a67e04.7f7f9b79a8527b2b7c9a537f62258d2c4bf5583c82307b5199dd3eeabf66f7fb807b1614ed9b890d2a0130745d613f413ae7c05d5180764cc30c037789fba1e4'
