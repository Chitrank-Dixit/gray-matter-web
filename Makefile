all: run

run: setup up

setup:
    docker-compose build

up:
	docker-compose up -d

reload:
	docker-compose up -d

rm:
	docker-compose kill gray-matter-web_gray-matter-web && docker-compose rm --force --all gray-matter-web_gray-matter-web

stop:
	docker-compose stop --timeout 3

clean:
    docker-compose down --remove-orphans
	docker system prune

logs:
	docker cp gray-matter-web_gray-matter-web:/usr/src/app/logs/gray-matter-web_gray-matter-web.log .

ps:
	docker-compose ps

