BUILD_DIR=bin
BUILD_PATH=${BUILD_DIR}/nobincloud

all: build

build:
	go build -o ${BUILD_PATH} main.go

lint:
	golangci-lint run

clean:
	rm -rf ${BUILD_DIR}