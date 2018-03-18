import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { Pane, SegmentedControl, SearchInput } from 'evergreen-ui';
import { TOOLBAR_HEIGHT } from '../../variables';
import { colorBorder } from '../../pallete';

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
    } = this.props;

    return (<Pane height={TOOLBAR_HEIGHT}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      borderBottom={`1px solid ${colorBorder}`}
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

      <SearchInput height={40}
        marginLeft={16}
        placeholder="Type to search..."
        onChange={this.handleSearchInputChange}
        width="100%"/>
    </Pane>);
  }
}

export default EventsToolBar;
