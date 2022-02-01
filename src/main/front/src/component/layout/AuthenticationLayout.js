import React from "react";
import styled from "styled-components";
import TitleHeader from "./header/TitleHeader";

const AuthenticationLayout = ({ children, title }) => {
	return (
		<Wrapper>
			<TitleHeader>{ title }</TitleHeader>
			{ children }
		</Wrapper>
	)
}

export default AuthenticationLayout;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
    align-items: center;
	width: 100%;
	min-height: 100vh;
`;