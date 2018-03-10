import React from 'react'
import PropTypes from 'prop-types'
import { Pane } from 'evergreen-ui'

const PageEvent = ({ event }) => (<div>
  {event.properties.title}
  </div>);
const IdentifyEvent = ({ event }) => (<div>
  {event.userId} ({event.traits.email})
  </div>);
const TrackEvent = ({ event }) => (<div>
  {event.event}
  </div>);

const typesMap = {
  page: PageEvent,
  track: TrackEvent,
  identify: IdentifyEvent
};

const EventItem = ({ event }) => {
  const { type } = event;
  const EventName = typesMap[type];

  return (<Pane is="button" {...{ alignItems: "center", borderBottom: "extraMuted",
display
:
"flex",
float
:
"left",
height
:
104,
justifyContent
:
"center",
margin
:
32,
width
:
160,
   }}>
    <div>V</div>
    <span>{event.type}</span>
    <span><EventName event={event} /></span>
  </Pane>);
}

EventItem.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
  }).isRequired,
}

export default EventItem
