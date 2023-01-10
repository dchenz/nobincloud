#!/bin/bash

SITE_URL="http://localhost:8000"

docker-compose down
DOCKER_SCAN_SUGGEST=false docker-compose up -d --force-recreate --build

echo "Waiting for services to start"

function get_http_status {
    curl --silent --output /dev/stderr --write-out "%{http_code}" $SITE_URL -I 2>/dev/null
}
while [[ "$(get_http_status)" != "200" ]] ; do
    sleep 1
done

echo "Services ready to take requests"

# This account will be used across most tests.
# Password: test123
curl -X POST $SITE_URL/api/user/register \
    -H "Content-Type: application/json" \
    --data \
    '{
        "email": "hello@example.com",
        "nickname": "hello world",
        "passwordHash":
            "jlFuwSAHtU1S43GA5PXWiJklUcFcgK+NM7b6rnDu4AiF2GmHgvWENLnNFiMSEvDM1HUF1+e7MkN8H7Y/pumVUw==",
        "accountKey":
            "a68MTSaBLF8kav+8dplCNJPBA8HA8udcsnokMgXpGiy+pHiZGpssFascKrLu7uCUmkXj1DihfQDj18OP"
    }'

yarn run cypress run --config video=false

docker-compose down