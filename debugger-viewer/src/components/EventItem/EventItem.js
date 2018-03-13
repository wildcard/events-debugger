import React from 'react';
import PropTypes from 'prop-types';
import { Pane } from 'evergreen-ui';
import CheckCircle from '../CheckCircle'
import styled, { keyframes } from 'styled-components';
import {
  EventItemStatusColumn,
  EventItemTypeColumn,
  EventItemNameColumn,
  EventItemTimeColumn
} from './EventItemColumns';
import {
  EventType,
  EventName,
  EventTime
} from './EventItemValues';

const grow = keyframes`
  0% {
    height: 0;
    opacity: 0;
  }
  100% {
    height: 56px;
    opacity: 1;
  }
`;

const EventItem = ({ className, type, receivedAt, ...other }) => {
  return (
    <Pane
      is="button"
      {...{
        alignItems: 'center',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: 'extraMuted',
        display: 'flex',
        height: 56,
        justifyContent: 'flex-start',
        width: '100%',
        paddingLeft: 16,
        paddingRight: 16,
      }}
      className={className}
    >
      <EventItemStatusColumn>
        <CheckCircle title="Allowed event"/>
      </EventItemStatusColumn>

      <EventItemTypeColumn>
        <EventType>{type}</EventType>
      </EventItemTypeColumn>

      <EventItemNameColumn>
        <EventName type={type} event={other} />
      </EventItemNameColumn>

      <EventItemTimeColumn>
        <EventTime time={receivedAt}/>
      </EventItemTimeColumn>
    </Pane>
  );
};

EventItem.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    receivedAt: PropTypes.string.isRequired,
};

export default styled(EventItem)`
  animation: ${grow} .4s cubic-bezier(.4,0,.2,1);
`;
