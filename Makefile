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


repopulate:
		@docker exec -it back node api/dev/dummy.js

reset:
		@echo -n "Are you sure? [y/N] " && read ans && [ $${ans:-N} = y ]
		@rm ./srcs/backend/transcendence.db
		@echo -n "Repopulate with mockup data? [y/N] " && read ans && [ $${ans:-N} = y ]
		@make repopulate


.PHONY: all attach front back build down clean repopulate reset
