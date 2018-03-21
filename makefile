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

start: build
	docker-compose up -d stream;
	cd ./debugger-viewer; \
		npm start;
	cd ./debugger-stream-reader; \
		npm start;
	open http://localhost:5000

stop:
	docker-compose down;
	cd ./debugger-viewer; \
		npm stop;
	cd ./debugger-stream-reader; \
		npm stop;
