BUILD_DIR=bin
BUILD_PATH=${BUILD_DIR}/nobincloud

all: build

build:
	go build -o ${BUILD_PATH} main.go

run:
	godotenv -f .env ${BUILD_PATH}

lint:
	golangci-lint run

clean:
	rm -rf ${BUILD_DIR}