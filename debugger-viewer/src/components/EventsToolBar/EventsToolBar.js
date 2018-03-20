import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import {
  Pane,
  SegmentedControl,
  SearchInput,
  Spinner,
  Tooltip,
  Text,
 } from 'evergreen-ui';
 import Box from 'ui-box';
 import Transition from 'react-transition-group/Transition';

import { TOOLBAR_HEIGHT } from '../../variables';
import { borderColor } from '../../pallete';

class EventsToolBar extends PureComponent {
  constructor(props) {
    super(props);

    this.search = debounce(props.onSearch, 250);
  }

  handleSearchInputChange = e => {
    this.search(e.target.value);
  }

  render() {
    const {
      onStatusChange,
      statusValue,
      onSearch,
      searchValue,
      isIndexing,
    } = this.props;

    return (<Pane height={TOOLBAR_HEIGHT}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      borderBottom={`1px solid ${borderColor}`}
      paddingLeft={16}
      paddingRight={16}
      >
      <SegmentedControl name="eventsStreamStatus" options={[
          {
            label: 'Live',
            value: 'LIVE',
          },
          {
            label: 'Pause',
            value: 'PAUSE'
          }
        ]} minWidth={160} height={40}
        value={statusValue}
        onChange={onStatusChange}/>

      <Box width="100%" display="flex" alignItems="center" position="relative">
        <SearchInput height={40}
          marginLeft={16}
          placeholder="Type to search..."
          onChange={this.handleSearchInputChange}
          width="100%" />
        {isIndexing ? <Box zIndex="2" position="absolute" right="10px">
            <Transition in={isIndexing} timeout={500}>
              {(state) => (
                <Tooltip content="Indexing...">
                  <Spinner size={24} style={{
                    transition: `opacity 500ms ease-in-out`,
                    opacity: state === 'entered' ? 1 : 0,
                  }} />
                </Tooltip>
              )}
            </Transition>
        </Box>
           : null}
      </Box>

    </Pane>);
  }
}

export default EventsToolBar;
