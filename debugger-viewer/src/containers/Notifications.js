import React, { Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toaster } from 'evergreen-ui';
import {
  ERROR
} from '../constants/status'

const statusToNotficationTypeMap = {
  [ERROR]: toaster.danger
}

class Notifications extends PureComponent {
  static displayName = 'Notifications'
  static propTypes = {
    notificationMessage: PropTypes.string,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notificationMessage &&
      this.props.notificationMessage !== nextProps.notificationMessage) {
      const toasterType = statusToNotficationTypeMap[nextProps.status.type] || toaster.notify;

      toasterType(nextProps.notificationMessage);
    }
  }

  render() {
    return (' ');
  }

}

const mapStateToProps = state => ({
  notificationMessage: state.events.notificationMessage,
  status: state.events.status,
});

export default connect(
  mapStateToProps,
)(Notifications);
