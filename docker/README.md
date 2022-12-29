# Docker Hub

Head over to [Docker Hub](https://hub.docker.com/r/alexthemaster/pokole) to read how to pull and use the pre-built image.

# Manual build

Navigate to this folder and build the Docker image using: `docker build -t pokole .`

After building, you can simply run the following command to start the server: `docker run -d --env DB_USER=postgres --env DB_PASSWORD=password --env DB_HOST=localhost --env DB_NAME=postgres --env DB_PORT=5432 --env FRONT_URL=localhost --env BACK_URL=localhost:8080 --env FRONT_PORT=80 --env BACK_PORT=8080 --env JWT=password --env REGISTRATION=true -p 80:80 -p 8080:8080 pokole`
