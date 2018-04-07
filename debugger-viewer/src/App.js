import React, { Fragment, PureComponent } from 'react';
import { createStore, applyMiddleware} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import reducer from './reducers'
import thunk from 'redux-thunk'
import { listenForEvents, streamEventsBuffer, stopListening } from './actions'
import Events from './api/events'
import EventsList from './containers/EventsContainer'
import EventsToolBar from './containers/EventsToolbarContainer'
import Notifications from './containers/Notifications'
import SearchWorker from 'workerize-loader!./search-worker'; // eslint-disable-line import/no-webpack-loader-syntax
import { Pane } from 'evergreen-ui';
import { borderColor } from './pallete';

const EVENT_SOURCE_URL = 'http://localhost:3001/stream';
const events = new Events(EVENT_SOURCE_URL);

const searchWorker = SearchWorker();

const middleware = [
  thunk.withExtraArgument({ events, searchWorker }),
];

if (process.env.NODE_ENV !== 'production') {
  // middleware.push(createLogger());
}

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(...middleware)
  )
);

store.dispatch(streamEventsBuffer());

class App extends PureComponent {
  componentWillUnmount() {
    store.dispatch(stopListening());
  }

  render() {
    return (
      <Provider store={store}>
        <div style={{ display: 'flex' }}>
          <Pane maxWidth="550px" flex="1 0 auto"
            borderColor={borderColor} borderRight>
            <EventsToolBar />
            <EventsList />
            <Notifications/>
          </Pane>
          <Pane maxWidth="550px" flex="0 0 auto">

          </Pane>
        </div>
      </Provider>
    );
  }
}

export default App;
