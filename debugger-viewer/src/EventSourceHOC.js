import React from 'react';
import PropTypes from 'prop-types';

class EventSourceHOC extends React.Component {
  state = {
    events: []
  }

  appendMessage = (message) => {
    this.setState(({ events }) => {
      return {
        events: events.concat(message.data)
      }
    });
  }

  handleEventSourceError = () => {
    throw new Error('Event source error');

    if (this.props.onEventSourceError) {
      this.props.onEventSourceError();
    }
  }

  componentDidMount() {
    this.source = new EventSource(props.url);

    this.source.onmessage(this.appendMessage, false);
    this.source.onerror = this.handleEventSourceError;
  }
  componentWillUnmount() {
    this.source.close();
  }
  render() {
    return <div>{ this.props.children(this.state.events) }</div>
  }
}

EventSourceHOC.propTypes = {
  url: PropTypes.string.isRequired,
  onEventSourceError: PropTypes.func,
  children: PropTypes.func.isRequired
};

export default EventSourceHOC;
