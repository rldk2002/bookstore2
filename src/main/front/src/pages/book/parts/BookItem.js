import React from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { device, Tablet } from "../../../style/device";
import { convertyyyymmddWithDelimiter } from "../../../utils/stringutils";
import { Heart as EmptyHeart } from "@styled-icons/boxicons-regular/Heart";
import { Cart } from "@styled-icons/boxicons-regular";
import { OutlineButton } from "../../../components/Buttons";
import { useAddBookToCart, useToggleBookLike, useFetchBookLike } from "../../../api/queries";
import { useQueryClient } from "react-query";
import { queryKeys, queryKeywords } from "../../../api/queryKeys";
import { Heart as FillHeart } from "@styled-icons/boxicons-solid";
import redirectLogin from "../../../service/redirectLogin";


const BookItem = ({ book }) => {
	const history = useHistory();
	const queryClient = useQueryClient();
	const {
		priceStandard,
		discountRate,
		itemId,
		priceSales,
		publisher,
		author,
		pubDate,
		title,
		description,
		rank,
		coverLargeUrl
	} = book;
	
	/*
	 * 좋아요
	 */
	const { data: bookLike } = useFetchBookLike(itemId);
	const { mutateAsync: mutateAsyncBookLike } = useToggleBookLike();
	const handleClickLikeBook = () => {
		mutateAsyncBookLike({ itemId: itemId }, {
			onSuccess: (isAuthenticated) => {
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
		}).finally();
	}
	
	/*
	 * 북카트
	 */
	const { mutateAsync: mutateAsyncBookCart } = useAddBookToCart();
	const handleClickBookCart = () => {
		mutateAsyncBookCart({ itemId: itemId, count: 1 }, {
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
	} // 북카트
	
	return (
		<Book key={ itemId }>
			<Link to={ `/books/${ itemId }` }>
				<BookContent>
					<Cover>
						<img src={ coverLargeUrl } alt={ title } />
					</Cover>
					<MetaData>
						{ rank > 0 && <Rank>{ rank }</Rank> }
						<Title>{ title }</Title>
						<Author>
							{ author && <div>{ author }</div> }
							{ publisher && <div>{ publisher }</div> }
							<Tablet>
								<div>{ convertyyyymmddWithDelimiter(pubDate, ".") }</div>
							</Tablet>
						</Author>
						<Tablet>
							<Description>{ description }</Description>
						</Tablet>
						<StandardPrice>
							<DiscountRate>{ discountRate }<span>%</span> </DiscountRate>
							<Price>{ priceStandard.toLocaleString('ko-KR') }원</Price>
						</StandardPrice>
						<SalesPrice>{ priceSales.toLocaleString('ko-KR') }<span>원</span></SalesPrice>
					</MetaData>
				</BookContent>
			</Link>
			<BookButtonGroup>
				<OutlineButton color="red" size="sm" onClick={ handleClickLikeBook }>
					{ bookLike ? <FillHeart size="20" /> : <EmptyHeart size="20" /> }
				</OutlineButton>
				<OutlineButton color="blue" size="sm" onClick={ handleClickBookCart }>
					<Cart size="20" />
				</OutlineButton>
			</BookButtonGroup>
		</Book>
	);
}

export default React.memo(BookItem);

const Book = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
	width: 100%;
	padding: 20px;
	border-bottom: 1px solid ${({ theme }) => theme.colors.grey};
`;
const BookContent = styled.div`
	display: flex;
	width: 100%;
	height: 170px;
`;
const Cover = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 120px;
	border: 1px solid ${({ theme }) => theme.colors.grey};
	box-shadow: 3px 3px 3px ${({ theme }) => theme.colors.grey};
	
	> img {
		width: 100%;
		height: 100%;
	}
`;
const MetaData = styled.div`
	display: flex;
	flex-direction: column;
	margin-left: 20px;
	width: calc(100% - 120px);
 
	@media ${ device.tablet } {
        width: calc(100% - 136px);
    }
`;
const Rank = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 40px;
	height: 20px;
	border-radius: 10%;
	color: white;
	background-color: ${({ theme }) => theme.colors.darkBlue};
`;
const Title = styled.div`
	margin: 4px 0 10px;
	font-size: 16px;
    font-weight: bold;
`;
const Author = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 12px;
	color: #99A3A4;
	
	> div {
		margin-bottom: 2px;
	}
	@media ${ device.tablet } {
		flex-direction: row;
		
		> div:not(:last-of-type):after {
            content: "\\00a0|\\00a0";
		}
	}
`;
const Description = styled.div`
	display: -webkit-box;
	width: 100%;
	font-size: 12px;
	line-height: 1.25;
    overflow: hidden;
    -webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-wrap: break-word;
`;
const StandardPrice = styled.div`
    margin-top: 14px;
	font-size: 12px;
	color: ${({ theme }) => theme.colors.grey2};
`;
const Price = styled.span`
    text-decoration: line-through;
`;
const DiscountRate = styled.span`
	font-size: 14px;
	font-weight: bold;
	color: orange;
	
	> span {
		font-size: 12px;
	}
`;
const SalesPrice = styled.div`
	margin-top: 2px;
	font-size: 16px;
	font-weight: bold;
	
	> span {
		font-size: 14px;
	}
`;
const BookButtonGroup = styled.div`
	display: flex;
	justify-content: flex-end;
	position: absolute;
	right: 20px;
	bottom: 20px;
	
	> button {
		margin-left: 8px;
	}
`;