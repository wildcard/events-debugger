install: install-client install-server

install-client:
	cd ./debugger-viewer; \
		npm i

install-server:
	cd ./debugger-stream-reader; \
		npm i

build:
	cd ./debugger-viewer; \
		npm run build

start-events-simulator:
	docker-compose up -d stream;

start-client:
	cd ./debugger-viewer; \
		npm start;
	open http://localhost:5000

start-server:
	cd ./debugger-stream-reader; \
		npm start;

start: build start-events-simulator start-server start-client

stop-events-simulator:
	docker-compose down;

stop-client:
	cd ./debugger-viewer; \
		npm stop;
stop-server:
	cd ./debugger-stream-reader; \
		npm stop;

stop: stop-client stop-server stop-events-simulator
