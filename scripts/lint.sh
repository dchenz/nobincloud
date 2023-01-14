#!/bin/bash

prettier --check src

cd backend
golangci-lint run ./...