import React from "react";
import { Redirect, Route } from "react-router-dom";
import { ModalLoadingIndicator } from "./LoadingIndicator";
import { useAuthentication } from "../api/queries";

const PrivateRoute = ({ component: Component, ...parentProps }) => {
	const { isLoading, data: principal } = useAuthentication();
	
	if (isLoading) {
		return <ModalLoadingIndicator />;
	}
	
	return (
		<Route
			{ ...parentProps }
			render={ props =>
				principal ? (
					<>
						<Component { ...props } />
					</>
				) : (
					<Redirect to={{ pathname: "/login", state: { from: props.location }}} />
				)
			}
		/>
	);
};

export default PrivateRoute;