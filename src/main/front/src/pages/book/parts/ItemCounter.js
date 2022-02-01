import React, { useEffect, useState } from 'react';
import styled, { css } from "styled-components";

function noActiveFunc() {

}

const ItemCounter = ({
	 onCountChange: handleCountChange = noActiveFunc,
	 initCount = 1,
	 size
}) => {
	const [count, setCount] = useState(initCount);
	
	useEffect(() => {
		setCount(initCount);
	}, [initCount]);
	
	const handleIncreaseCount = () => {
		setCount(count + 1);
		handleCountChange(count + 1);
	};
	const handleDecreaseCount = () => {
		if (count > 1) {
			setCount(count - 1);
			handleCountChange(count - 1);
		}
	};
	const handleChange = event => {
		const value = event.target.value.replace(/[^0-9]/, "").replace(/(^0+)/, "");
		setCount(value);
		handleCountChange(value);
	};
	
	return (
		<Counter size={ size }>
			<button onClick={ handleDecreaseCount }>-</button>
			<input type="text" value={ count } onChange={ handleChange } />
			<button onClick={ handleIncreaseCount }>+</button>
		</Counter>
	);
};

export default ItemCounter;

const setSize = size => {
	switch (size) {
		case "sm":
			return css`
                height: 24px;
                > button {
                    width: 24px;
                    height: 100%;
                    font-size: 16px;
                }
				> input {
					width: 30px;
				}
			`;
		default:
			return css`
                height: 34px;
                > button {
					width: 34px;
                    height: 100%;
                    font-size: 24px;
				}
				> input {
					width: 50px;
				}
			`;
	}
}

const Counter = styled.div`
	display: flex;
	
	> button {
		border: 1px solid grey;
		background-color: white;
	}
	> input {
		width: 50px;
        border: 1px solid gray;
        border-left: 0;
		border-right: 0;
		text-align: center;
	}

    ${({ size }) => setSize(size) };
`;