all:
		@docker-compose -f ./srcs/docker-compose.yml up --build -d

build:
		@docker-compose -f ./srcs/docker-compose.yml build

down:
		@docker-compose -f ./srcs/docker-compose.yml down

clean: down
		@docker system prune -a -f

.PHONY: all build down clean
