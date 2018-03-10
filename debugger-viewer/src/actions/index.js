import * as types from '../constants/ActionTypes'

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

const receiveEvent = eventMessage => ({
  type: types.RECEIVE_EVENT,
  event: parseEventMessage(eventMessage)
})

const errorReceivingEvent = () => ({
  type: types.ERROR_RECEIVING_EVENT
})

export const listenForEvents = (events) => dispatch => {
  events.listen(eventMessage => {
    dispatch(receiveEvent(eventMessage))
  }, () => {
    dispatch(errorReceivingEvent())
  })
}
