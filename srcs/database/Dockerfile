FROM postgres:bookworm

COPY connect.sh /usr/local/bin/connect
RUN chmod +x /usr/local/bin/connect
RUN echo 'echo "To connect to the database, use the command: connect"' > /root/.bashrc
