import { combineReducers } from 'redux'
import events, * as fromEvents from './events'

export default combineReducers({
  events
})

// const getEvent = (state, id) => fromEvents.getEvent(state.events, id)
