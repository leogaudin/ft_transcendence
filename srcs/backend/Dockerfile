FROM node:alpine

RUN apk add --no-cache sqlite=3.48.0-r0

WORKDIR /usr/transcendence

COPY package.json .

CMD ["sh","node_start.sh"]
