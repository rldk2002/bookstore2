import React from 'react';
import InternalServerError from "./internalServerError";
import NotFound from "./NotFound";

const ErrorPage = ({ error }) => {
	const { status } = error;
	
	if (status === 500) {
		return <InternalServerError />;
	}
	if (status === 404) {
		return <NotFound />;
	}
	if (status === 400) {
		return <div>400</div>;
	}
	if (status === 403) {
		return <div>권한 없음!!! 403</div>
	}
	return (
		<div>
			에러!!!
		</div>
	);
};

export default ErrorPage;