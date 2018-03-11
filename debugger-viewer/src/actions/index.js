import * as types from '../constants/ActionTypes'
import { Observable } from 'rxjs/Observable';
import { bufferCount } from 'rxjs/operators';

const parseEventMessage = message => {
  const { data: rawData } = message;
  const data = JSON.parse(rawData);
  const {
    messageId: id
  } = data;

  return {
    id,
    rawData,
    ...data
  };
}

const receiveEventWhilePaused = event => ({
  type: types.RECEIVED_PENDING_EVENT,
  event,
})

const receiveEventsWhilePaused = events => ({
  type: types.RECEIVED_PENDING_EVENTS,
  events,
})

const appendPendingEvents = pendingEvents => ({
  type: types.MERGE_PENDING_EVENTS,
  pendingEvents
})

const receiveEvent = eventMessage => (dispatch, getState) => {
  const { isPaused } = getState();
  const event = parseEventMessage(eventMessage);

  if (isPaused) {
    dispatch(receiveEventWhilePaused(event));
  } else {
    dispatch({
      type: types.RECEIVE_EVENT,
      event,
    });
  }
}

const receiveEvents = eventMessages => (dispatch, getState) => {
  const { isPaused } = getState();
  const events = eventMessages.map(parseEventMessage);

  if (isPaused) {
    dispatch(receiveEventsWhilePaused(events));
  } else {
    dispatch({
      type: types.RECEIVE_EVENTS,
      events,
    });
  }
}

const errorReceivingEvent = () => ({
  type: types.ERROR_RECEIVING_EVENT
})

export const streamEventsBuffer = (events) => dispatch => {
  const eventsObservable = Observable.create(observer => {
    events.listen(eventMessage => {
      observer.next(eventMessage);
    }, () => {
      dispatch(errorReceivingEvent());
    });
  });

  eventsObservable.pipe(bufferCount(20)).subscribe(eventMessages => {
    dispatch(receiveEvents(eventMessages));
  });
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
