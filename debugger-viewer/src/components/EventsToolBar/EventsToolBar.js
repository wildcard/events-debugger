import React from 'react';
import PropTypes from 'prop-types';
import { Pane, SegmentedControl, SearchInput } from 'evergreen-ui';
import { TOOLBAR_HEIGHT } from '../../variables';
import { colorBorder } from '../../pallete';

const EventsToolBar = () => (<Pane height={TOOLBAR_HEIGHT}
    display="flex"
    alignItems="center"
    justifyContent="flex-start"
    borderBottom="1px solid #d5dee6"
    borderBottomColor={colorBorder}
    paddingLeft={16}
    paddingRight={16}
    >
    <SegmentedControl options={[
        {
          label: 'Live',
          value: 'LIVE',
        },
        {
          label: 'Pause',
          value: 'PAUSE'
        }
      ]} minWidth={160} height={40}/>
    <SearchInput height={40}
      marginLeft={16}
      placeholder="Type to search..."
      width="100%"/>
  </Pane>)

export default EventsToolBar;
