import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import { useAuthentication, useFetchBookReview, useRemoveBookReview, useWriteBookReview } from "../../../api/queries";
import BookReview from "./BookReview";
import { SimpleButton } from "../../../components/Buttons";
import { useHistory } from "react-router-dom";
import redirectLogin from "../../../service/redirectLogin";
import StarRatings from "react-star-ratings";
import { useQueryClient } from "react-query";
import { queryKeys, queryKeywords } from "../../../api/queryKeys";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../components/LoadingIndicator";

const MyBookReviewEditor = ({ itemId }) => {
	const history = useHistory();
	const queryClient = useQueryClient();
	
	const [starRating, setStarRating] = useState(0);
	const [content, setContent] = useState('');
	const [contentLength, setContentLength] = useState(0);
	const [isOpenEditor, setOpenEditor] = useState(false);
	
	const { data: principal } = useAuthentication();
	const { isLoading: isFetchBookReviewLoading, data: bookReview } = useFetchBookReview(itemId);
	const { isLoading: isWritingBookReview, mutateAsync: mutateAsyncWriteBookReview } = useWriteBookReview();
	const { isLoading: isRemovingBookReview, mutateAsync: mutateAsyncRemoveBookReview } = useRemoveBookReview();
	
	useEffect(() => {
		if (bookReview) {
			setStarRating(bookReview.starRating);
			setContent(bookReview.content);
			setContentLength(bookReview.content.length);
		}
	},[bookReview]);
	
	const handleChangeReview = ({ target }) => {
		const content = target.value;
		const length = content.length;
		
		setContent(content);
		setContentLength(length);
	};
	const handleBookReviewSubmit = async () => {
		if (validateReview()) {
			await mutateAsyncWriteBookReview({itemId: itemId, content: content, starRating: starRating}, {
				onSuccess: isAuthenticated => {
					if (isAuthenticated) {
						queryClient.invalidateQueries(
							queryKeys.bookReview([queryKeywords.principal, {itemId: itemId}])
						).finally(() => {
							setOpenEditor(false);
							toast.success("?????? ?????? ??????", {
								position: toast.POSITION.BOTTOM_RIGHT
							});
						});
					}
				}
			});
		}
	};
	function validateReview() {
		if (starRating === 0) {
			alert("????????? ??????????????????.");
			return false;
		}
		if (content.length < 10) {
			alert("?????? ????????? ?????? ????????????.");
			return false;
		}
		if (content.length > 300) {
			alert("?????? ????????? ?????? ?????????.");
			return false;
		}
		if (starRating > 5) {
			alert("????????? ??????");
			return false;
		}
		return true;
	}
	const handleBookReviewRemove = async () => {
		await mutateAsyncRemoveBookReview({ itemId: itemId }, {
			onSuccess: isAuthenticated => {
				if (isAuthenticated) {
					queryClient.invalidateQueries(
						queryKeys.bookReview([queryKeywords.principal, { itemId: itemId }])
					).finally(() => {
						setStarRating(0);
						setContent('');
						setContentLength(0);
						setOpenEditor(false);
						toast.success("?????? ?????? ??????", {
							position: toast.POSITION.BOTTOM_RIGHT
						});
					})
				}
			}
		});
	}
	
	
	if (!principal) {
		// ???????????? ??????
		return (
			<RequiredLogin>
				<LoginInfo>????????? ??????????????? ???????????? ????????????.</LoginInfo>
				<SimpleButton onClick={ () => redirectLogin(history) }>??????????????? ??????</SimpleButton>
			</RequiredLogin>
		);
	}
	
	if (isFetchBookReviewLoading) {
		return (
			<LodingSpinnerWrapper>
				<LoadingSpinner variant="dark" />
			</LodingSpinnerWrapper>
		)
	}
	
	if (bookReview && !isOpenEditor) {
		// ???????????? ????????? ?????? ??????
		return (
			<Wrapper>
				<BookReview review={ bookReview } />
				<EditButtonGroup>
					<SimpleButton onClick={ handleBookReviewRemove } color="red" disabled={ isRemovingBookReview } >
						{
							isRemovingBookReview ?
								<LoadingSpinner variant="light" size="sm" /> :
								<span>??????</span>
						}
					</SimpleButton>
					<SimpleButton onClick={ () => setOpenEditor(true) }>??????</SimpleButton>
				</EditButtonGroup>
			</Wrapper>
		);
	}
	
	return (
		<Wrapper>
			<ReviewEditor>
				<StarRatings
					rating={ starRating }
					starRatedColor="#FFD700"
					widgetRatedColors="#FFD700"
					starHoverColor="#FFD700"
					starDimension="40px"
					starSpacing="0"
					isSelectable={ true }
					changeRating={ rating => setStarRating(rating) }
				/>
				<ReviewInput
					value={ content }
					onChange={ handleChangeReview }
					placeholder="?????? 10?????? ?????? 300?????? ????????? ??????????????????."
				/>
				<EditButtonGroup2>
					<div>({ contentLength } / 300??????)</div>
					<EditButtonGroup>
						{ bookReview && <SimpleButton onClick={() => setOpenEditor(false)} color="grey">??????</SimpleButton> }
						<SimpleButton onClick={ handleBookReviewSubmit } disabled={ isWritingBookReview }>
							{
								isWritingBookReview ?
									<LoadingSpinner variant="light" size="sm" /> :
									<span>??????</span>
							}
						</SimpleButton>
					</EditButtonGroup>
				</EditButtonGroup2>
			</ReviewEditor>
		</Wrapper>
	);
};

export default MyBookReviewEditor;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	border-bottom: 1px solid ${({ theme }) => theme.colors.grey2};
`;
const RequiredLogin = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100px;
	
	> button {
		width: 300px;
	}
`;
const LoginInfo = styled.div`
	margin: 10px;
`;
const EditButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;

    > button {
        margin-left: 10px;
    }
`;
const ReviewEditor = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;
const ReviewInput = styled.textarea`
	width: 100%;
	height: 100px;
	margin: 10px 0;
	padding: 10px;
	line-height: 20px;
	resize: none;
`;
const EditButtonGroup2 = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;

    button {
        margin-left: 10px;
    }
`;
const LodingSpinnerWrapper = styled.div`
	width: 100%;
	padding: 80px 0;
	text-align: center;
	background-color: white;
`;