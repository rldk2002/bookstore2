import React from 'react';
import { Route, Switch } from "react-router-dom";
import Home from "./component/Home";
import Login from "./pages/authentication/Login";
import SignUp from "./pages/authentication/SignUp";
import Menu from "./pages/menu/Menu";
import NotFound from "./pages/error/NotFound";
import BookCategoryResultPage from "./pages/book/BookCategoryResultPage";
import BookSearchResultPage from "./pages/book/BookSearchResultPage";
import BookDetailPage from "./pages/book/BookDetailPage";
import BookCartPage from "./pages/book/BookCartPage";
import PrivateRoute from "./components/PrivateRoute";

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
			
			<Route component={ NotFound } />
		</Switch>
	);
};

export default AppRoute;