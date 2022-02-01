const redirectLogin = history => {
	history.push({
		pathname: "/login",
		state: { from: history.location.pathname }
	});
};

export default redirectLogin;