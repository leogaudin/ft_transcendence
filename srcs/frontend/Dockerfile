FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN apk add --no-cache nodejs npm supervisor

# TODO: CHANGE THIS WHEN DEVELOPMENT IS DONE
RUN sed -i "s|user  nginx;|user  root;|g" /etc/nginx/nginx.conf

COPY package.json .
COPY supervisor.conf /etc/supervisor.conf

CMD ["sh", "start_front.sh"]
