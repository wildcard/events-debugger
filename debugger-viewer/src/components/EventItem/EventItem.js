import React, { PureComponent } from 'react';
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
import './EventItem.css'

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
    } = this.props;
    const {
      type,
      receivedAt,
    } = event;

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
      </Pane>
    );
  }
}

// const EventItem = ({ className, style, event }) => {
//   const {
//     type,
//     receivedAt,
//   } = event;
//   return (
//     <Pane
//       is="button"
//       {...{
//         alignItems: 'center',
//         borderTop: 'none',
//         borderLeft: 'none',
//         borderRight: 'none',
//         borderBottom: 'extraMuted',
//         display: 'flex',
//         height: 56,
//         justifyContent: 'flex-start',
//         width: '100%',
//         paddingLeft: 16,
//         paddingRight: 16,
//       }}
//       className={className}
//       style={style}
//     >
//       <EventItemStatusColumn>
//         <CheckCircle title="Allowed event" />
//       </EventItemStatusColumn>
//
//       <EventItemTypeColumn>
//         <EventType>{type}</EventType>
//       </EventItemTypeColumn>
//
//       <EventItemNameColumn>
//         <EventName type={type} event={event} />
//       </EventItemNameColumn>
//
//       <EventItemTimeColumn>
//         <EventTime time={receivedAt}/>
//       </EventItemTimeColumn>
//     </Pane>
//   );
// };

EventItem.propTypes = {
    event: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      receivedAt: PropTypes.string.isRequired,
    }),
    animate: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
};

export default EventItem;
