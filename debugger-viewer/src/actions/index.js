import * as types from '../constants/ActionTypes'
import { Observable } from 'rxjs/Observable';
import {
  bufferTime,
  windowTime,
  mergeAll,
  tap,
} from 'rxjs/operators';
import once from 'lodash.once';
import { filterEvent } from '../reducers/events';
import parseEventMessageData from '../utils/parse-event-message-data';
const RECEIVE_EVENTS_RENDER_BUFFER_SIZE = 5;
const RECEIVE_EVENTS_INDEX_BUFFER_SIZE = 1000;

const receiveEventWhilePaused = (event, searchInput) => ({
  type: types.RECEIVED_PENDING_EVENT,
  event,
  searchInput
});

const receiveEventsWhilePaused = (events, searchInput) => ({
  type: types.RECEIVED_PENDING_EVENTS,
  events,
  searchInput
});

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
};

const receiveEvent = eventMessage => (dispatch, getState) => {
  const { isPaused, searchInput } = getState().events;
  const event = parseEventMessageData(eventMessage.data);

  if (isPaused) {
    dispatch(receiveEventWhilePaused(event, searchInput));
  } else {
    dispatch({
      type: types.RECEIVE_EVENT,
      event,
      searchInput
    });
  }
};

const receiveEvents = eventMessages => (dispatch, getState) => {
  if (!eventMessages || !eventMessages.length) {
    return;
  }

  const { isPaused, searchInput } = getState().events;
  const events = eventMessages.map(eventMessage => parseEventMessageData(eventMessage.data));

  if (isPaused) {
    dispatch(receiveEventsWhilePaused(events, searchInput));
  } else {
    dispatch({
      type: types.RECEIVE_EVENTS,
      events,
      searchInput
    });
  }
};

const startListening = () => ({
  type: types.START_LISTENING_FOR_EVENTS
});

const startReceivingEvents = () => ({
  type: types.START_RECEIVING_EVENTS
});

const ReceivedFirstEvent = once((dispatch) => dispatch(startReceivingEvents()));

export const stopListening = () => (dispatch, getState, { events }) => {
  const { subscriptions } = getState().events;
  const {
    indexEventSubscription,
    renderEventsSubscription,
  } = subscriptions;

  dispatch({
    type: types.STOP_LISTENING_FOR_EVENTS
  });

  indexEventSubscription.unsubscribe();
  renderEventsSubscription.unsubscribe();
  console.log('EventSource closed!');
  events.close();
};

const errorReceivingEvent = () => ({
  type: types.ERROR_RECEIVING_EVENT
})

const indexEvents = (eventMessagesData) => (dispatch, getState, { searchWorker }) => {
  if (!eventMessagesData || !eventMessagesData.length) {
    return;
  }

  dispatch({
    type: types.INDEX_EVENTS_BUFFER,
    startIndexTime: Date.now(),
  });

  searchWorker.index(eventMessagesData)
    .then(lastIndexedEventId => {
      dispatch(indexEventsFinished(lastIndexedEventId));
    });
}

const indexEventsFinished = (lastIndexedEventId) => ({
  type: types.INDEX_EVENTS_BUFFER_FINISHED,
  lastIndexedEventId,
  finishedIndexTime: Date.now(),
})

export const streamEventsBuffer = () => (dispatch, getState, { events }) => {
  const eventsObservable = Observable.create(observer => {

    events.listen(
      (eventMessage) => {
        observer.next(eventMessage);
        ReceivedFirstEvent(dispatch)
      },
      (e) => {
        observer.error();
        dispatch(errorReceivingEvent());
      },
      () => {
        dispatch(startListening());
      },
      () => {
        observer.complete();
      }
    );

    return () => {
      events.close();
    };
  });

  // feed events for search index
  const indexEventSubscription = eventsObservable
    .pipe(bufferTime(5000, 2500, RECEIVE_EVENTS_INDEX_BUFFER_SIZE))
    .subscribe(eventMessages => {
      if (!eventMessages || !eventMessages.length) {
        return;
      }

      const eventMessagesData = eventMessages.map(em => em.data);
      dispatch(indexEvents(eventMessagesData));
    });

  dispatch({
    type: types.INDEX_EVENTS_SUBSCRIPTION,
     indexEventSubscription
  })

  // feed events for render
  const renderEventsSubscription = eventsObservable.pipe(
      bufferTime(1000, 1000, RECEIVE_EVENTS_RENDER_BUFFER_SIZE)
    )
    .subscribe(eventMessages => {
      if (!eventMessages || !eventMessages.length) {
        return;
      }

      // requestAnimationFrame(time => {
        dispatch(receiveEvents(eventMessages))
      // });
    });

    dispatch({
      type: types.RENDER_EVENTS_SUBSCRIPTION,
       renderEventsSubscription
    })
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

export const search = (input) => (dispatch, getState, { searchWorker }) => {
  const { list, search } = getState().events;
  const { lastIndexedEventId } = search;
  let result = [];

  dispatch({
    type: types.SEARCH_EVENTS,
    input,
    ids: !input ? list.map(e => e.id): null, // search filter cleared
  });

  // any search index exists
  if (lastIndexedEventId) {
    const lastIndexedEventListIndex = list.findIndex(i => lastIndexedEventId === i.id);
    const nonIndexedListSlice = list.slice(0, lastIndexedEventListIndex);

    result = nonIndexedListSlice
      .filter(filterEvent(input))
      .map(e => e.id);

    searchWorker.search(input).then(matchedIds => {
      dispatch({
        type: types.RECEIVED_SEARCH_RESULTS,
        result: result.concat(matchedIds)
      })
    });

  } else {
    window.requestAnimationFrame(time => {
      result = list.filter(filterEvent(input)).map(e => e.id);
    });
  }

  dispatch({
    type: types.RECEIVED_SEARCH_RESULTS,
    result
  })
}
