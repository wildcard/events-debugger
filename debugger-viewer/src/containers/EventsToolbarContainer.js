import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import EventsToolBar from '../components/EventsToolBar'

class EventsToolbarContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<EventsToolBar />);
  }
}

export default EventsToolbarContainer;
