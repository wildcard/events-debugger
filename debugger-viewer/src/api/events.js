export default class Events {
  constructor(url) {
    this.url = url;
    this.source = new EventSource(this.url);
  }

  _onError = (e) => {
    if (e.readyState === EventSource.CLOSED) {
      this.onComplete();
    } else {
      this.onError(e);
    }
  }

  retry() {
    this.source = new EventSource(this.url);
    this._listen();
  }

  _listen() {
    this.source.addEventListener('message', this.onMessage, false);
    this.source.addEventListener('error', this._onError, false);
    this.source.addEventListener('open', this.onOpen, false);
  }

  listen(onEventReceived, onEventSourceError, onOpen, onComplete) {
    this.onMessage = onEventReceived;
    this.onError = onEventSourceError;
    this.onOpen = onOpen;
    this.onComplete = onComplete;
  }

  close () {
    this.source.removeEventListener('error', this._onError, false);
    this.source.removeEventListener('message', this.onMessage, false);
    this.source.removeEventListener('open', this.onOpen, false);
    this.onComplete();
    this.source.close();
  }
}
