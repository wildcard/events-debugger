import React from 'react';
import styled from 'styled-components';

const EventItemColumn = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const EventItemStatusColumn = EventItemColumn.extend`
  justify-content: center;
  min-width: 48px;
`;

export const EventItemTypeColumn = EventItemColumn.extend`
  min-width: 80px;
  margin-right: 24px;
`

export const EventItemNameColumn = EventItemColumn.extend`
  flex: 1 0 auto;
  margin-right: 24px;
`

export const EventItemTimeColumn = EventItemColumn.extend`
  min-width: 140px;
`
