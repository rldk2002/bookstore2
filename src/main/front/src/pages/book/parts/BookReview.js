import React from 'react';
import styled from "styled-components";
import StarRatings from "react-star-ratings";

const BookReview = ({ review }) => {
	
	return (
		<Wrapper>
			<Rating>
				<StarRatings
					rating={ review.starRating }
					starRatedColor="#FFD700"
					starDimension="20px"
					starSpacing="0"
				/>
				<Point>{ review.starRating }</Point>
			</Rating>
			<Content>{ review.content }</Content>
			<Etc>
				<WriterName>{ review.writerName }</WriterName>
				<WriteDate>{ new Date(review.writeDate).format("yyyy.MM.dd") }</WriteDate>
			</Etc>
		</Wrapper>
	);
};
// todo 좋아요/싫어요
// todo 책 검색리스트 정렬기능, 필터 기능(가격같은 거) 구현
export default BookReview;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 10px;
	border: 1px solid ${({ theme }) => theme.colors.grey2};
	border-radius: 8px;
`;
const Rating = styled.div`
	display: flex;
	align-items: center;
`;
const Point = styled.span`
	margin-left: 4px;
	font-weight: bold;
`;
const Content = styled.pre`
	width: 100%;
	margin: 10px 0;
	overflow: hidden;
	white-space: pre-wrap;
	line-height: 20px;
`;
const Etc = styled.div`
	display: flex;
	
	> div:last-child:after {
		content: none;
	}
	> div:after {
		content: "\\00a0|\\00a0";
	}
`;
const WriterName = styled.div`
    color: ${({ theme }) => theme.colors.grey2};
`;
const WriteDate = styled.div`
    color: ${({ theme }) => theme.colors.grey2};
`;