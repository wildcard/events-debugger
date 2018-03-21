'use strict'

const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const subscribe = require('redis-subscribe-sse');
const PassThrough = require('stream').PassThrough;
const Raven = require('raven');
Raven.config('https://fa5befd964b84192ab92b6f5e2126f93:b2ecefc1572b42b59533fb5768d2259e@sentry.io/301477').install();

const clientOrigin = process.env.NODE_ENV === 'production' ? 
  'http://localhost:5000' : 'http://localhost:3000';

const app = new Koa();

app.use(logger())

let router = new Router()

router.get('/stream', (ctx, next) => {
  // ctx.req.setTimeout(Number.MAX_SAFE_INTEGER);
  ctx.type = 'text/event-stream; charset=utf-8';

  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Connection', 'keep-alive');
  ctx.set('Access-Control-Allow-Origin', clientOrigin);
  // ctx.set('Access-Control-Allow-Credentials', 'true');

  const stream = subscribe({
    channels: ['events'],
    // retry: 10000,
    // channelsAsEvents: true
  });

  ctx.req.on('close', () => {
    ctx.res.end();
    stream.close();
  });

  ctx.req.on('finish', () => {
    ctx.res.end();
    stream.close();
  });

  ctx.req.on('error', () => {
    ctx.res.end();
    stream.close();
  });

  ctx.sseStream = stream;
  ctx.body = stream.on('error', ctx.onerror).pipe(PassThrough());
})

app.use(router.routes())

app.on('error', function (err, ctx) {
  ctx && ctx.sseStream && ctx.sseStream.close();

  Raven.captureException(err, function (err, eventId) {
      console.log('Reported error ' + eventId);
  });
});

app.listen(3001, () => {
  console.log('Koa listening on port 3001')
});
