import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { device } from "../../../style/device";

const TitleHeader = ({ children }) => {
	return (
		<Wrapper>
			<Header>
				<Logo>
					<Link to="/">BookStore</Link>
				</Logo>
				<Title>{ children }</Title>
			</Header>
			<Border />
		</Wrapper>
	);
}

export default TitleHeader;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;
const Border = styled.div`
	width: 100%;
	height: 3px;
    background: linear-gradient(to right, #43cea2, #185a9d);
`;
const Header = styled.div`
	width: 100%;
	position: relative;
	padding: 0.5rem;
    @media ${ device.desktop } {
        max-width: 1024px;
    }
`;
const Logo = styled.div`
    padding: .3125rem 0;
    font-size: 1.25rem;
    white-space: nowrap;
	background-color: #fff;
`;
const Title = styled.div`
	position: absolute;
	top: 0.5rem;
	left: 0;
	width: 100%;
    padding: .3125rem 0;
	text-align: center;
    font-size: 1.25rem;
`;