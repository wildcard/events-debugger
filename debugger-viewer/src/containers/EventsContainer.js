import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { prependPendingEvents } from '../actions'
import { getVisibleEvents } from '../reducers/events'
import Immutable from 'immutable'
import moment from 'moment';
import EventItem from '../components/EventItem'
import EventsList from '../components/EventsList'
import NoEvents from '../components/NoEvents';
import { InfiniteLoader, List, AutoSizer, defaultCellRangeRenderer } from 'react-virtualized';
import { Overlay, Spinner, InlineAlert, Button, Pane, colors } from 'evergreen-ui';
import { TOOLBAR_HEIGHT, EVENT_ITEM_HEIGHT } from '../variables';
import { START, ERROR } from '../constants/status';
import { backgroundColor } from '../pallete'

const PendingEventsPane = ({ pendingCount, prependPendingEvents }) => (
  <Pane display="flex"
    borderBottom="extraMuted"
    minHeight={40}
    alignItems="center"
    justifyContent="center"
    backgroundColor={colors.blue['10A']}>
    {<InlineAlert type="question">
      {pendingCount} Pending events
      <Button marginLeft={5} onClick={prependPendingEvents}>See pending events</Button>
    </InlineAlert>}
  </Pane>
);

class EventsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.renderedEvents = new Set();
    this.lastScrollTop = null;
    this.lastListSize = null;
  }

  rowRenderer = ({ key, index, style, isScrolling, isVisible }) => {
    const event = this.props.events.get(index);
    const { id } = event || {};

    if (isScrolling || !event || !id) {
      return <EventItem key={key} order={index} style={style} stencil />;
    }

    const shouldAnimateOnEnter = isVisible && !isScrolling && !this.renderedEvents.has(id) && index < 10;
    this.renderedEvents.add(id);

    return (
      <EventItem key={shouldAnimateOnEnter ? `${id}/${key}` : key}
        order={index}
        style={style}
        event={event}
        animate={shouldAnimateOnEnter} />
    )
  }

  cellRangeRenderer = (props) => {
    const {
      isScrolling,
      rowStartIndex,
      scrollTop,
    } = props;

    this.lastScrollTop = scrollTop;
    this.lastEventsCount = this.props.events.size;

    return defaultCellRangeRenderer(props);
  }

  visibleScrollTop = () => {
    if (this.lastEventsCount && this.props.events &&
        this.lastEventsCount !== this.props.events.size && this.lastScrollTop > 0) {
          const newEventsCount = this.props.events.size - this.lastEventsCount;

          return this.lastScrollTop + newEventsCount * EVENT_ITEM_HEIGHT;
        }
  }

  emptyState = () => {
    return Array(10).fill().map((_, i) => (
      <EventItem key={i}
        order={i}
        stencil
        style={{ height: `${EVENT_ITEM_HEIGHT}px` }}/>)
      );
  }

  render() {
    const {
      events,
      eventsCount,
      status,
      isPaused,
      pendingCount,
      prependPendingEvents,
     } = this.props;
    const rowCount = eventsCount;

    if ((status.type === START  || status.type === ERROR) && rowCount === 0) {
      return <NoEvents minHeight={window.innerHeight - TOOLBAR_HEIGHT}/>;
    }

    return (<div>
        {isPaused && pendingCount ?
          <PendingEventsPane {...{ pendingCount, prependPendingEvents }}/>
          : null}

        <AutoSizer disableHeight>
              {({width}) => (
          <List
            height={window.innerHeight - TOOLBAR_HEIGHT}
            rowCount={rowCount}
            rowHeight={EVENT_ITEM_HEIGHT}
            rowRenderer={this.rowRenderer}
            width={width}
            noRowsRenderer={this.emptyState}
            cellRangeRenderer={this.cellRangeRenderer}
            scrollTop={this.visibleScrollTop()}
            style={{ backgroundColor }}
          />
      )}
      </AutoSizer>
    </div>);
  }
}

EventsContainer.propTypes = {
  events: PropTypes.instanceOf(Immutable.List).isRequired,
  eventsCount: PropTypes.number.isRequired,
  isPaused: PropTypes.bool.isRequired,
  pendingCount: PropTypes.number,
  prependPendingEvents: PropTypes.func,
}

const getEventsList = (state) => state.events.list;
const getVisibleEventIds = (state) => state.events.visibleEventIds;
const getEventsMap = (state) => state.events.map;
const getSearchInput = (state) => state.events.searchInput;

const getFilteredEvents = createSelector(
  [
    getEventsList,
    getVisibleEventIds,
    getEventsMap,
    getSearchInput,
  ],
  (list, visibleEventIds, map, searchInput) => (
    !searchInput ?
      list :
      getVisibleEvents(visibleEventIds, map)
    )
  );

const getCount = createSelector([
  getEventsList,
  getVisibleEventIds,
  getSearchInput
],
(list, visibleEventIds, searchInput) => (
  !searchInput ?
    list.count() :
    visibleEventIds.length
  )
);

const mapStateToProps = state => ({
  pendingCount: state.events.pending.size,
  events: getFilteredEvents(state),
  eventsCount: getCount(state),
  status: state.events.status,
  isPaused: state.events.isPaused,
})

export default connect(
  mapStateToProps,
  { prependPendingEvents }
)(EventsContainer)
