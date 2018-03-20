import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Pane,
  Heading,
  ArrowIcon,
  Link
} from 'evergreen-ui';

export default class NoEvents extends PureComponent {
  static displayName = 'NoEvents'

  render() {
    return (
      <Pane
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        {...this.props}
      >
        <div>
          <Heading is="h2">No Recent Events Seen</Heading>
          <p>Make sure your source is configured correctly.</p>
          <p>
            <Link
              to="#"
              display="inline-flex"
              alignItems="center"
            >
              View configurations{' '}
              <ArrowIcon aim="right" marginLeft={12} />
            </Link>
          </p>
        </div>
      </Pane>
    )
  }
}
