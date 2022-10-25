# Build the React frontend

FROM node:17.9.0-slim AS frontend_builder

WORKDIR /opt/web-client

COPY ./web-client/package.json .
RUN yarn install

COPY ./web-client .
RUN yarn build

# Build the Golang backend

FROM golang:1.17-alpine AS backend_builder

WORKDIR /opt/api
RUN apk add make
COPY ./api .
RUN make clean && make build

# Deploy app on Nginx

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY ./conf/nginx.dev.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend_builder /opt/web-client/build /usr/share/nginx/html
COPY --from=backend_builder /opt/api/bin /opt/app

EXPOSE 8080

ENTRYPOINT ["/bin/sh", "-c", "nginx -g 'daemon on;' && /opt/app/nobincloud"]



