# nobincloud

Your typical cloud storage, except the data is encrypted before uploading to the server.

## Setup

```sh
# App is running on localhost:8000
docker-compose up
```

## Limitations

- Doesn't support uploads greater than 32MB, because I couldn't figure out how to efficiently decrypt and download a large file in the browser.