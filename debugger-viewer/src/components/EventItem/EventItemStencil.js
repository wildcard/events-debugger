import React from 'react';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';
import { StencilForegoround, StencilBackgoround } from '../../pallete';

const EventItemStencil = (props) => (
	<ContentLoader
		height={56}
		width={540}
		speed={4}
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

export default styled(EventItemStencil)`
	height: 56px;
	width: 540px;
	opacity: ${props => (1 - (0.1 * props.order))}
`;
