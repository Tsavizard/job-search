#!/bin/bash

STATUS=$(curl -X POST "http://$ELASTICSEARCH_USER:$ELASTICSEARCH_PASSWORD@localhost:9200/job-posts/_delete_by_query" -H 'Content-Type: application/json' -w '%{http_code}' -o /dev/null -d '{
    "query" : {
        "match_all" : {}
    }
}')
echo $STATUS
if [ "$STATUS" = "200" ] || [ "$STATUS" = "404" ]; then
    exit 0
else
    exit 1
fi