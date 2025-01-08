FROM nginx:bookworm

RUN sed -i "s|root   /usr/share/nginx/html;|root   /var/www/html;|g" /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
