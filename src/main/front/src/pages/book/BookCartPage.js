import React, { useEffect, useState } from 'react';
import MainLayout from "../../components/layout/MainLayout";
import styled from "styled-components";
import { device } from "../../style/device";
import { useQueries, useQueryClient } from "react-query";
import { queryKeys, queryKeywords } from "../../api/queryKeys";
import { LoadingSpinner } from "../../components/LoadingIndicator";
import { Link, useHistory } from "react-router-dom";
import { useFetchBook, useFetchBookCart, useModifyBookCartCount, useRemoveBookCarts } from "../../api/queries";
import { useTitle } from "../../hook/hooks";
import { TITLE_SUFFIX } from "../../config";
import redirectLogin from "../../service/redirectLogin";
import ItemCounter from "./parts/ItemCounter";
import ajax from "../../api/axiosInterceptor";
import { OutlineButton } from "../../components/Buttons";

const Book = ({ id, count }) => {
	const { isLoading, data: book = {} } = useFetchBook(id);
	const amount = count * book.priceSales;
	
	const history = useHistory();
	const queryClient = useQueryClient();
	
	const { mutateAsync: mutateAsyncAddBookCart } = useModifyBookCartCount();
	const modifyBookCartCount = count => {
		if (!count) count = 0;
		mutateAsyncAddBookCart({ itemId: id, count: count }, {
			onSuccess: isAuthenticated => {
				if (isAuthenticated) {
					queryClient.invalidateQueries({
						predicate: ({ queryKey }) => queryKey.filter(
							key => key[1] === queryKeywords.bookCart && key[2] === queryKeywords.principal
						)
					}).finally();
				} else {
					redirectLogin(history);
				}
			}
		}).finally();
	};
	
	const handleCountChange = count => {
		modifyBookCartCount(count);
	};
	
	if (isLoading) {
		return (
			<LodingSpinnerWrapper>
				<LoadingSpinner />
			</LodingSpinnerWrapper>
		);
	}
	
	return (
		<BookContent>
			<Cover to={ `/books/${ book.itemId }` }>
				<img src={ book.coverLargeUrl } alt={ book.title } />
			</Cover>
			<MetaData>
				<Title>{ book.title }</Title>
				<div>
					<Amount>
						<ItemCounter
							initCount={ count }
							onCountChange={ handleCountChange }
						/>
					</Amount>
					<Price>
						<div>주문금액</div>
						<div>{ amount?.toLocaleString('ko-KR') }원</div>
					</Price>
				</div>
			</MetaData>
		</BookContent>
	);
};

const TotalAmount = ({ cartList }) => {
	const bookQueries = useQueries(
		cartList.map(({ id }) => {
			return {
				queryKey: queryKeys.book([{ itemId: id }]),
				queryFn: () => ajax.get(`/books/item/${ id }`)
			};
		})
	);
	const [totalPrice, setTotalPrice] = useState(0);
	
	useEffect(() => {
		const price = bookQueries.map(query => {
			const { data } = query;
			const count = cartList.filter(element => element.id === data?.itemId)[0]?.count;
			return {
				id: data?.itemId,
				count: count,
				price: data?.priceSales
			}
		}).reduce((a, { count, price }) => a + count * price, 0);
		setTotalPrice(price);
		// eslint-disable-next-line
	}, [bookQueries]);

	return (
		<AmountWrapper>
			<li>
				<div>결제예정금액</div>
				<div>{ totalPrice?.toLocaleString('ko-KR') }원 </div>
			</li>
		</AmountWrapper>
	);
}

const BookCartList = () => {
	const { isSuccess, data: bookCartList = [] } = useFetchBookCart();
	
	const [isAllChecked, setAllChecked] = useState(false);
	const [checkedItems, setChekedItems] = useState([]);
	const [checkedBookList, setCheckedBookList] = useState([]);
	
	const queryClient = useQueryClient();
	const history = useHistory();
	
	useEffect(() => {
		setAllChecked(true);
	},[]);
	
	useEffect(() => {
		if (isAllChecked) {
			const array = [];
			bookCartList.forEach(elememt => {
				array.push(elememt.itemId);
			});
			setChekedItems(array);
		} else {
		}
	},[isAllChecked, bookCartList]);
	
	useEffect(() => {
		const array = checkedItems.map(item => {
			const count = bookCartList.filter(book => book.itemId === item)[0].count;
			return {
				id: item,
				count: count
			};
		});
		setCheckedBookList(array);
		// eslint-disable-next-line
	},[checkedItems]);
	
	const handleAllCheckBox = ({ target }) => {
		if (target.checked) {
			setAllChecked(true);
		} else {
			console.log("전체 체크 해제");
			setAllChecked(false);
			setChekedItems([]);
		}
	};
	const handleCheckBox = ({ target }, book) => {
		if (target.checked) {
			if (bookCartList.length === checkedItems.length + 1) {
				setAllChecked(true);
			} else {
				setChekedItems([...checkedItems, book.id]);
			}
		} else {
			setAllChecked(false);
			setChekedItems(checkedItems.filter(item => item !== book.id));
		}
	};
	
	const { mutateAsync: mutateAsyncRemoveCarts } = useRemoveBookCarts();
	const handleRemoveCart = async () => {
		await mutateAsyncRemoveCarts({ itemIds: checkedItems }, {
			onSuccess: isAuthenticated => {
				if (isAuthenticated) {
					queryClient.invalidateQueries({
						predicate: ({ queryKey }) => queryKey.filter(
							key => key[1] === queryKeywords.bookCart && key[2] === queryKeywords.principal
						)
					}).finally(() => setChekedItems([]));
				} else {
					redirectLogin(history);
				}
			}
		})
	};
	
	return (
		<BookWrapper>
			<CartControl>
				<TotalCheckBox>
					<input
						type="checkbox"
						id="total"
						onChange={ handleAllCheckBox }
						checked={ isAllChecked }
					/>
					<label htmlFor="total">전체선택 ( { checkedItems.length } / { bookCartList.length } )</label>
				</TotalCheckBox>
				<OutlineButton onClick={ handleRemoveCart } size="sm">삭제</OutlineButton>
			</CartControl>
			{
				isSuccess && (
					<>
						{
							bookCartList.map(({ itemId, count }) => {
								return (
									<li key={ itemId }>
										<CheckBox>
											<input
												type="checkbox"
												onChange={ e => handleCheckBox(e, { id: itemId, count: count }) }
												checked={ checkedItems.includes(itemId) }
											/>
										</CheckBox>
										<Book id={ itemId } count={ count } />
									</li>
								);
							})
						}
					</>
				)
			}
			<TotalAmount cartList={ Array.from(checkedBookList) } />
		</BookWrapper>
	);
	//todo 구매버튼 및 기능 구현
};

const BookCartPage = () => {
	useTitle("북카트" + TITLE_SUFFIX);
	
	return (
		<MainLayout>
			<Wrapper>
				<PageTitle>장바구니</PageTitle>
				<BookCartList />
			</Wrapper>
		</MainLayout>
	);
};

export default BookCartPage;

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
const BookWrapper = styled.ul`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 20px;
	
	> li {
		display: flex;
		width: 100%;
		padding: 10px;
		margin-bottom: 10px;
		border: 1px solid ${({ theme }) => theme.colors.darkBlue};
	}
`;
const CheckBox = styled.div`
	margin-right: 10px;
`;
const BookContent = styled.div`
	display: flex;
	width: 100%;
`;
const Cover = styled(Link)`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100px;
	height: 133px;
	border: 1px solid ${({ theme }) => theme.colors.grey};
	box-shadow: 2px 2px 2px ${({ theme }) => theme.colors.grey};
	
	> img {
		width: 100%;
		max-height: 100%;
	}
`;
const MetaData = styled.div`
	display: flex;
	flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 120px);
	margin-left: 10px;
`;
const Amount = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin: 10px 0;
	
	> input {
		width: 30px;
        text-align: center;
	}
	> button {
		margin-left: 10px;
	}
`;
const Title = styled.div`
	font-weight: bold;
`;
const Price = styled.div`
	display: flex;
	justify-content: space-between;
	padding-top: 10px;
	border-top: 1px solid ${({ theme }) => theme.colors.darkBlue};
	font-weight: bold;
    color: orange;
`;
const LodingSpinnerWrapper = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	background-color: white;
`;
const AmountWrapper = styled.ul`
	display: flex;
	flex-direction: column;
	padding: 10px;
	border: 2px solid ${({ theme }) => theme.colors.darkBlue};
	
	> li {
		display: flex;
		justify-content: space-between;
		font-size: 20px;
		font-weight: bold;
		color: ${({ theme }) => theme.colors.darkBlue};
	}
`;
const CartControl = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	
	> button {
		height: 30px;
	}
`;
const TotalCheckBox = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 150px;
	padding: 10px 0;
	
	> input[type="checkbox"] {
		zoom: 1.5;
	}
	> label {
		font-weight: bold;
	}
`;