import React, { useState } from "react";
import styled from "styled-components";
import EmptyLayout from "../../components/layout/EmptyLayout";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { device } from "../../style/device";
import { ModalLoadingIndicator } from "../../components/LoadingIndicator";
import { useQueryClient } from "react-query";
import { ValidationMessage, Form } from "../../components/Forms";
import { EmptyLink, SimpleButton } from "../../components/Buttons";
import { useLoginJWT } from "../../api/queries";

const Login = ({ location }) => {
	const history = useHistory();
	const queryClient = useQueryClient();
	const [cause, setCause] = useState('');	// 로그인 실패 원인 메세지
	
	const { mutateAsync: mutateAsyncLogin, isLoading } = useLoginJWT();
	
	/* 로그인 폼 유효성 검증 및 submit */
	const schema = yup.object().shape({
		id: yup.string().required("아이디를 입력하세요."),
		password: yup.string().required("비밀번호를 입력하세요.")
	});
	const { register, formState: { errors }, handleSubmit } = useForm({
		mode: "onSubmit",
		reValidateMode: "onSubmit",
		resolver: yupResolver(schema)
	});
	const onValid = async form => {
		await mutateAsyncLogin(form, {
			onSuccess: response => {
				const { code, description } = response;
				if (code?.startsWith("LF-")) {
					setCause(description);
				}
				else {
					queryClient.invalidateQueries({
						predicate: ({ queryKey }) => queryKey.find(key => key === 'principal')
					}).finally(() => {
						const previousPage = location.state?.from;
							if (previousPage) {
								history.replace(previousPage);
							} else {
								history.replace("/");
							}
						}
					)
				}
			}
		})
	}
	
	return (
		<EmptyLayout>
			{ isLoading && <ModalLoadingIndicator /> }
			<Wrapper>
				<Logo>
					<Link to="/">BookStore</Link>
				</Logo>
				<Form onSubmit={ handleSubmit(onValid) }>
					<Form.Group>
						<Form.Input
							type="text"
							placeholder="아이디"
							autoComplete="off"
							{ ...register("id") }
							size="lg"
						/>
					</Form.Group>
					<Form.Group className="mb-2">
						<Form.Input
							type="password"
							placeholder="비밀번호"
							autoComplete="off"
							{ ...register("password") }
							size="lg"
						/>
					</Form.Group>
					{ errors.id && <ValidationMessage>{ errors.id.message }</ValidationMessage> }
					{ !errors.id && errors.password && <ValidationMessage>{ errors.password.message }</ValidationMessage> }
					{ !errors.id && !errors.password && <ValidationMessage>{ cause }</ValidationMessage> }
					<Form.Group>
						<LoginButton type="submit" size="lg">로그인</LoginButton>
					</Form.Group>
				</Form>
				<EmptyLink to="/signup">회원가입</EmptyLink>
			</Wrapper>
		</EmptyLayout>
	)
}

export default Login;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	
    @media ${ device.tablet } {
        width: 400px;
    }
`;
const Logo = styled.div`
    margin: 40px 0;
	font-size: 24px;
	font-weight: bold;
`;
const LoginButton = styled(SimpleButton)`
	flex: 1;
`;
