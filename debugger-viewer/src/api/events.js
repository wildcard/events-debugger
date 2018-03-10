export default class Events {
  constructor(url) {
    this.url = url;
  }

  handleEventSourceError = (onEventSourceError) => () => {
    onEventSourceError && onEventSourceError();
  }

  listen(onEventReceived, onEventSourceError) {
    this.source = new EventSource(this.url);
    this.source.onmessage = onEventReceived;
    this.source.onerror = this.handleEventSourceError(onEventSourceError);

    this.source.onopen = console.log.bind(this, 'EventSource opened!')
  }

  close () {
    this.source.close();
    console.log('EventSource closed!')
  }
}

// export const listenForEvents = (handleEventReceived, handleEventSourceError) => {
//   const source = new EventSource(EVENT_SOURCE_URL);
//
//   source.onmessage = handleEventReceived;
//   source.onerror = handleEventSourceError;
// }
