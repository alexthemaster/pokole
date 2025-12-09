# Docker Hub

## We recommend running Pokole through Docker Compose, here's an example:

```yaml
services:
  # For more info and setup visit https://hub.docker.com/_/postgres
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
    volumes:
      - postgres:/var/lib/postgresql
    environment:
      POSTGRES_USER: postgres
      # Change this
      POSTGRES_PASSWORD: password
      POSTGRES_DB: pokole

  pokole:
    container_name: pokole
    image: alexthemaster/pokole
    restart: always
    environment:
      DB_USER: postgres
      # Change this
      DB_PASSWORD: password
      DB_HOST: postgres
      DB_NAME: pokole
      DB_PORT: 5432
      # Change this
      URL: http://change.me
      PORT: 80
      # Change this
      JWT: password
      REGISTRATION: true
    ports:
      # Change in case you want to expose to other port
      - 80:80
    # If you want to host your own web UI instead of Pokole Web
    # volumes:
    #   - /path/to/static/files:/pokole/static
    depends_on:
      - postgres

volumes:
  - postgres:
```

### Info

`URL` is the URL the user accesses

`PORT` is the port the server should run on

`JWT` provide a strong password to encrypt authentication tokens with

`REGISTRATION` is a boolean that tells the server whether to allow registering new users

# Manually build

From parent directory: `docker build -t pokole -f docker/Dockerfile .`
