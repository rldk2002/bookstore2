import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import styled from "styled-components";
import { device } from "../../style/device";
import BookItem from "./parts/BookItem";
import { LoadingSpinner } from "../../components/LoadingIndicator";
import { useTitle } from "../../hook/hooks";
import { useFetchBookListByCategory } from "../../api/queries";
import { TITLE_SUFFIX } from "../../config";

const NavLink = ({ to, children }) => {
	const location = useLocation();
	const isActive = location.pathname === to;
	return <Link to={ to } className={ isActive ? "active" : "" }>{ children }</Link>
}

const BookCategoryResultPage = () => {
	const location = useLocation();
	const { categoryId, corner } = useParams();
	const { isLoading, isSuccess, data: { searchCategoryName, item: books } = {} } = useFetchBookListByCategory(categoryId, corner);
	
	useTitle(searchCategoryName + TITLE_SUFFIX);
	
	return (
		<MainLayout>
			<Wrapper>
				<PageTitle>{ searchCategoryName }</PageTitle>
				<BookListNav defaultActiveKey={ location.pathname }>
					<div className="nav-item">
						<NavLink to={ `/books/bestSeller/category/${ categoryId }` }>베스트셀러</NavLink>
					</div>
					<div className="nav-item">
						<NavLink to={ `/books/recommend/category/${ categoryId }` }>추천도서</NavLink>
					</div>
					<div className="nav-item">
						<NavLink to={ `/books/newBook/category/${ categoryId }` }>신규도서</NavLink>
					</div>
				</BookListNav>
				{
					isSuccess && Object.values(books).map(book => {
						return <BookItem key={ book.itemId } book={ book }/>;
					})
				}
				{
					isLoading &&
					<LodingSpinnerWrapper>
						<LoadingSpinner variant="dark" />
					</LodingSpinnerWrapper>
				}
			</Wrapper>
		</MainLayout>
	);
}

export default BookCategoryResultPage;

const Wrapper = styled.div`
	width: 100%;
	margin-bottom: 50px;
	
	@media ${ device.desktop } {
		max-width: 1024px;
	}
`;
const PageTitle = styled.h1`
	display: flex;
	justify-content: center;
	align-items: center;
	position: sticky;
	top: 0;
	width: 100%;
	height: 50px;
	text-align: center;
	font-weight: bold;
	font-size: 20px;
	background-color: #fff;
	z-index: 1000;
`;
const BookListNav = styled.div`
	display: flex;
    position: sticky;
	top: 50px;
	border-bottom: 1px solid ${({ theme }) => theme.colors.grey};
	background-color: #fff;
    z-index: 1000;
	
	> .nav-item {
		> a {
            display: flex;
            align-items: center;
			height: 40px;
            padding: .5rem 1rem;
			color: #000;
		}
		> a.active {
			border-bottom: 4px solid ${({ theme }) => theme.colors.darkBlue};
			font-weight: bold;
			color: ${({ theme }) => theme.colors.darkBlue};
		}
	}
`;
const LodingSpinnerWrapper = styled.div`
	width: 100%;
	margin: 80px 0;
	text-align: center;
`;