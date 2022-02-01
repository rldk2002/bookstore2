import React, { useState } from "react";
import styled from "styled-components";
import MainHeader from "../header/MainHeader";

const MainLayout = ({ type = "nav", children }) => {
	const [isOpened, setOpened] = useState(false);
	const handleSearchArea = (open) => setOpened(open);
	
	return (
		<Wrapper>
			<MainHeader handleSearchArea={ handleSearchArea } />
			{
				!isOpened &&
				<>
					{children}
				</>
			}
		</Wrapper>
	);
}

export default MainLayout;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
    align-items: center;
	width: 100%;
	min-width: 320px;
	min-height: 100vh;
`;