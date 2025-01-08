FROM nginx:bookworm

# RUN sed -i "s|root   /usr/share/nginx/html;|root   /var/www/html;|g" /etc/nginx/conf.d/default.conf

# TODO: CHANGE THIS WHEN DEVELOPMENT IS DONE
RUN sed -i "s|user  nginx;|user  root;|g" /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
