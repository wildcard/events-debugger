var Benchmark = require('benchmark');
const flatten = require('./flatten');
const flatObjToString = require('./flat-object-to-string');
const parseEventMessage = require('./parse-event-message-data')

const message = {
  data: '{"type":"track","messageId":"ajs-70d55264-16c8-42a5-8749-30c00a8f321f","context":{"ip":"187.147.151.235","library":{"name":"analytics.js","version":"3.0.0"}},"integrations":{},"receivedAt":"2018-03-18T16:20:37.968Z","sentAt":1521390032968,"userId":"17d6beb2-f073-424b-885e-8e0048802f1e","anonymousId":"2c2caf3d-e30f-41a2-bb1e-42bc0f62f55e","event":"Survey Viewed"}',
  type: "message",
}

const data = JSON.parse(message.data);
const flatData = flatten(data);

var suite = new Benchmark.Suite;

// add tests
suite.add('parseEventMessage', () => {
  const eventMessage = parseEventMessage(message);
})
.add('JSON.parse', () => {
  JSON.parse(message.data);
})
.add('flattenJsObj', () => {
  flatten(data);
})
.add('flatJsObjToString', () => {
  flatObjToString(flatData)
})
// add listeners
.on('cycle', (event) => {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });
