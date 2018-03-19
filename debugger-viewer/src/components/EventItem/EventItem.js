import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Pane } from 'evergreen-ui';
import CheckCircle from '../CheckCircle';
import styled from 'styled-components';
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
import './EventItem.css';

class EventItem extends PureComponent {
  constructor(props) {
    super(props);

    this.alreadyAnimated = false;

    this.state = {
      animate: () => {
          if (this.alreadyAnimated) {
              return false;
          } else {
            this.alreadyAnimated = true;
            return true;
          }
      },
    }
  }

  render() {
    const {
      className,
      style,
      event,
      stencil,
      order,
    } = this.props;

    const {
      type,
      receivedAt,
    } = event || {};

    const shouldAnimate = this.props.animate && this.state.animate();

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
        style={{
          ...style,
          animationName: 'grow',
          animationTimingFunction: 'cubic-bezier(.4,0,.2,1)',
          animationDuration: shouldAnimate ? '.4s' : 'unset',
        }}
      >
        {stencil ? <EventItemStencil order={order}/> : <Fragment>
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
    animate: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
};

export default styled(EventItem)`
:focus, :hover {
  outline: none;
  background: #f7f8fa;
`;
