import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { OutlineButton, SimpleButton } from "../../../components/Buttons";
import { X } from "@styled-icons/boxicons-regular";
import { useHistory } from "react-router-dom";
import ItemCounter from "./ItemCounter";
import { useAddBookToCart, useToggleBookLike, useFetchBookLike } from "../../../api/queries";
import { Heart as FillHeart } from "@styled-icons/boxicons-solid/Heart";
import { Heart as EmptyHeart } from "@styled-icons/boxicons-regular/Heart";
import { useQueryClient } from "react-query";
import { queryKeys, queryKeywords } from "../../../api/queryKeys";
import redirectLogin from "../../../service/redirectLogin";
import { LoadingSpinner } from "../../../components/LoadingIndicator";

const BookDetailPageFooter = ({ itemId, price }) => {
	const history = useHistory();
	const queryClient = useQueryClient();
	const [isOpenCounter, setOpenCounter] = useState(false);
	const [itemCount, setItemCount] = useState(1);
	const [amount, setAmount] = useState(0);
	
	useEffect(() => {
		setAmount(itemCount * price);
	}, [itemCount, price]);
	
	const openCounter = () => {
		setOpenCounter(true);
	};
	const closeCounter = () => {
		setOpenCounter(false);
	}
	
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
	} // 좋아요
	
	return (
		<Wrapper>
			<Amount display={ isOpenCounter ? 1 : 0 }>
				<ItemCounter onCountChange={ handleCountChange } />
				<Price>{ amount?.toLocaleString('ko-KR') } 원</Price>
				<CounterCloseButton onClick={ closeCounter }><X size="20"/></CounterCloseButton>
			</Amount>
			{
				isOpenCounter ? (
					<ButtonGroup2>
						<SimpleButton size="lg" onClick={ addBookToCart }>
							{
								isAddBookCartLoading ?
								<LoadingSpinner variant="light" size="sm" /> :
								<span>북카트에 담기</span>
							}
							
						</SimpleButton>
						<SimpleButton size="lg" onClick={ () => alert("Link로 바꿔서 구매페이지로 이동!") }>구매하기</SimpleButton>
					</ButtonGroup2>
				) : (
					<ButtonGroup1>
						<OpenCounterButton size="lg" onClick={ openCounter }>구매하기</OpenCounterButton>
						<OutlineButton color="red" size="lg" onClick={ handleClickLikeBook }>
							{ bookLike ? <FillHeart size="20" /> : <EmptyHeart size="20" /> }
						</OutlineButton>
					</ButtonGroup1>
				)
			}
		</Wrapper>
	);
}
//todo 구매하기 버튼 구현하기
export default BookDetailPageFooter;

const Wrapper = styled.div`
    display: flex;
	flex-direction: column;
    align-items: center;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
	width: 100%;
    background-color: white;
    box-shadow: 0 -1px 0 0 ${({ theme }) => theme.colors.grey};
    z-index: 1030;
`;
const ButtonGroup1 = styled.div`
	display: flex;
	width: 100%;
`;
const ButtonGroup2 = styled(ButtonGroup1)`
	> button {
		flex: 1;
	}
	> button:first-child {
		border-right: 1px solid white;
	}
`;
const OpenCounterButton = styled(SimpleButton)`
	width: 100%;
`;

const Amount = styled.div`
	display: ${ ({ display }) => {
		if (display) return "flex";
		else return "none";
	}};
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 40px 20px;
`;
const Price = styled.div`
	font-size: 20px;
    font-weight: bold;
`;
const CounterCloseButton = styled.button`
	position: absolute;
	left: calc(50% - 20px);
	top: -24px;
	width: 40px;
	height: 24px;
	border: 1px solid grey;
	border-bottom: 0;
	background-color: white;
`;