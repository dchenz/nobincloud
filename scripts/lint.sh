#!/bin/bash

eslint src cypress
prettier --check src cypress

cd backend
golangci-lint run ./...