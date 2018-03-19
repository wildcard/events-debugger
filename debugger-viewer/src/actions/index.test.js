import parseEventMessageData from '../utils/parse-event-message-data';
import Benchmark from 'benchmark';

const message = {
  data: '{"type":"track","messageId":"ajs-70d55264-16c8-42a5-8749-30c00a8f321f","context":{"ip":"187.147.151.235","library":{"name":"analytics.js","version":"3.0.0"}},"integrations":{},"receivedAt":"2018-03-18T16:20:37.968Z","sentAt":1521390032968,"userId":"17d6beb2-f073-424b-885e-8e0048802f1e","anonymousId":"2c2caf3d-e30f-41a2-bb1e-42bc0f62f55e","event":"Survey Viewed"}',
  type: "message",
}

describe('parseEventMessage', () => {
  it('base', () => {
    const eventMessage = parseEventMessageData(message.data);
    const { id } = eventMessage;

    expect(id).toBe('ajs-70d55264-16c8-42a5-8749-30c00a8f321f');
  });
});
