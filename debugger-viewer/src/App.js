import React, { Component } from 'react';
import { createStore, applyMiddleware} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import reducer from './reducers'
import thunk from 'redux-thunk'
import { listenForEvents, streamEventsBuffer } from './actions'
import Events from './api/events'
import EventsList from './containers/EventsContainer'
import EventsToolBar from './containers/EventsToolbarContainer'
import './App.css';
import worker from 'workerize-loader!./worker'; // eslint-disable-line import/no-webpack-loader-syntax

const EVENT_SOURCE_URL = 'http://localhost:3001/stream';

const middleware = [
  thunk,
];

if (process.env.NODE_ENV !== 'production') {
  // middleware.push(createLogger());
}

const store = createStore(
  reducer,
  // composeWithDevTools(
    applyMiddleware(...middleware)
  // )
)

const events = new Events(EVENT_SOURCE_URL);
const workerInst = worker();

(async () => {
	console.log('3 + 9 = ', await workerInst.add(3, 9));
	console.log('1 + 2 = ', await workerInst.add(1, 2));
})();

const workerEventsSubscription = (eventMessages) => {
  console.log(eventMessages);
}

const indexBuildInverval = window.setInterval(
// (
  async () => {
  await workerInst.index(
    store.getState().events.list.toArray()
  );
}
// )();
, 1000);

store.dispatch(
  streamEventsBuffer(events, workerEventsSubscription)
);

window.searchWorker = workerInst;

setTimeout(() => {
  events.close();
  clearInterval(indexBuildInverval);
}, 10000);

class App extends Component {
  componentWillUnmount() {
    events.close();
    clearInterval(indexBuildInverval);
  }

  render() {
    return (
      <Provider store={store}>
        <div>
          <EventsToolBar/>
          <EventsList />
        </div>
      </Provider>
    );
  }
}

export default App;
