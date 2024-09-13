# Docker Hub

## We recommend running Pokole through Docker Compose, here's an example:

```yaml
services:
  postgres:
    container_name: postgreSQL
    image: postgres
    restart: always
    # set shared memory limit when using docker-compose
    shm_size: 128mb
    # or set shared memory limit when deploy via swarm stack
    #volumes:
    #  - type: tmpfs
    #    target: /dev/shm
    #    tmpfs:
    #      size: 134217728 # 128*2^20 bytes :  128Mb
    environment:
      POSTGRES_USER: postgres
      # Change this
      POSTGRES_PASSWORD: password

  pokole:
    container_name: pokole
    image: alexthemaster/pokole
    restart: always
    environment:
      DB_USER: postgres
      # Change this
      DB_PASSWORD: password
      DB_HOST: postgres
      DB_NAME: postgres
      DB_PORT: 5432
      # Change these two
      FRONT_URL: localhost
      BACK_URL: localhost:8080
      FRONT_PORT: 80
      BACK_PORT: 8080
      # Change this
      JWT: password
      REGISTRATION: true
    ports:
      # Change in case you want to expose to other ports
      - 80
      - 8080
    # If you want to host your own static files (or Pokole Web)
    # volumes:
    #   - /path/to/static/files:/pokole/static
    depends_on:
      - postgres
```

### Info

`FRONT_URL` is the URL the user accesses

`BACK_URL` is the URL the API will respond on

`FRONT_PORT` is the port the front-end server should run on

`BACK_PORT` is the port the back-end should run on

`JWT` provide a strong password to encrypt authentication tokens with

`REGISTRATION` is a boolean that tells the server whether to allow registering new users

# Manually build

Navigate to this folder and build the Docker image using: `docker build -t pokole .`
