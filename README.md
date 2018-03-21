The Debugger
=====================

One of the most valuable features for our customers (and one of our most fun features to build) is our debugger:

![](https://d2mxuefqeaa7sj.cloudfront.net/s_0214AD4E9A4C26164E7282B23966A47819931F0CE5FC5D9A3E6F435B7923DA7A_1517350155952_image.png)


We’d like you to build an implementation of this using a modern web framework and set of build tools. You should use whatever you’re most comfortable with for this, but we recommend the following modern tools: React, Redux, Webpack— ideally, we’d like to see something that can load events from a Redis event stream, send them to the client, and build a UI for displaying those events that includes a button for pausing/resuming the events, and a search box for filtering the events.


Here’s what we care about:
- it works
- write this like you would write production code at your company. i.e.
  - proper error handling and logging
  - resilient code that can recover from crashes/failures
- the code is high-quality and tested
- it matches the visual mock
  - Note: feel free to create a Segment account and borrow CSS from the debugger!


This project should take 5-10 hours, depending on how in-depth you decide to go. Don’t worry too much about the time though, and feel free to take the full 48 hours to finish the project.

---

Start
-----

please install make to use the `makefile`
see following section for no love for `makefile`

Please make sure you have docker installed beforehand, because the stream simulator is using docker

run the following

`make install`

will install node dependencies for client & server

`make start`

run docker, client and server production builds

no makefile
-----------

### docker

`docker-compose up -d stream`

### client

`cd ./debugger-viewer`
`npm i`
`npm run build`
`npm start`

using serve, see `nohup.out` for `stdout`

### server

`cd ./debugger-stream-reader`
`npm i`
`npm start`

using forever

Running locally
---------------

### docker

`docker-compose up stream`

### client

`cd ./debugger-viewer`
`npm i`
`npm start:dev`

### server

`cd ./debugger-stream-reader`
`npm i`
`npm start:dev`

using nodemon

Resources
---------

- EventSource (pollyfill for IE) - Client
- SSE - Server
- redis stream to SSE

Time Sheet
----------

> 2018-03-08 01:00 - 01:45

research came out with solution

> 2018-03-08 18:00

test docker image,

objective: listen to incoming messages

questions:

- will the client(JS) will be able to held all the incoming messages (will/when it will be too much information to hold in client)

- will pause close the connection or just stop rendering new messages (should I continue gathering message when user is paused the debugger?)

> 2018-03-08 20:00

start listening to events in browser

> 2018-03-08 21:15

Observing errors in node server(TCP) I guess the connection is open too long..

> 2018-03-08 22:10

error didn't happed again until now.
started building react Components for the persisting the events

> 2018-03-08 23:00

last line of code for the day - push to github

> 2018-03-09 22:30 - start state management with redux + immutable js

add fixes to koa, make it more resilient

> 2018-03-10 09:00 - end - WIP UI with evergreen-ui

> 2018-03-10 21:00 - experiment with rx for back pressure solution

> 2018-03-11 02:00 - working rx solution - needs bulletproofing

> 2018-03-13 00:40 - 2018-03-13 02:40 - style, considering web workers

> 2018-03-13 20:30 - 2018-03-14 01:35 - styling

> 2018-03-17 16:30 - 21:00 - trying to make animation work (trigger only from top and on first render)

> 2018-03-17 23:30 - 2018-03-18 05:30 - finish up pause + search

> 2018-03-18 05:30 - 2018-03-18 06:40 - merge paused events + reselect

> 2018-03-18 06:40 - 08:00 - experiment with lunr + web worker

> 2018-03-18 18:10 - 00:00 - started testing + benchmarking + search via web worker

> 2018-03-19 00:00 - 01:00 - exploring UI/UX ideas in Evergreen UI

> 2018-03-19 01:00 - 05:00 - add new UI/UX from Evergreen (pause pending message) + stencil

> 2018-03-19 06:00 - 06:30 - consider persisting to indexDB the eventSource then consuming events + consider implementing caping mech to avoid consuming too much memory (index + render)

> 2018-03-20 00:00 - 06:00 - fix animation grow animation (only on newly rendered events) + fix scroll sync

> 2018-03-20 06:00 - 14:00 - refracting + breaking and fixing the animation 😵


Comments
--------
