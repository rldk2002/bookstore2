import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { useQueryClient } from "react-query";
import { queryKeys, queryKeywords } from "../../api/queryKeys";
import MainLayout from "../../components/layout/MainLayout";
import { LoadingSpinner } from "../../components/LoadingIndicator";
import { Heart as EmptyHeart } from "@styled-icons/boxicons-regular/Heart";
import { Heart as FillHeart } from "@styled-icons/boxicons-solid/Heart";
import { device, Mobile, Tablet } from "../../style/device";
import { convertyyyymmddWithDelimiter } from "../../utils/stringutils";
import StarRatings from "react-star-ratings";
import { OutlineButton, SimpleButton } from "../../components/Buttons";
import BookDetailPageFooter from "./parts/BookDetailPageFooter";
import ItemCounter from "./parts/ItemCounter";
import { useAddBookToCart, useToggleBookLike, useFetchBookLike, useFetchBook } from "../../api/queries";
import redirectLogin from "../../service/redirectLogin";
import { useTitle } from "../../hook/hooks";
import { TITLE_SUFFIX } from "../../config";

/**
 * 책 상세페이지
 * 이 페이지에서 책을 구매할 수 있음.
 */
const BookDetailPage = () => {
	const history = useHistory();
	const queryClient = useQueryClient();
	const { itemId } = useParams();
	
	/*
	 * 책 정보
	 */
	const { isLoading, isSuccess, data: {
		coverLargeUrl,
		title,
		author,
		publisher,
		pubDate,
		priceSales,
		priceStandard,
		discountRate,
		description,
		isbn,
		categoryId
	} = {} } = useFetchBook(itemId);
	const [categoryName, setCategoryName] = useState('');
	useEffect(() => {
		fetch("/book/interpark_book_categories.txt")
		.then(r => r.text())
		.then(text => {
			const regex = new RegExp(`(?<=${categoryId}=).+(?=\r\n)`);
			const name = regex.exec(text)?.[0];
			setCategoryName(name);
		})
	}, [categoryId]); // 책 정보
	
	/*
	 * 북카트 및 책 가격 계산
	 */
	const [itemCount, setItemCount] = useState(1);	// 상품(책) 개수
	const [amount, setAmount] = useState(0);	// 총 상품(책) 비용
	const { isLoading: isAddBookCartLoading, mutateAsync: mutateAsyncAddBookCart } = useAddBookToCart();
	const addBookToCart = () => {
		if (itemCount > 0) {
			mutateAsyncAddBookCart({ itemId: itemId, count: itemCount }, {
				onSuccess: isAuthenticated => {
					if (isAuthenticated) {
						queryClient.invalidateQueries(queryKeys.bookCart([queryKeywords.principal]))
						.finally(() => {
							if (window.confirm("책이 북카트에 담겼습니다. 북카트로 이동하시겠습니까?")) {
								history.push("/books/cart");
							}
						});
					} else {
						if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
							redirectLogin(history);
						}
					}
				}
			}).finally();
		} else {
			alert("주문수량은 1개이상이어야 합니다.");
		}
	};
	useEffect(() => {
		setAmount(priceSales * itemCount);
	}, [priceSales, itemCount]);
	const handleCountChange = count => {
		setItemCount(count);
	};
	
	/*
	 * 좋아요
	 */
	const { data: bookLike } = useFetchBookLike(itemId);
	const { mutateAsync: mutateAsyncBookLike } = useToggleBookLike();
	const handleClickLikeBook = async () => {
		await mutateAsyncBookLike({ itemId: itemId }, {
			onSuccess: isAuthenticated => {
				if (isAuthenticated) {
					queryClient.invalidateQueries({
						predicate: ({ queryKey }) => queryKey.filter(
							key => key[1] === queryKeywords.bookLike && key[3].itemId === itemId
						)
					}).finally();
				} else {
					if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
						redirectLogin(history);
					}
				}
			}
		});
	};
	
	useTitle(title + TITLE_SUFFIX);
	
	return (
		<MainLayout type="noFooter">
			{
				isSuccess &&
				<>
					<Wrapper>
						<Book>
							<Book.Image>
								<div>
									<img src={ coverLargeUrl } alt={ title } />
								</div>
							</Book.Image>
							<BookMetadata>
								<div>
									<Book.Category>{ categoryName }</Book.Category>
									<Book.Title>{ title }</Book.Title>
									<Book.Author>
										{ author && <div>{ author } 저</div> }
										<div>{ publisher }</div>
										<div>{ convertyyyymmddWithDelimiter(pubDate, ".") }</div>
									</Book.Author>
									<StarRatings
										rating={3.8}
										starRatedColor="#FFD700"
										starDimension="20px"
										starSpacing="0"
									/>
									<Book.Price>
										<Book.Price.Sales>{ priceSales.toLocaleString('ko-KR') }원</Book.Price.Sales>
										<Book.Price.Standard>{ priceStandard.toLocaleString('ko-KR') }원</Book.Price.Standard>
										<Book.Price.DiscountRate>{ discountRate }<span>%</span></Book.Price.DiscountRate>
									</Book.Price>
								</div>
								<Tablet>
									<Amount>
										<span>주문수량</span>
										<ItemCounter onCountChange={ handleCountChange } />
										<span>{ amount?.toLocaleString('ko-KR') }원</span>
									</Amount>
									<ButtonGroup>
										<AddBookToCartButton color="blue" size="lg" onClick={ addBookToCart }>
											{
												isAddBookCartLoading ?
												<LoadingSpinner variant="light" size="sm" /> :
												<span>북카트에 담기</span>
											}
										</AddBookToCartButton>
										<SimpleButton size="lg">구매하기</SimpleButton>
										<OutlineButton color="red" size="lg" onClick={ handleClickLikeBook }>
											{ bookLike ? <FillHeart size="20" /> : <EmptyHeart size="20" /> }
										</OutlineButton>
									</ButtonGroup>
								</Tablet>
							</BookMetadata>
						</Book>
						<Section>
							<SectionTitle>책소개</SectionTitle>
							<Description>
								{ description }
							</Description>
						</Section>
						<Section>
							<SectionTitle>책정보</SectionTitle>
							<BookMetaTable>
								<tbody>
									<tr>
										<th>저자</th>
										<td>{ author }</td>
									</tr>
									<tr>
										<th>출판사</th>
										<td>{ publisher }</td>
									</tr>
									<tr>
										<th>ISBN</th>
										<td>{ isbn }</td>
									</tr>
									<tr>
										<th>출간일</th>
										<td>{ convertyyyymmddWithDelimiter(pubDate, ".") }</td>
									</tr>
								</tbody>
							</BookMetaTable>
						</Section>
					</Wrapper>
					<Mobile>
						<BookDetailPageFooter itemId={ itemId } price={ priceSales } />
					</Mobile>
				</>
			}
			{
				isLoading && (
					<LodingSpinnerWrapper>
						<LoadingSpinner variant="dark" />
					</LodingSpinnerWrapper>
				)
			}
		</MainLayout>
		
	);
}

export default BookDetailPage;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	margin-bottom: 50px;
	background-color: ${({ theme }) => theme.colors.grey};

    @media ${ device.desktop } {
        max-width: 1024px;
    }
`;
const Section = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 20px;
    margin-bottom: 10px;
    background-color: #fff;
`;
const BookMetadata = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
	margin-top: 20px;
	
    @media ${ device.tablet } {
        margin-top: 0;
        padding: 20px;
    }
`;
const Book = styled(Section)`
    align-items: center;
	
	@media ${ device.tablet } {
        flex-direction: row;
		align-items: stretch;
	}
`;
Book.Image = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	
	> div {
		display: flex;
		margin: 20px 0;
        box-shadow: 10px 10px 10px grey;
	}

    @media ${ device.tablet } {
		width: 40%;
	}
`;
Book.Category = styled.div`
	margin-bottom: 4px;
`;
Book.Title = styled.h1`
	font-size: 24px;
	font-weight: bold;
`;
Book.Author = styled.div`
	display: flex;
	margin: 8px 0;
	color: #99A3A4;

    > div:not(:last-of-type):after {
        content: "\\00a0|\\00a0";
    }
`;
Book.Price = styled.div`
	display: flex;
	align-items: flex-end;
	margin: 10px 0;
	
	> div:not(:last-of-type) {
		margin-right: 4px;
	}
`;
Book.Price.Sales = styled.div`
	font-size: 18px;
	font-weight: bold;
`;
Book.Price.Standard = styled.div`
	font-size: 14px;
    color: ${({ theme }) => theme.colors.grey2};
    text-decoration: line-through;
`;
Book.Price.DiscountRate = styled.div`
	color: orange;
`;
const ButtonGroup = styled.div`
	> button {
		margin-right: 6px;
	}
`;
const SectionTitle = styled.div`
	width: 100%;
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: bold;
`;
const Description = styled.div`
	width: 100%;
	line-height: 1.5;
	white-space: pre-wrap;
	background-color: #fff;
`;
const BookMetaTable = styled.table`
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.grey2};
	
	tr {
		height: 36px;
        border: 1px solid ${({ theme }) => theme.colors.grey2};
	}
	th {
		padding: 0 10px;
		vertical-align: middle;
		background-color: ${({ theme }) => theme.colors.grey};
	}
	td {
		padding: 0 10px;
        vertical-align: middle;
	}

    @media ${ device.tablet } {
		width: 512px;
    }
`;
const LodingSpinnerWrapper = styled.div`
	width: 100%;
	padding: 80px 0;
	text-align: center;
	background-color: white;
`;
const Amount = styled.div`
	display: flex;
	align-items: center;
	
	> span {
		font-weight: bold;
	}
	> div {
		margin: 0 10px;
	}
`;
const AddBookToCartButton = styled(SimpleButton)`
	width: 160px;
`;