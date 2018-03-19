import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

export const EventType = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0;
  min-width: 56px;
  text-transform: uppercase;
`;

const EventNameText = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 170px;
  text-align: left;
  font-weight: 500;
`

const PageEvent = ({ event }) => (event ?
  <EventNameText title={event.properties.title}>
  {event.properties.title}
</EventNameText> : null);

const IdentifyEvent = ({ event }) => (event ?
  <EventNameText title={`${event.userId} (${event.traits.email})`}>
    {event.userId} ({event.traits.email})
  </EventNameText> : null
);
const TrackEvent = ({ event }) => (event ?
  <EventNameText title={event.event}>
    {event.event}
  </EventNameText>
 : null);

const typesMap = {
  page: PageEvent,
  track: TrackEvent,
  identify: IdentifyEvent,
};

export const EventName = ({ type, event }) => {
  const Component = typesMap[type];

  return Component ? <Component event={event}/> : null;
};

export const EventTime = ({ time }) => (<time title={time}>
  {time ? moment(time).format('Y/MM/DD HH:mm:ss') : null}
  </time>);
