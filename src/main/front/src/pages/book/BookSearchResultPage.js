import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import { useInfiniteQuery } from "react-query";
import { queryKeys } from "../../api/queryKeys";
import ajax from "../../api/axiosInterceptor";
import { useHistory, useLocation } from "react-router-dom";
import { parseQueryVariable } from "../../utils/stringutils";
import styled from "styled-components";
import { device } from "../../style/device";
import BookItem from "./parts/BookItem";
import { LoadingSpinner } from "../../components/LoadingIndicator";
import { Sad } from "@styled-icons/boxicons-regular";
import { useTitle } from "../../hook/hooks";
import { TITLE_SUFFIX } from "../../config";
import { SimpleButton } from "../../components/Buttons";
import { Form } from "react-bootstrap";


const BookSearchResultPage = () => {
	const history = useHistory();
	const location = useLocation();
	const keyword = parseQueryVariable(location.search, "query");
	const sort = parseQueryVariable(location.search, "sort");
	const {
		isLoading,
		isSuccess,
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useInfiniteQuery(
		queryKeys.bookList({ search: keyword, sort: sort }),
		({ pageParam = 1 }) => ajax.get(`/books/search/${location.search}&page=${pageParam}`), {
			staleTime: Infinity,
			cacheTime: Infinity,
			getNextPageParam: lastPage => {
				if (lastPage.maxResults === lastPage.itemsPerPage) return lastPage.startIndex + 1;
				else return undefined;
			},
			getPreviousPageParam: firstPage => firstPage.startIndex - 1
		}
	);
	const handleChangeSort = ({ target }) => {
		history.push(`/books/search?query=${ keyword }&sort=${ target.value }`);
	};
	
	
	useTitle(keyword + " | 검색" + TITLE_SUFFIX);
	
	return (
		<MainLayout>
			<Wrapper>
				<PageTitle>"{ keyword }" 검색결과</PageTitle>
				<SortSelect onChange={ handleChangeSort } value={ sort || "accuracy" } >
					<option value="accuracy">정확도순</option>
					<option value="publishTime">최신출간일순</option>
				</SortSelect>
				{
					isSuccess && data.pages[0].totalResults === 0 &&
					<NoResult>
						<Sad size="128" />
						<div>검색결과가 존재하지 않습니다.</div>
					</NoResult>
				}
				{
					isSuccess &&
					data.pages.map((page, index) => {
						return (
							<div key={ index }>
							{
								page.item.map(book => {
									return <BookItem key={ book.itemId } book={ book } />;
								})
							}
							</div>
						);
					})
				}
				{
					(isLoading || isFetchingNextPage) &&
					<LodingSpinnerWrapper>
						<LoadingSpinner variant="dark" />
					</LodingSpinnerWrapper>
				}
				{
					!isFetchingNextPage && isSuccess && hasNextPage &&
					<FetchNext onClick={ fetchNextPage }>검색결과 더 불러오기</FetchNext>
				}
			</Wrapper>
		</MainLayout>
	);
};

export default BookSearchResultPage;

const Wrapper = styled.div`
	width: 100%;
	
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
const NoResult = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 0;

    > svg {
        margin-bottom: 20px;
    }
    > span {
        font-size: 20px;
    }
`;
const LodingSpinnerWrapper = styled.div`
	width: 100%;
	margin: 80px 0;
	text-align: center;
`;
const FetchNext = styled(SimpleButton)`
	width: 100%;
	height: 50px;
	margin-top: 50px;
`;
const SortSelect = styled(Form.Select)`
    @media ${ device.desktop } {
        width: 200px;
    }
`;