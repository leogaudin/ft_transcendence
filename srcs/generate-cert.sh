#!/bin/bash

mkdir -p srcs/certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout srcs/certs/key.pem -out srcs/certs/cert.pem \
  -subj "/C=ES/ST=Malaga/L=Malaga/O=42Malaga/OU=DefaultUnit/CN=localhost"
cp -r srcs/certs srcs/backend/certs
cp -r srcs/certs srcs/frontend/certs
