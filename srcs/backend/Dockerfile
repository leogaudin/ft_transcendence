FROM python:bookworm
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y \
  python3 \
  python3-pip \
  python3-venv \
  libpq-dev
WORKDIR /transcendence
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["sh", "start-django.sh"]
