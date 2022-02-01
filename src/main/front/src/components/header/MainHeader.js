import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { device } from "../../style/device";
import { Link } from "react-router-dom";
import { ArrowBack, Cart, Menu, Search, Trash, X } from "@styled-icons/boxicons-regular";
import { EmptyButton } from "../Buttons";
import { useHistory } from "react-router";
import { parseQueryVariable } from "../../utils/stringutils";

const MainHeader = ({ handleSearchArea }) => {
	const history = useHistory();
	const [isOpened, setOpened] = useState(false);
	const [searchKeyword, setSearchKeyword] = useState('');	// 검색어
	const [searchKeywordHistory, setSearchKeywordHistory] = useState([]);	// 검색어 히스토리
	const searchKeywordInput = useRef(null);	// 검색창
	
	useEffect(() => {
		setSearchKeyword(parseQueryVariable(history.location.search, "query"));
		setSearchKeywordHistory(JSON.parse(window.localStorage.getItem("SearchKeywordHistory") || "[]"));
	},[history.location.search]);
	
	const openSearchArea = () => {
		setOpened(true);
		handleSearchArea(true);
	};
	const closeSearchArea = () => {
		setOpened(false);
		handleSearchArea(false);
	};
	const saveHistory = keywords => {
		const keywordsJson = JSON.stringify(keywords);
		window.localStorage.setItem("SearchKeywordHistory", keywordsJson);
	};
	const removeHistory = keyword => {
		const filteredSearchKeywordHistory = searchKeywordHistory.filter(element => element !== keyword);
		saveHistory(filteredSearchKeywordHistory);
		setSearchKeywordHistory([...filteredSearchKeywordHistory]);
	};
	const removeAllHistory = () => {
		window.localStorage.removeItem("SearchKeywordHistory");
		setSearchKeywordHistory([]);
	};
	
	const handleSubmit = (event) => {
		event.preventDefault();
		const keyword = searchKeywordInput.current.value;
		if (keyword !== "") {
			const newHistory = searchKeywordHistory.filter(element => element !== keyword);
			newHistory.push(keyword);
			saveHistory(newHistory);
			setSearchKeywordHistory([...newHistory]);
			closeSearchArea();
			history.push(`/books/search?query=${keyword}`);
		} else {
			alert("검색어를 입력하세요.");
		}
	};
	
	return (
		<Wrapper>
			{
				!isOpened &&
				<Header>
					<Link to="/"><Logo>BookStore</Logo></Link>
					<Nav>
						<EmptyButton onClick={ openSearchArea }><Search size="32"/></EmptyButton>
						<Link to="/books/cart"><Cart size="32"/></Link>
						<Link to="/menu"><Menu size="32"/></Link>
					</Nav>
				</Header>
			}
			{
				isOpened &&
				<>
					<SearchHeader>
						<EmptyButton onClick={ closeSearchArea }><ArrowBack size="24" /></EmptyButton>
						<SearchForm onSubmit={ handleSubmit }>
							<input type="text" onClick={ openSearchArea } ref={ searchKeywordInput } defaultValue={ searchKeyword } placeholder="검색어를 입력하세요."/>
							<EmptyButton type="submit"><Search size="24" /></EmptyButton>
						</SearchForm>
					</SearchHeader>
					<SearchHistoryTitle>최근검색어</SearchHistoryTitle>
					<SearchHistory>
						{
							searchKeywordHistory.slice(0).reverse().map((keyword, index) => {
								return (
									<li key={ index }>
										<span onClick={ () => [ closeSearchArea(), setSearchKeyword(keyword) ] }>
											<Link to={ `/books/search?query=${keyword}` }>{ keyword }</Link>
										</span>
										<button onClick={ () => removeHistory(keyword) }><X size="20"/></button>
									</li>
								);
							})
						}
					</SearchHistory>
					<SearchKeywordHistoryRemoveButton onClick={ removeAllHistory }>모든 검색어 삭제 <Trash size="20"/></SearchKeywordHistoryRemoveButton>
				</>
			}
		</Wrapper>
	);
};

export default MainHeader;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	background-color: #fff;
`;
const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 60px;
	position: relative;
	padding: 10px;
 
	@media ${ device.desktop } {
        max-width: 1024px;
    }
`;
const Logo = styled.div`
    padding: 10px 10px 10px 5px;
    font-size: 1.25rem;
    white-space: nowrap;
	background-color: #fff;
`;
const Nav = styled.div`
	
	> a, button {
		padding: 6px;
	}
`;
const SearchHeader = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 10px;
	border-bottom: 2px solid;
`;
const SearchForm = styled.form`
	display: flex;
	align-items: center;
	width: 100%;
	height: 50px;
		
	> input {
		width: 100%;
		height: 100%;
		border: none;
		font-size: 24px;
		text-indent: 4px;
		outline: none;
	}
`;
const SearchHistoryTitle = styled.div`
	width: 100%;
	padding: 10px 0;
	border-bottom: 1px solid ${({ theme }) => theme.colors.grey};
	font-weight: bold;
	text-align: center;
`;
const SearchHistory = styled.ul`
	width: 100%;
	padding: 10px 20px;
	
	> li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 40px;
		border-bottom: 1px solid ${({ theme }) => theme.colors.grey};
		
		> span {
			display: flex;
			align-items: center;
			width: 100%;
			height: 100%;
			
			> a {
				width: 100%;
			}
		}
		> button {
			border: none;
			background-color: white;
		}
	}
`;
const SearchKeywordHistoryRemoveButton = styled.button`
	display: flex;
	align-items: center;
	height: 28px;
	border: none;
	background-color: white;
`;