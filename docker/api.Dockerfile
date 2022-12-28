FROM golang:1.18-alpine AS builder

WORKDIR /src

COPY ./go.mod ./go.sum ./
RUN go mod download

COPY . .
RUN go build -o /app main.go

FROM alpine:3.17

COPY --from=builder /app /app

ENTRYPOINT ["/app"]
