import React from "react";
import { QueryClient, QueryClientProvider, useQueryErrorResetBoundary } from "react-query";
import AppRoute from "../AppRoute";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import GlobalStyle from "../style/GlobalStyle";
import theme from "../style/theme";
import { ThemeProvider } from "styled-components";
import ErrorPage from "./error/ErrorPage";
import { Flip, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import dateFormat from "../utils/prototype/dateFormat";

function App() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: 0,
				cacheTime: 1000 * 60 * 30,
				refetchOnMount: true,
				refetchOnWindowFocus: false,
				useErrorBoundary: false
			},
			mutations: {
				retry: false,
				useErrorBoundary: true
			}
		}
	});
	const { reset } = useQueryErrorResetBoundary();
	
	dateFormat();
	
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
						<ToastContainer
							autoClose={ 500 }
							hideProgressBar
							transition={ Flip }
						/>
					</ThemeProvider>
				</BrowserRouter>
			</ErrorBoundary>
		</QueryClientProvider>
	);
}

export default App;
