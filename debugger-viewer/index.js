'use strict'

const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const subscribe = require('redis-subscribe-sse');

const app = new Koa();

app.use(logger())

let router = new Router()

router.get('/stream', (ctx, next) => {
  ctx.req.setTimeout(Number.MAX_SAFE_INTEGER);
  ctx.type = 'text/event-stream; charset=utf-8';

  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Connection', 'keep-alive');
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  // ctx.set('Access-Control-Allow-Credentials', 'true');

  ctx.body = subscribe({
    channels: ['events'],
    // retry: 10000,
    // channelsAsEvents: true
  });
})

app.use(router.routes())

app.listen(3001, () => {
  console.log('Koa listening on port 3001')
});
