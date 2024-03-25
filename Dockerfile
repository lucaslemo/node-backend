FROM node:20.10.0

RUN apt update && apt upgrade -y

WORKDIR /usr/app

COPY package*.json .

RUN npm install

COPY . .

ENV APP_PORT 3000
EXPOSE $APP_PORT

CMD ["npm", "run", "dev"]