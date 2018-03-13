import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { pauseEvents, resumeEvents } from '../actions'
import { getVisibleEvents } from '../reducers/events'
import EventItem from '../components/EventItem'
import EventsList from '../components/EventsList'
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';
import { Button } from 'evergreen-ui'
import { TOOLBAR_HEIGHT } from '../variables';

const STATUS_LOADING = 1;
const STATUS_LOADED = 2;

class EventsContainer extends Component {
  constructor(props) {
    super(props);

    this.timeoutIdMap = {};
  }

  state = {
    loadedRowCount: 0,
    loadedRowsMap: {},
    loadingRowCount: 0,
  }

  componentWillUnmount() {
    Object.keys(this.timeoutIdMap).forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
  }

  isRowLoaded = ({ index }) => {
    const {loadedRowsMap} = this.state;
   return !!loadedRowsMap[index]; // STATUS_LOADING or STATUS_LOADED
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    const {loadedRowsMap, loadingRowCount} = this.state;
    const increment = stopIndex - startIndex + 1;

    for (var i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADING;
    }

    this.setState({
      loadingRowCount: loadingRowCount + increment,
    });

    const timeoutId = setTimeout(() => {
      const {loadedRowCount, loadingRowCount} = this.state;

      delete this.timeoutIdMap[timeoutId];

      for (var i = startIndex; i <= stopIndex; i++) {
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

  rowRenderer = ({ key, index, style}) => {
    const event = this.props.events.get(index);
    const {loadedRowsMap} = this.state;

    return (
      loadedRowsMap[index] === STATUS_LOADED ?
        <EventItem key={key} {...event} style={style}/> :
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

  handlePauseEvents = () => {

  }

  renderMeta () {
    const {loadedRowCount, loadingRowCount} = this.state;

    return (<div><div>
            {loadingRowCount} loading, {loadedRowCount} loaded
          </div>
          <div>{this.props.status} <Button onClick={this.props.pauseEvents}>PAUSE</Button>
        </div></div>);
  }

  render() {
    const rowCount = this.props.events.size;

    return (<div>
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
          onRowsRendered={onRowsRendered}
          ref={registerChild}
          rowCount={rowCount}
          rowHeight={56}
          rowRenderer={this.rowRenderer}
          width={width}
        />)}
          </AutoSizer>
      )}
    </InfiniteLoader>
    </div>);
  }
}

// const EventsContainer = ({ events }) => (
//
//   <EventsList title="Events">
//     {events.map(event =>
//       <EventItem
//         key={event.id}
//         event={event} />
//     )}
//   </EventsList>
// )

EventsContainer.propTypes = {
  // events: PropTypes.arrayOf(PropTypes.shape({
  //   id: PropTypes.string.isRequired,
  //   data: PropTypes.object.isRequired,
  // })).isRequired,
  isPaused: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  // events: getVisibleEvents(state.events)
  events: state.events.list,
  status: state.events.status,
  isPaused: state.events.isPaused,
})

export default connect(
  mapStateToProps,
  { pauseEvents, resumeEvents }
)(EventsContainer)
