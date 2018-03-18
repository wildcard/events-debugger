import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { prependPendingEvents } from '../actions'
import { getVisibleEvents } from '../reducers/events'
import EventItem from '../components/EventItem'
import EventsList from '../components/EventsList'
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';
import { Overlay, Spinner } from 'evergreen-ui';
import { TOOLBAR_HEIGHT } from '../variables';
import { backgroundColor } from '../pallete'

const STATUS_LOADING = 1;
const STATUS_LOADED = 2;
const STATUS_RENDERED = 3;

class EventsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.timeoutIdMap = {};
  }

  state = {
    loadedRowCount: 0,
    loadedRowsMap: {},
    renderedRowsMap: {},
    loadingRowCount: 0,
  }

  componentWillUnmount() {
    Object.keys(this.timeoutIdMap).forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
  }

  isRowLoaded = ({ index }) => {
    const {loadedRowsMap} = this.state;
   return Boolean(loadedRowsMap[index]); // STATUS_LOADING or STATUS_LOADED
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    const {loadedRowsMap, loadingRowCount} = this.state;
    const increment = stopIndex - startIndex + 1;

    for (let i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADING;
    }

    this.setState({
      loadingRowCount: loadingRowCount + increment,
    });

    const timeoutId = setTimeout(() => {
      const {loadedRowCount, loadingRowCount} = this.state;

      delete this.timeoutIdMap[timeoutId];

      for (let i = startIndex; i <= stopIndex; i++) {
        loadedRowsMap[i] = STATUS_LOADED;
      }

      this.setState({
        loadingRowCount: loadingRowCount - increment,
        loadedRowCount: loadedRowCount + increment,
      });

      promiseResolver();
    }, 1000 + Math.round(Math.random() * 2000));

    this.timeoutIdMap[timeoutId] = true;

    let promiseResolver;

    return new Promise(resolve => {
      promiseResolver = resolve;
    });
  }

  rowRenderer = ({ key, index, style, isScrolling, isVisible}) => {
    const event = this.props.events.get(index);
    const { id } = event;
    const {loadedRowsMap, renderedRowsMap} = this.state;
    const isAlreayRendered = renderedRowsMap[id];
    return (
      isScrolling ? <div key={key} style={style}>... is Scrolling</div> :
      loadedRowsMap[index] === STATUS_LOADED ?
        <EventItem key={key}
          animate={!isScrolling && index < 5}
          event={event} style={style}/> :
        <div key={key} style={style}>Not loaded</div>
    )
  }

  clearData = () => {
    this.setState({
      loadedRowCount: 0,
      loadedRowsMap: {},
      loadingRowCount: 0,
    });
  }

  handleRowRendered = onRowsRendered => (args) => {
    const { overscanStartIndex, overscanStopIndex, startIndex, stopIndex } = args;
    const {renderedRowsMap} = this.state;
    // console.log(overscanStartIndex, overscanStopIndex, startIndex, stopIndex);
    const events = this.props.events.slice(startIndex, stopIndex);

    events.forEach(event => {
      const { id } = event;
      const renderCount = renderedRowsMap[id];
      renderedRowsMap[id] = renderCount ? renderCount + 1 : 1;
    });

    onRowsRendered(args);
  }

  renderMeta () {
    const {loadedRowCount, loadingRowCount} = this.state;
    const rowCount = this.props.events.size;
    // console.log(this.props.filteredEvents);
    return (<div>
        <div>{loadingRowCount} loading, {loadedRowCount} loaded of {rowCount}</div>
          {this.props.status}
          </div>);
  }

  render() {
    const rowCount = this.props.events.size;

    return (<div>
      {this.renderMeta()}

      {this.props.isLoading ? <Overlay isShown
        containerProps={{
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
        }}>
        <Spinner />
      </Overlay> : null }

      {this.props.pendingCount ? <div>
        Pending events {this.props.pendingCount}
        <button onClick={this.props.prependPendingEvents}>Click to add</button>
    </div> : null}

      <InfiniteLoader
    isRowLoaded={this.isRowLoaded}
    loadMoreRows={this.loadMoreRows}
    rowCount={rowCount}
  >
    {({ onRowsRendered, registerChild }) => (
        <AutoSizer disableHeight>
              {({width}) => (
        <List
          height={window.innerHeight - TOOLBAR_HEIGHT}
          onRowsRendered={this.handleRowRendered(onRowsRendered)}
          ref={registerChild}
          rowCount={rowCount}
          rowHeight={56}
          rowRenderer={this.rowRenderer}
          width={width}
          style={{ backgroundColor }}
        />)}
      </AutoSizer>
    )}
      </InfiniteLoader>
    </div>);
  }
}

EventsContainer.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
  })).isRequired,
  isPaused: PropTypes.bool.isRequired
}

// const get

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

const mapStateToProps = state => ({
  pendingCount: state.events.pending.size,
  events: getFilteredEvents(state),
  status: state.events.status,
  isPaused: state.events.isPaused,
  isLoading: state.events.isLoading,
})

export default connect(
  mapStateToProps,
  { prependPendingEvents }
)(EventsContainer)
