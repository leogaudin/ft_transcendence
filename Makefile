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
		@rm -rf ./srcs/backend/node_modules
		@rm -rf ./srcs/frontend/node_modules

repopulate:
		@docker exec -it back node api/dev/dummy.js

re: clean all

db:
		@docker exec -it back sqlite3 transcendence.db

reset:
		@echo -n "Are you sure? [y/N] " && read ans && [ $${ans:-N} = y ]
		@docker compose -f ./srcs/docker-compose.yml stop backend
		@rm -f ./srcs/backend/transcendence.db
		@find ./srcs/backend/api/avatars/ ! -name 'default.jpg' -type f -exec rm -f {} +
		@echo -n "Repopulate with mockup data? [y/N] " && read ans && [ $${ans:-N} = y ]
		@make back && sleep 1
		@make repopulate

.PHONY: all attach front back build down clean repopulate reset re db
