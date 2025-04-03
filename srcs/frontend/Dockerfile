FROM alpine/openssl:3.3.3 AS certificate
WORKDIR /certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /certificate/key.pem -out /certificate/cert.pem \
  -subj "/C=ES/ST=Malaga/L=Malaga/O=42Malaga/OU=DefaultUnit/CN=localhost"

FROM nginx:alpine
RUN apk add --no-cache \
      nodejs=22.13.1-r0 \
      npm=10.9.1-r0 \
      supervisor=4.2.5-r5
COPY --from=certificate /certificate /etc/nginx/ssl
WORKDIR /usr/share/nginx/html
# TODO: CHANGE THIS WHEN DEVELOPMENT IS DONE
RUN sed -i "s|user  nginx;|user  root;|g" /etc/nginx/nginx.conf
RUN mkdir -p /var/log/supervisord
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY package.json .
COPY config/supervisor.conf /etc/supervisor.conf
CMD ["sh", "config/start_front.sh"]
