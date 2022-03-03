import React from 'react';
import { Route, Switch } from "react-router-dom";
import Home from "../component/Home";
import Login from "./authentication/Login";
import SignUp from "./authentication/SignUp";
import Menu from "./menu/Menu";
import NotFound from "./error/NotFound";
import BookCategoryResultPage from "./book/BookCategoryResultPage";
import BookSearchResultPage from "./book/BookSearchResultPage";
import BookDetailPage from "./book/BookDetailPage";
import BookCartPage from "./book/BookCartPage";
import PrivateRoute from "../components/PrivateRoute";
import Test from "../Test";

const AppRoute = () => {
	
	return (
		<Switch>
			<Route path={["/", "/home"]} component={ Home } exact />
			<Route path="/login" component={ Login } exact />
			<Route path="/signup" component={ SignUp } exact />
			<Route path="/menu" component={ Menu } exact />
			<Route path="/books/search" component={ BookSearchResultPage } exact />
			<PrivateRoute path="/books/cart" component={ BookCartPage } exact />
			<Route path="/books/:itemId" component={ BookDetailPage } exact />
			<Route path="/books/:corner/category/:categoryId" component={ BookCategoryResultPage } exact />
			
			<Route path="/test" component={ Test } />
			
			<Route component={ NotFound } />
		</Switch>
	);
};

export default AppRoute;