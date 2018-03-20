import React from 'react';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';
import { StencilForegoround, StencilBackgoround } from '../../pallete';
import { EVENT_ITEM_HEIGHT } from '../../variables';

const EventItemStencil = (props) => (
	<ContentLoader
		height={EVENT_ITEM_HEIGHT}
		width={540}
		speed={3}
		primaryColor={StencilBackgoround}
		secondaryColor={StencilForegoround}
    {...props}
	>
		<rect x={69} y="20" rx="8" ry="8" width="56" height="16" />
		<rect x={149} y="20" rx="8" ry="8" width="200" height="16" />
		<rect x={383} y="20" rx="8" ry="8" width="144" height="16" />
		<circle cx={27} cy="28" r="10" />
	</ContentLoader>
)

const opacityType = Array(10).fill().map((_, i) => (
  1 - (0.1 * i)
));

export default styled(EventItemStencil).attrs({
  order: props => props.order || 0
})`
	height: ${EVENT_ITEM_HEIGHT}px;
	width: 540px;
	opacity: ${props => opacityType[props.order]};
`;
