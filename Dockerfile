FROM node:22.3.0-alpine

RUN apk update
RUN apk add bash

RUN mkdir -p /usr/src/cache
WORKDIR /usr/src/cache

COPY package*.json .

COPY entrypoint.sh .

RUN chmod +x /usr/src/cache/entrypoint.sh

RUN npm install

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .

ENV APP_PORT 3030
EXPOSE $APP_PORT
