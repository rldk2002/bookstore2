import React from "react";
import Loader from "react-loader-spinner";
import { Spinner } from "react-bootstrap";

export const LoadingSpinner = ({ size, variant = "success" }) => {
	return <Spinner animation="border" variant={ variant } size={ size } />
}

export const ModalLoadingIndicator = () => {
	return (
		<div style={{
			width: "100%",
			height: "100vh",
			position: "fixed",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			zIndex: 2000
		}}>
			<div
				style={{
					width: "100%",
					height: "100vh",
					position: "absolute",
					backgroundColor: "black",
					opacity: 0.1
				}}
			/>
			<Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
		</div>
	);
}