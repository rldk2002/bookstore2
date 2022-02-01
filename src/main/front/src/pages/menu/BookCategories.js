import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Accordion, AccordionContext, useAccordionButton } from "react-bootstrap";
import { CaretDown, CaretUp } from "@styled-icons/boxicons-regular";
import { Link } from "react-router-dom";

const AccordionToggle = ({ children, eventKey, callback }) => {
	const { activeEventKey } = useContext(AccordionContext);
	const decoratedOnClick = useAccordionButton(
		eventKey,
		() => callback && callback(eventKey),
	);
	const isCurrentEventKey = activeEventKey === eventKey;
	return (
		<AccordionToggleButton onClick={ decoratedOnClick }>
			<div>{ children }</div>
			{
				isCurrentEventKey ? <CaretUp size="20" /> : <CaretDown size="20" />
			}
		</AccordionToggleButton>
	);
}

const CategoryLink = ({ children, categoryId }) => {
	return (
		<SquareLink key={ categoryId } to={ `/books/bestSeller/category/${categoryId}` }>
			<img src={ `/book/img/${categoryId}.png` } width="40px" height="40px" alt="" />
			<div>{ children }</div>
		</SquareLink>
	);
}

const BookCategories = () => {
	const [categories, setCategories] = useState({});
	
	useEffect(() => {
		fetch("/book/interpark_book_categories.txt")
		.then(r => r.text())
		.then(text => {
			let map = {};
			text.replace(/(\b[^=]+)=([^\n]+)\n/g, ($0, key, value) => {
				map[key] = value;
				return ;
			});
			setCategories(map);
		});
	}, []);
	
	
	
	return (
		<Wrapper>
			<Accordion defaultActiveKey="100">
				<AccordionRow>
					<AccordionToggle eventKey="100">국내도서</AccordionToggle>
					<Accordion.Collapse eventKey="100">
						<AccordionContent>
						{
							Object.entries(categories)
							.filter(([key, value]) => value.startsWith("국내도서>"))
							.map(([key, value]) => [key, value.substring("국내도서>".length)])
							.map(([key, value]) => {
								return (
									<CategoryLink key={ key } categoryId={ key }>
										{ value }
									</CategoryLink>
								);
							})
						}
						</AccordionContent>
					</Accordion.Collapse>
				</AccordionRow>
				<AccordionRow>
					<AccordionToggle eventKey="200">외국도서</AccordionToggle>
					<Accordion.Collapse eventKey="200">
						<AccordionContent>
							{
								Object.entries(categories)
								.filter(([key, value]) => value.startsWith("외국도서>"))
								.map(([key, value]) => [key, value.substring("외국도서>".length)])
								.map(([key, value]) => {
									return (
										<CategoryLink key={ key } categoryId={ key }>
											{ value }
										</CategoryLink>
									);
								})
							}
						</AccordionContent>
					</Accordion.Collapse>
				</AccordionRow>
			</Accordion>
			
		</Wrapper>
	);
}

export default BookCategories;

const Wrapper = styled.div`
	width: 100%;
`;
const AccordionRow = styled.div`
	width: 100%;
`;
const AccordionToggleButton = styled.button`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 60px;
	padding: 0 10px;
	border-width: 10px 0 0 0;
	border-style: solid;
	border-color: #eeeeee;
	font-size: 16px;
	background-color: #fff;
`;
const AccordionContent = styled.div`
    display: flex;
	flex-flow: wrap;
`;
const SquareLink = styled(Link)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 25%;
    height: 80px;
	border: 1px solid #E5E7E9;
    font-size: 12px;
    background-color: #EBF5FB;
	
	> div {
		margin-top: 4px;
	}
`;
