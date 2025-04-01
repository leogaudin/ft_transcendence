FROM nginx:alpine

RUN apk add --no-cache \
      nodejs=22.13.1-r0 \
      npm=10.9.1-r0 \
      supervisor=4.2.5-r5 \
      openssl=3.3.3-r0

RUN mkdir -p /etc/nginx/ssl &&  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/key.pem -out /etc/nginx/ssl/cert.pem \
  -subj "/C=ES/ST=Malaga/L=Malaga/O=42Malaga/OU=DefaultUnit/CN=localhost"

WORKDIR /usr/share/nginx/html

# TODO: CHANGE THIS WHEN DEVELOPMENT IS DONE
RUN sed -i "s|user  nginx;|user  root;|g" /etc/nginx/nginx.conf
RUN mkdir -p /var/log/supervisord

COPY config/nginx.conf /etc/nginx/conf.d/default.conf

COPY package.json .
COPY config/supervisor.conf /etc/supervisor.conf

CMD ["sh", "config/start_front.sh"]
