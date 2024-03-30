FROM node:20.10.0

RUN apt update && apt upgrade -y

RUN mkdir /usr/src/cache
WORKDIR /usr/src/cache

COPY package.json .
COPY package-lock.json .
COPY entrypoint.sh .

RUN chmod +x /usr/src/cache/entrypoint.sh

RUN npm install

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY . .

ENV APP_PORT 3000
EXPOSE $APP_PORT
