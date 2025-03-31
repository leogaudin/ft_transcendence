FROM node:alpine

RUN apk add --no-cache sqlite=3.48.0-r0 openssl

WORKDIR /usr/transcendence

RUN mkdir -p /etc/transcendence/certs && openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/transcendence/certs/key.pem -out /etc/transcendence/certs/cert.pem \
  -subj "/C=ES/ST=Malaga/L=Malaga/O=42Malaga/OU=DefaultUnit/CN=localhost"

RUN mkdir -p /etc/ssl/certs/

RUN cat /etc/transcendence/certs/cert.pem  >> /etc/ssl/certs/ca-certificates.crt


COPY package.json .

CMD ["sh","node_start.sh"]
