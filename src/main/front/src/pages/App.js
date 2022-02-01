import React from "react";
import { QueryClient, QueryClientProvider, useQueryErrorResetBoundary } from "react-query";
import AppRoute from "./AppRoute";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import GlobalStyle from "../style/GlobalStyle";
import theme from "../style/theme";
import { ThemeProvider } from "styled-components";
import ErrorPage from "./error/ErrorPage";

function App() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: Infinity,
				cacheTime: Infinity,
				useErrorBoundary: true
			},
			mutations: {
				retry: false,
				useErrorBoundary: true
			}
		}
	});
	const { reset } = useQueryErrorResetBoundary();
	
	return (
		<QueryClientProvider client={ queryClient }>
			<ErrorBoundary
				onReset={ reset }
				fallbackRender={({ error }) => <ErrorPage error={ error } />}
			>
				<BrowserRouter>
					<GlobalStyle />
					<ThemeProvider theme={ theme }>
						<AppRoute />
					</ThemeProvider>
				</BrowserRouter>
			</ErrorBoundary>
		</QueryClientProvider>
	);
}

export default App;
