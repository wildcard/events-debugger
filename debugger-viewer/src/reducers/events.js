import { combineReducers } from 'redux'
import { List } from 'immutable'
import {
  START_LISTENING_FOR_EVENTS,
  STOP_LISTENING_FOR_EVENTS,
  START_RECEIVING_EVENTS,
  RECEIVE_EVENT,
  RECEIVE_EVENTS,
  RECEIVED_PENDING_EVENT,
  RECEIVED_PENDING_EVENTS,
  MERGE_PENDING_EVENTS,
  PAUSE_EVENTS,
  RESUME_EVENTS,
  TOGGLE_EVENT_SELECTION,
  ERROR_RECEIVING_EVENT,
  SEARCH_EVENTS,
  RECEIVED_SEARCH_RESULTS,
  INDEX_EVENTS_BUFFER,
  INDEX_EVENTS_BUFFER_FINISHED,
  INDEX_EVENTS_SUBSCRIPTION,
  RENDER_EVENTS_SUBSCRIPTION,
} from '../constants/ActionTypes'

const selectEvent = (state, action) => {
  switch (action.type) {
    case TOGGLE_EVENT_SELECTION:
      return {
        ...state,
        selected: !state.selected
      }
    default:
      return state
  }
}

const list = (state = List(), action) => {
  switch (action.type) {
    case RECEIVE_EVENT:
      return state.unshift(action.event);
    case RECEIVE_EVENTS:
        return state.unshift(...action.events);
    case MERGE_PENDING_EVENTS:
      return List.isList(action.events) ?
        action.events.concat(state) : state;
    default:
      return state;
  }
}

const searchInput = (state = '', action) => {
  switch (action.type) {
    case SEARCH_EVENTS:
      return action.input;
    default:
      return state;
  }
}

export const filterEvent = (searchInput, searchKeys) => event => {
  const { flatData } = event;

  if (!searchInput) {
    return event;
  }

  return Object.keys(flatData).some(key => (
    flatData[key].indexOf(searchInput) !== -1 ||
      (searchKeys && key.indexOf(searchInput) !== -1)
  ));
}

const visibleEventIds = (state = [], action) => {
    const { searchInput } = action;

    switch (action.type) {
      case RECEIVE_EVENT:
        if (!filterEvent(searchInput)(action.event)) {
          return state;
        }

        return [
          action.event.id,
          ...state,
        ];
      case RECEIVE_EVENTS:
        return [
          ...action.events.filter(filterEvent(searchInput)).map(e => e.id),
          ...state,
        ];
      case MERGE_PENDING_EVENTS:
        return [
          ...action.events.filter(filterEvent(searchInput)).map(e => e.id),
          ...state,
        ];
      case RECEIVED_SEARCH_RESULTS:
        return action.result;
      // clear search input
      case SEARCH_EVENTS:
        const { input, ids } = action;

        return !input ? ids : state;
      default:
        return state
    }
}

const pending = (state = List(), action) => {
  switch (action.type) {
    case RECEIVED_PENDING_EVENT:
      return state.unshift(action.event);
    case RECEIVED_PENDING_EVENTS:
      return state.unshift(...action.events);
    case RECEIVE_EVENT:
    case RECEIVE_EVENTS:
    case MERGE_PENDING_EVENTS:
      return List();
    default:
      return state
  }
}

const map = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_EVENT:
      return {
        ...state,
        [action.event.id]: action.event,
      };
    case RECEIVE_EVENTS:
    case MERGE_PENDING_EVENTS:
      return {
        ...state,
        ...action.events.reduce((map, event) => {
          map[event.id] = event;
          return map;
        }, {})
      };
    default:
      const { eventId } = action

      if (eventId) {
        return {
          ...state,
          [eventId]: selectEvent(state[eventId], action)
        }
      }

      return state;
  }
}

const setStatus = (type) => ({
  type,
  timestamp: Date.now()
});

const status = (state = 'INIT', action) => {
  switch (action.type) {
    case START_LISTENING_FOR_EVENTS:
      return setStatus('START');
    case STOP_LISTENING_FOR_EVENTS:
      return setStatus('STOP');
    case START_RECEIVING_EVENTS:
      return setStatus('FIRST_EVENT');
    case RECEIVE_EVENT:
    case RECEIVE_EVENTS:
      return setStatus('RECEIVING');
    case PAUSE_EVENTS:
      return setStatus('PAUSED');
    case RESUME_EVENTS:
      return setStatus('RESUMED');
    case ERROR_RECEIVING_EVENT:
      return setStatus('ERROR');
    case SEARCH_EVENTS:
      return setStatus('SEARCHING');
    case RECEIVED_SEARCH_RESULTS:
      return setStatus('SEARCH_FILTERD_VIEW');
    default:
        return state;
  }
}

const isPaused = (state = false, action) => {
  switch (action.type) {
    case PAUSE_EVENTS:
       return true;
    case RESUME_EVENTS:
       return false;
    default:
      return state;
  }
};

const isLoading = (state = false, action) => {
  switch (action.type) {
    case START_LISTENING_FOR_EVENTS:
    case SEARCH_EVENTS:
       return true;
    case START_RECEIVING_EVENTS:
    case RECEIVE_EVENT:
    case RECEIVE_EVENTS:
    case RECEIVED_SEARCH_RESULTS:
       return false;
    default:
      return state;
  }
};

const isIndexing = (state = false, action) => {
  switch (action.type) {
    case INDEX_EVENTS_BUFFER:
      return true;
    case INDEX_EVENTS_BUFFER_FINISHED:
      return false;
    default:
      return state;
  }
};

const search = (state = {}, action) => {
  const {
    type,
    ...other
  } = action;

  switch (type) {
    case RECEIVED_SEARCH_RESULTS:
      return {
        ...state,
        lastResultCount: action.result.length,
      };
    case INDEX_EVENTS_BUFFER:

      return {
        ...state,
        ...other,
      };
    case INDEX_EVENTS_BUFFER_FINISHED:
      return {
        ...state,
        ...other,
      };
    default:
      return state;
  }
}

const subscriptions = (state = {}, action) => {
  const { type, ...other } = action;
  switch (action.type) {
    case INDEX_EVENTS_SUBSCRIPTION:
    case RENDER_EVENTS_SUBSCRIPTION:
      return {
        ...state,
        ...other,
      };
    default:
      return state;
  }
}

export default combineReducers({
    status,
    list,
    pending,
    map,
    visibleEventIds,
    isPaused,
    isLoading,
    isIndexing,
    searchInput,
    search,
    subscriptions,
  });

export const getEvent = (state, id) => (
  state[id]
)

export const getStatus = (state) => (state.status);

export const getVisibleEvents = (visibleEventIds, map) => (
  List(visibleEventIds.map(id => getEvent(map, id)))
)

export const isOperational = state => (
  ['INIT', 'START', 'RECEIVING', 'RESUMED'].includes(getStatus(state))
)
