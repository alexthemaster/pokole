FROM node:18-alpine

WORKDIR /pokole

RUN npm install pokole

ENV DB_HOST=host.docker.internal

COPY index.js index.js

CMD ["node", "index.js"]