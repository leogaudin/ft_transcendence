all:
		@docker compose -f ./srcs/docker-compose.yml up --build -d

attach:
		@docker compose -f ./srcs/docker-compose.yml up --build

front:
		@docker compose -f ./srcs/docker-compose.yml up frontend --build -d

back:
		@docker compose -f ./srcs/docker-compose.yml up backend --build -d

build:
		@docker compose -f ./srcs/docker-compose.yml build

down:
		@docker compose -f ./srcs/docker-compose.yml down

clean: down
		@docker system prune -a -f

.PHONY: all attach front back build down clean
