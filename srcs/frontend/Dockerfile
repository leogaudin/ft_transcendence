FROM nginx:bookworm

# TODO: CHANGE THIS WHEN DEVELOPMENT IS DONE
RUN sed -i "s|user  nginx;|user  root;|g" /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
