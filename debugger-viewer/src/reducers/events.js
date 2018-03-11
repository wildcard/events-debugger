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
  ERROR_RECEIVING_EVENT
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
      return action.pendingEvents.isList() ?
        action.pendingEvents.concat(state) : state;
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

// const map = (state = {}, action) => {
//   switch (action.type) {
//     case RECEIVE_EVENT:
//       return {
//         ...state,
//         [action.event.id]: action.event,
//       };
//     default:
//       const { eventId } = action
//
//       if (eventId) {
//         return {
//           ...state,
//           [eventId]: selectEvent(state[eventId], action)
//         }
//       }
//
//       return state;
//   }
// }

// const visibleIds = (state = [], action) => {
//   switch (action.type) {
//     case RECEIVE_EVENT:
//       return [
//         ...state,
//         action.event.id
//       ]
//     default:
//       return state
//   }
// }

const status = (state = 'INIT', action) => {
  switch (action.type) {
    case START_LISTENING_FOR_EVENTS:
      return 'START';
    case RECEIVE_EVENT:
      return 'RECEIVING';
    case PAUSE_EVENTS:
      return 'PAUSED';
    case RESUME_EVENTS:
      return 'RESUMED';
    case ERROR_RECEIVING_EVENT:
      return 'ERROR';
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

export default combineReducers({
    status,
    list,
    pending,
    // map,
    // visibleIds
    isPaused,
  });

// export const getEvent = (state, id) => (
//   state.map[id]
// )
//
// export const getVisibleEvents = state => (
//   state.visibleIds.map(id => getEvent(state, id))
// )

// export const isOpertional = state => (
//   ['RECEIVING', 'RESUMED'].includes(state)
// )
