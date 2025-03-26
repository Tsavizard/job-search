# KarrieraTest

## Setup
Close repo with https or ssh eg ```git clone git@github.com:Tsavizard/karriera-test.git```
Run script scripts/setup.sh (install node 23.8.0, npm install, nx run app build:production)


## Swagger
- JobBoard at ```http://localhost:3000/api/swagger```
- JobSearch at ```http://localhost:3001/swagger```

Both will need an auth token as authorization. Currently must be the userId we wish to use (uuid)

## Important for both apps
- userId is a uuid eg 86c92e48-ad6f-4ef9-8203-3c2ef340aa2e
  - used as bearer token as well (normally userId would be encrypted in the token and the server would decrypt to authenticate said token and retrieve userId)
- job post id is also a uuid
- we can always generate via ```npm run generate-id``` (it runs ```node -e "console.log(require('uuid').v4())"```)


## JobBoard Demo
Run from root the script ```./apps/job-board/tools/scripts/prod.sh```
It should docker compose down and docker volume prune if needed, before doing docker compose up the job board application.
There is a Kafka consumer to send job posts to JobSearch app. If the JobSearch is not up then it will fail and keep trying with kafkajs default behaviour.
We can turn off the consumption by changing the env variable DISABLE_CONSUMERS in apps/job-board/envs/.env.production

## JobSearch Demo
Run from root the script ```./apps/job-search/tools/scripts/prod.sh```
It should docker compose down and docker volume prune if needed, before doing docker compose up the job board application.

#### Commands from root
- e2e tests: `nx run @karriera-test/job-board-e2e:e2e`
  - needs application running
- unit tests: `nx run @karriera-test/job-board:test`
- kafka see topic offsets
  `docker exec -it karriera-job-board-kafka kafka-consumer-groups --bootstrap-server localhost:9092 --all-groups --describe`

## Examples

