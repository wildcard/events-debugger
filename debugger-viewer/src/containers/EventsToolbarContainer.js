import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { pauseEvents, resumeEvents, search } from '../actions'
import { isOperational } from '../reducers/events'
import EventsToolBar from '../components/EventsToolBar'

class EventsToolbarContainer extends Component {
  handleStatusChange = (value) => {
    if (value === 'LIVE') {
      this.props.resumeEvents();
    } else if (value === 'PAUSE') {
      this.props.pauseEvents();
    }
  }

  render() {
    return (<EventsToolBar
      onStatusChange={this.handleStatusChange}
      statusValue={this.props.status}
      onSearch={this.props.search}
      searchValue={this.props.searchInput}
      />);
  }
}

const mapStateToProps = state => ({
  status: isOperational(state.events) ? 'LIVE' : state.events.isPaused ? 'PAUSE' : null,
  isPaused: state.events.isPaused,
  searchInput: state.events.searchInput
})

export default connect(
  mapStateToProps,
  { pauseEvents, resumeEvents, search }
)(EventsToolbarContainer);
