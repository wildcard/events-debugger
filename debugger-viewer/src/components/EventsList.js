import React from 'react'
import PropTypes from 'prop-types'

const EventsList = ({ title, children }) => (
  <div>
    <h3>{title}</h3>
    <div>{children}</div>
  </div>
)

EventsList.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired
}

export default EventsList
