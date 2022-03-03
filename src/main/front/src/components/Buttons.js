import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

const setButtonSize = size => {
	switch (size) {
		case "lg":
			return css`
				padding: 8px 16px;
				font-size: 20px;
			`;
		case "sm":
			return css`
				padding: 4px 8px;
				font-size: 14px;
			`;
		default:
			return css`
                padding: 6px 12px;
				font-size: 16px;
			`;
	}
};

const setSimpleButtonColor = color => {
	switch (color) {
		case "blue":
			return css`
				border-color: #0d6efd;
				background-color: #0d6efd;
				color: white;
			`;
		case "red":
			return css`
				border-color: #dc3545;
				background-color: #dc3545;
				color: white;
			`;
		case "grey":
			return css`
                border-color: grey;
                background-color: grey;
                color: white;
			`;
		default:
			return css`
				border-color: ${({ theme }) => theme.colors.darkBlue};
				background-color: ${({ theme }) => theme.colors.darkBlue};
				color: white;
			`;
	}
};
const setOutlineButtonColor = color => {
	switch (color) {
		case "blue":
			return css`
				border-color: #0d6efd;
				color: #0d6efd;
			`;
		case "red":
			return css`
				border-color: #dc3545;
				color: #dc3545;
			`;
		default:
			return css`
                border-color: ${({ theme }) => theme.colors.darkBlue};
                color: ${({ theme }) => theme.colors.darkBlue};
			`;
	}
};

const Button = styled.button`
	border: none;
    line-height: 1.5;
    vertical-align: middle;
	
	${({ size }) => setButtonSize(size)};
	${({ disabled }) => {
		if (disabled) {
			return css`
				opacity: 0.5;
			`;
		}
	}}
`;

export const SimpleButton = styled(Button)`
    ${({ color }) => setSimpleButtonColor(color)};
`;
export const EmptyButton = styled(Button)`
    border: none;
    background-color: transparent;
    outline: 0;
`;
export const OutlineButton = styled(Button)`
	border: 1px solid;
	background-color: white;
 
	${({ color }) => setOutlineButtonColor(color)};
`;

const _Link = styled(Link)`
	color: black;
`;

export const EmptyLink = styled(_Link)`

`;
export const SimpleLink = styled(_Link)`

`;