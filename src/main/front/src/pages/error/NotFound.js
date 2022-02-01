import React from "react";
import styled from "styled-components";
import { EmotionUnhappy } from "@styled-icons/remix-line";


function NotFound() {
	return (
		<Wrapper>
			<EmotionUnhappy size="150" />
			<Status>404 Not Found</Status>
			<Content>페이지가 존재하지 않습니다</Content>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
  	height: 100vh;
`;
const Status = styled.h1`
	margin-bottom: 10px;
	font-size: 32px;
	font-weight: bold;
`;
const Content = styled.h2`

`;

export default NotFound;