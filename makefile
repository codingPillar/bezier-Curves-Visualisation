#not really going to be used since we are running the app on the web
all:
	tsc
	node ./out/main.js

build:
	tsc