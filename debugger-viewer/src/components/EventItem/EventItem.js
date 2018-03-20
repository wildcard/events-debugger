import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Pane } from 'evergreen-ui';
import CheckCircle from '../CheckCircle';
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
import EventItemStencil from './EventItemStencil';
import { backgroundColor } from '../../pallete';
import { EVENT_ITEM_HEIGHT } from '../../variables';

const grow = keyframes`
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: ${EVENT_ITEM_HEIGHT}px;
    opacity: 1;
  }
`

class EventItem extends PureComponent {
  render() {
    const {
      className,
      style,
      event,
      stencil,
      order,
      animate
    } = this.props;

    const {
      type,
      receivedAt,
    } = event || {};

    return (
        <Pane
          is="button"
          alignItems="center"
          borderTop="none"
          borderLeft="none"
          borderRight="none"
          borderBottom="extraMuted"
          display="flex"
          height={6}
          justifyContent="flex-start"
          width="100%"
          paddingLeft={6}
          paddingRight={6}
          className={className + ` ${animate ? 'event--entered' : ''}`}
          style={style}
        >
          {stencil ? <EventItemStencil order={order}/> :
          <Fragment>
            <EventItemStatusColumn>
              <CheckCircle title="Allowed event" />
            </EventItemStatusColumn>

            <EventItemTypeColumn>
              <EventType>{type}</EventType>
            </EventItemTypeColumn>

            <EventItemNameColumn>
              <EventName type={type} event={event} />
            </EventItemNameColumn>

            <EventItemTimeColumn>
              <EventTime time={receivedAt}/>
            </EventItemTimeColumn>
          </Fragment> }
        </Pane>
      );
  }
}

EventItem.propTypes = {
    event: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      receivedAt: PropTypes.string.isRequired,
    }),
    stencil: PropTypes.bool,
    order: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
};

const animationType = Array(10).fill().map((_, i) => (
  `${grow} ${600 + i * 50}ms cubic-bezier(.4,0,.2,1) ${300 + ((10 - i) * 30)}ms`
));

export default styled(EventItem).attrs({
  order: props => props.order || 0
})`
  &.event--entered {
    animation: ${props => animationType[props.order]};
  }

  :focus, :hover, &.event--selected {
    outline: none;
    background: ${backgroundColor};
  }
`;
