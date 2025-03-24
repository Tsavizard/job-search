# KarrieraTest

## Run tasks

To run the dev server for your app, use:

```sh
npx nx serve job-board
```

## JobBoard

#### Commands from root

- database: `docker compose -f apps/job-board/docker/docker-compose.dev.yml up mysql-dev`
- application: `nx run @karriera-test/job-board:serve --configuration=development`
  - needs database running
- e2e tests: `nx run @karriera-test/job-board-e2e:e2e`
  - needs application running
- unit tests: `nx run @karriera-test/job-board:test`
- kafka see topic offsets
  `docker exec -it karriera-job-board-kafka kafka-consumer-groups --bootstrap-server localhost:9092 --all-groups --describe`
