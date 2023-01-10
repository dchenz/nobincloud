#!/bin/bash

docker-compose down
DOCKER_SCAN_SUGGEST=false docker-compose up -d --force-recreate --build

echo "Waiting for services to start"

function get_http_status {
    curl --silent --output /dev/stderr --write-out "%{http_code}" http://localhost:8000 -I 2>/dev/null
}
while [[ "$(get_http_status)" != "200" ]] ; do
    sleep 1
done

echo "Services ready to take requests"

yarn run cypress run --config video=false

docker-compose down