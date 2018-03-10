import React, { Component } from 'react';
import { createStore, applyMiddleware} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import reducer from './reducers'
import thunk from 'redux-thunk'
import { listenForEvents } from './actions'
import Events from './api/events'
import EventsList from './containers/EventsContainer'
import logo from './logo.svg';
import './App.css';
import 'react-virtualized/styles.css'; // only needs to be imported once

const EVENT_SOURCE_URL = 'http://localhost:3001/stream';

const middleware = [
  thunk,
];

if (process.env.NODE_ENV !== 'production') {
  // middleware.push(createLogger());
}

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(...middleware))
)

const events = new Events(EVENT_SOURCE_URL);
store.dispatch(listenForEvents(events));

class App extends Component {
  componentWillUnmount() {
    events.close();
  }

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>

          <EventsList />
        </div>
      </Provider>
    );
  }
}

export default App;
