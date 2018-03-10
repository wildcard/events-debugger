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

> 2018-03-09 09:00 - end - WIP UI with evergreen-ui

Comments
--------
