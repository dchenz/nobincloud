#!/bin/bash

TEST_MYSQL_NAME=mysql_test_db
TEST_MYSQL_PASSWORD=hello123
TEST_MYSQL_PORT=9001

docker run -d \
    -e MYSQL_ROOT_PASSWORD=$TEST_MYSQL_PASSWORD \
    -p $TEST_MYSQL_PORT:3306 \
    --name $TEST_MYSQL_NAME \
    mariadb:10.5

function mysql_ready {
    docker exec $TEST_MYSQL_NAME mysql --user=root --password=$TEST_MYSQL_PASSWORD -e "SELECT 1" >/dev/null 2>&1
}

while ! mysql_ready ; do
    sleep 1
done

cd backend
TEST_MYSQL_DB="root:$TEST_MYSQL_PASSWORD@tcp(127.0.0.1:$TEST_MYSQL_PORT)/" \
    go test ./... --tags=integration

docker rm -fv $TEST_MYSQL_NAME > /dev/null
