FROM node:lts-alpine

WORKDIR /pokole

RUN mkdir ./src

COPY package.json ./
COPY tsconfig.json ./
COPY package-lock.json ./
COPY src ./src
COPY docker/index.js ./
COPY src/static/404/ ./static/404/

RUN npm install

RUN npm run build

RUN apk add --no-cache git

RUN git clone https://github.com/alexthemaster/pokole-web

RUN cd pokole-web && npm install && npm run build && cp dist/* ../static/ -r

CMD ["node", "index.js"]
