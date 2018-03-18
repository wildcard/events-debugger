import * as types from '../constants/ActionTypes'
import { Observable } from 'rxjs/Observable';
import { bufferCount, bufferTime, delay, concatAll } from 'rxjs/operators';
import flatten from 'flat';
import mapValues from 'lodash.mapvalues';
import isEmpty from 'lodash.isempty';
import { filterEvent } from '../reducers/events';
const RECEIVE_EVENTS_BUFFER_SIZE = 5;

const parseEventMessage = message => {
  const { data: rawData } = message;
  const data = JSON.parse(rawData);
  const flatData = mapValues(flatten(data), val => {
    if (isEmpty(val)) {
      return String();
    } else {
      return String(val).toLowerCase();
    }
  });
  const {
    messageId: id
  } = data;

  return {
    id,
    rawData,
    flatData,
    ...data
  };
}

const receiveEventWhilePaused = (event, searchInput) => ({
  type: types.RECEIVED_PENDING_EVENT,
  event,
  searchInput
})

const receiveEventsWhilePaused = (events, searchInput) => ({
  type: types.RECEIVED_PENDING_EVENTS,
  events,
  searchInput
})

export const prependPendingEvents = () => (dispatch, getState) => {
  const {
    pending: events,
    searchInput
  } = getState().events;

  dispatch({
    type: types.MERGE_PENDING_EVENTS,
    events,
    searchInput
  })
}

const receiveEvent = eventMessage => (dispatch, getState) => {
  const { isPaused, searchInput } = getState().events;
  const event = parseEventMessage(eventMessage);

  if (isPaused) {
    dispatch(receiveEventWhilePaused(event, searchInput));
  } else {
    dispatch({
      type: types.RECEIVE_EVENT,
      event,
      searchInput
    });
  }
}

const receiveEvents = eventMessages => (dispatch, getState) => {
  const { isPaused, searchInput } = getState().events;
  const events = eventMessages.map(parseEventMessage);

  if (isPaused) {
    dispatch(receiveEventsWhilePaused(events, searchInput));
  } else {
    dispatch({
      type: types.RECEIVE_EVENTS,
      events,
      searchInput
    });
  }
}

const startListening = () => ({
  type: types.START_LISTENING_FOR_EVENTS
});

const errorReceivingEvent = () => ({
  type: types.ERROR_RECEIVING_EVENT
})

export const streamEventsBuffer = (events, subscribtion) => dispatch => {
  const eventsObservable = Observable.create(observer => {
    dispatch(startListening());

    events.listen(eventMessage => {
      observer.next(eventMessage);
    }, () => {
      dispatch(errorReceivingEvent());
    });
  });

  return eventsObservable
    .pipe(
      // bufferTime(1000),
      bufferCount(RECEIVE_EVENTS_BUFFER_SIZE),
      // concatAll(),
      delay(1000))
    // .pipe(bufferCount(RECEIVE_EVENTS_BUFFER_SIZE))
    // .pipe(delay(1000))
    .subscribe(eventMessages => {
      eventMessages &&
        window.requestAnimationFrame(time => dispatch(receiveEvents(eventMessages)));
    })//.subscribe(subscribtion);
}

export const listenForEvents = (events) => dispatch => {
  events.listen(eventMessage => {
    dispatch(receiveEvent(eventMessage));
  }, () => {
    dispatch(errorReceivingEvent());
  })
}

export const pauseEvents = () => ({
  type: types.PAUSE_EVENTS,
});

export const resumeEvents = () => ({
  type: types.RESUME_EVENTS,
});

export const search = (input) => (dispatch, getState) => {
  const { list } = getState().events;

  dispatch({
    type: types.SEARCH_EVENTS,
    input,
    ids: !input ? list.map(e => e.id): null,
  });

  window.requestAnimationFrame(time => {

    const result = list.filter(filterEvent(input));

    dispatch({
      type: types.RECEIVED_SEARCH_RESULTS,
      result
    })
  });

}
