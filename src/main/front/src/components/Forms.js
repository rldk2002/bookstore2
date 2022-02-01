import styled, { css } from "styled-components";

const setInputBoxSize = size => {
	switch (size) {
		case "lg":
			return css`
				padding: 8px 16px;
				font-size: 20px;

                &::placeholder {
                    font-size: 16px;
                }
			`;
		case "sm":
			return css`
				padding: 4px 8px;
				font-size: 14px;

                &::placeholder {
                    font-size: 10px;
                }
			`;
		default:
			return css`
                padding: 6px 12px;
				font-size: 16px;

                &::placeholder {
                    font-size: 12px;
                }
			`;
	}
};

const FormLabel = styled.label`
	font-weight: bold;
`;
const FormGroup = styled.div`
	display: flex;
	margin-bottom: 10px;
	
	${({ vertical }) => vertical && css`
    	flex-direction: column;
		
		> ${ FormLabel } {
			margin-bottom: 8px;
		}
	`};
	
`;
const InputBox = styled.input`
    width: 100%;
    padding: 6px 12px;
    border: 1px solid #ced4da;
    line-height: 1.5;
    background-color: white;
	outline: none;
	
	&:focus {
		border: 1px solid;
	}

    ${({ size }) => setInputBoxSize(size)};
    ${({ isInvalid }) => isInvalid && css`
    	border-color: red;
	`};
    ${({ isValid }) => isValid && css`
    	border-color: #198754;
	`};
`;

export const Form = styled.form`
	width: 100%;
	padding: 20px;
`;
Form.Group = FormGroup;
Form.Label = FormLabel;
Form.Input = InputBox;

export const ValidationMessage = styled.div`
    margin: 8px 0;
    font-size: 14px;
    color: red;
`;
