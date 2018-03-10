import React from 'react';
import PropTypes from 'prop-types';
import { Pane } from 'evergreen-ui';

const PageEvent = ({ event }) => <div>{event.properties.title}</div>;
const IdentifyEvent = ({ event }) => (
  <div>
    {event.userId} ({event.traits.email})
  </div>
);
const TrackEvent = ({ event }) => <div>{event.event}</div>;

const typesMap = {
  page: PageEvent,
  track: TrackEvent,
  identify: IdentifyEvent,
};

const EventItem = ({ type, ...other }) => {
  const EventName = typesMap[type];

  return (
    <Pane
      is="button"
      {...{
        alignItems: 'center',
        borderBottom: 'extraMuted',
        display: 'flex',
        float: 'left',
        height: 56,
        justifyContent: 'center',
        margin: 32,
        width: '100%',
        paddingLeft: 32,
        paddingRight: 16,
      }}
    >
      <div>V</div>
      <span>{type}</span>
      <span>
        <EventName event={other} />
      </span>
      <time></time>
    </Pane>
  );
};

EventItem.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default EventItem;
