FROM python:bookworm

RUN apt update && apt upgrade -y

RUN apt install -y python3 python3-pip python3-venv libpq-dev

WORKDIR /transcendence
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

CMD ["python3", "manage.py", "runserver", "0.0.0.0:9000"]
