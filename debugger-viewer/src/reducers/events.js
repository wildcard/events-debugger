import { combineReducers } from 'redux'
import { List } from 'immutable'
import {
  START_LISTENING_FOR_EVENTS,
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
        return action.result.map(r => r.id);
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

const status = (state = 'INIT', action) => {
  switch (action.type) {
    case START_LISTENING_FOR_EVENTS:
      return 'START';
    case RECEIVE_EVENT:
    case RECEIVE_EVENTS:
      return 'RECEIVING';
    case PAUSE_EVENTS:
      return 'PAUSED';
    case RESUME_EVENTS:
      return 'RESUMED';
    case ERROR_RECEIVING_EVENT:
      return 'ERROR';
    case SEARCH_EVENTS:
      return 'SEARCHING';
    case RECEIVED_SEARCH_RESULTS:
      return 'SEARCH_FILTERD_VIEW';
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
    case RECEIVE_EVENT:
    case RECEIVE_EVENTS:
    case RECEIVED_SEARCH_RESULTS:
       return false;
    default:
      return state;
  }
};

export default combineReducers({
    status,
    list,
    pending,
    map,
    visibleEventIds,
    isPaused,
    isLoading,
    searchInput,
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
