import React from 'react';
import PropTypes from 'prop-types';

class EventSourceHOC extends React.Component {

  state = {
    events: []
  }

  appendMessage = () => {
    
  }

  componentDidMount() {
    this.source = new EventSource(this.props.url);
    const cb = message => {
      this.setState(prevState => {
        let newEvents = prevState.events.concat(message.data)
        return {
          events: newEvents
        }
      });
    };
    this.props.types.forEach(type => {
      this.source.onmessage(cb, false);
    });
    if (this.props.onEventSourceError) {
      this.source.onerror = this.props.onEventSourceError;
    }
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
