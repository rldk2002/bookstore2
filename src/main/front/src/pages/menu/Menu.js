import React from "react";
import EmptyLayout from "../../components/layout/EmptyLayout";
import styled from "styled-components";
import { useMutation, useQueryClient } from "react-query";
import BookCategories from "./BookCategories";
import { queryKeywords } from "../../api/queryKeys";
import ajax from "../../api/axiosInterceptor";
import { Link, useHistory } from "react-router-dom";
import { EmptyButton } from "../../components/Buttons";
import { ChevronRight, X } from "@styled-icons/boxicons-regular";
import { LoadingSpinner } from "../../components/LoadingIndicator";
import { useTitle } from "../../hook/hooks";
import * as config from "../../config"
import { useAuthentication } from "../../api/queries";


const Footer = () => {
	const history = useHistory();
	const queryClient = useQueryClient();
	const { data: principal } = useAuthentication();
	const mutationLogout = useMutation(() => ajax.post("/auth/logout"));
	const handleLogout = async () => {
		await mutationLogout.mutateAsync(null, {
			onSuccess: (data, variables, context) => {
				const { logout } = data;
				if (logout) {
					window.localStorage.removeItem("Authorization");
					queryClient.invalidateQueries({
						predicate: ({ queryKey }) => queryKey.find(key => key === queryKeywords.principal)
					});
				}
				else alert("로그아웃 실패");
			}
		});
	};
	
	//todo Footer 마이페이지 Link 구현
	return (
		<FooterWrapper className="justify-content-center">
			{
				principal ? (
					<>
						<li><EmptyButton onClick={ handleLogout }>로그아웃</EmptyButton></li>
						<li><Link to="/#">마이페이지</Link></li>
					</>
				) : (
					<>
						<li>
							<Link to={{
								pathname: "/login",
								state: {
									from: history.location.pathname
								}
							}}>로그인</Link>
						</li>
						<li><Link to="/signup">회원가입</Link></li>
					</>
				)
			}
		</FooterWrapper>
	);
}

const Authentication = () => {
	const history = useHistory();
	const { isLoading, data: principal } = useAuthentication();
	
	if (isLoading) {
		return (
			<Wrapper>
				<LoadingSpinner size="sm"/>
			</Wrapper>
		);
	}
	return (
		<Wrapper>
			{
				principal ? (
					<Profile>
						<Nickname><span>{ principal.name }</span> 님</Nickname>
						<GoBack size="24" onClick={ history.goBack }/>
					</Profile>
				) : (
					<Unauthorized>
						<Link to={{
							pathname: "/login",
							state: {
								from: history.location.pathname
							}
						}}>
							<Notice>로그인을 해주세요. </Notice>
							<ChevronRight size="34" />
						</Link>
						<GoBack size="24" onClick={ history.goBack }/>
					</Unauthorized>
				)
			}
		</Wrapper>
	);
}

const Menu = () => {
	useTitle("카테고리 메뉴" + config.TITLE_SUFFIX);
	
	return (
		<EmptyLayout>
			<Authentication />
			<BookCategories />
			<Footer />
		</EmptyLayout>
	)
};

export default Menu;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 60px;
	padding: 10px 20px;
`;
const Profile = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
`;
const Nickname = styled.div`
	> span {
		font-size: 20px;
		font-weight: bold;
	}
`;
const GoBack = styled(X)`
	cursor: pointer;
`;
const Unauthorized = styled.div`
    display: flex;
    justify-content: space-between;
	align-items: center;
	width: 100%;
	cursor: pointer;
	
	> a {
		display: flex;
	}
`;
const Notice = styled.div`
	display: flex;
	align-items: center;
`;
const FooterWrapper = styled.ul`
	display: flex;
	align-items: center;
	width: 100%;
	padding: 20px;
	background-color: #eeeeee;
	
	> li {
		
		> a {
            padding: 6px 12px;
		}
	}
`;