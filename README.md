# KarrieraTest

## Setup

Close repo with https or ssh eg `git clone git@github.com:Tsavizard/karriera-test.git`\
Run script `scripts/setup.sh` (install node 23.8.0, npm install, nx run app build:production)

## Run both apps

Run `npm run serve-dockerized`

## Swagger

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
  - Used example from https://docs.nestjs.com/security/rate-limiting on both applications
## Examples
