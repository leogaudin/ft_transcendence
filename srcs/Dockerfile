FROM debian:bullseye

# For security reasons, the only UID allowed in the container will be root
RUN rm /etc/passwd /etc/group \
  && mkdir -p /root \
  && echo 'root:x:0:0:root:/root:/bin/bash' > /etc/passwd \
  && echo 'root:x:0' > /etc/group

CMD ["tail", "-f", "/dev/null" ]
