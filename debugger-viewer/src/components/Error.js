import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toaster } from 'evergreen-ui';

export default class EventsError extends PureComponent {
  static displayName = 'EventsError'

  render() {
    if (this.props.status.type === 'ERROR') {

    }

    return ();
  }

}

const mapStateToProps = state => ({
  status: state.events.status,
  isPaused: state.events.s,
  searchInput: state.events.searchInput,
  isIndexing: state.events.isIndexing,
})

export default connect(
  mapStateToProps,
  { pauseEvents, resumeEvents, search }
)(EventsToolbarContainer);
