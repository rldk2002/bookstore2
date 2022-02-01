import React from "react";
import { useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styled from "styled-components";
import { device } from "../../style/device";
import AuthenticationLayout from "../../component/layout/AuthenticationLayout";
import { ModalLoadingIndicator} from "../../components/LoadingIndicator";
import { useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import ajax from "../../api/axiosInterceptor";
import { Form, ValidationMessage } from "../../components/Forms";
import { SimpleButton } from "../../components/Buttons";
import { Check, ErrorCircle } from "@styled-icons/boxicons-regular";

const SignUp = () => {
	const history = useHistory();
	const schema = yup.object().shape({
		id: yup.string()
			.required("아이디를 입력하세요.")
			.min(6, ({ min }) => `아이디는 ${min}자 이상이어야 합니다.`)
			.max(20, ({ max }) => `아이디는 최대 ${max}자까지 입니다.`)
			.matches("^[a-z0-9_-]*$", "아이디는 영문 소문자, 숫자, 특수기호(_)(-)만 사용 가능합니다.")
			.test("exist", "이미 사용중인 아이디입니다.",
				async value => !await ajax.get("/auth/has/member", {
					params: {
						id: value
					}
				})
			),
		password: yup.string()
			.required("비밀번호를 입력하세요.")
			.min(8, ({ min }) => `비밀번호는 ${min}자 이상이어야 합니다.`)
			.max(24, ({ max }) => `비밀번호는 최대 ${max}자까지 입니다.`)
			.matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]*$", "비밀번호는 영문, 숫자, 특수기호가 모두 사용되어야 합니다."),
		password2: yup.string()
			.oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다."),
		name: yup.string()
			.required("이름을 입력하세요.")
			.min(2, ({ min }) => `이름은 ${min}자 이상이어야 합니다.`)
			.max(12, ({ max }) => `이름은 최대 ${max}자까지 입니다.`)
			.matches("^[가-힣a-zA-Z0-9]*$", "이름은 한글과 영문, 숫자만 사용가능합니다.")
	});
	const { register, handleSubmit, formState: { errors, touchedFields } } = useForm({
		mode: "onBlur",
		// reValidateMode: "onBlur",
		resolver: yupResolver(schema)
	});
	const mutationSignUp = useMutation(({ form }) => ajax.post("/auth/signup", null, {
		params: form
	}))
	const onValid = async form => {
		mutationSignUp.mutateAsync({ form: form }, {
			onSuccess: () => {
				history.push("/signup/welcome");
			}
		}).finally();
	}
	return (
		<AuthenticationLayout title="회원가입">
			{ mutationSignUp.isLoading && <ModalLoadingIndicator /> }
			<Wrapper>
				<Form onSubmit={ handleSubmit(onValid) }>
					<Form.Group vertical>
						<Form.Label>아이디</Form.Label>
						<InputGroup>
							<Form.Input
								type="text"
								placeholder="아이디 입력"
								autoComplete="off"
								{ ...register("id") }
								isValid={ touchedFields.id && !errors.id }
								isInvalid={ errors.id }
								size="lg"
							/>
							{ touchedFields.id && !errors.id && <ValidFeedback size="32"/> }
							{ errors.id && <InvalidFeedback size="32"/> }
						</InputGroup>
						<ValidationMessage type="invalid">{ errors.id?.message }</ValidationMessage>
					</Form.Group>
					<Form.Group vertical>
						<Form.Label>이름</Form.Label>
						<InputGroup>
							<Form.Input
								type="text"
								placeholder="이름 입력"
								autoComplete="off"
								{ ...register("name") }
								isValid={ touchedFields.name && !errors.name }
								isInvalid={ errors.name }
								size="lg"
							/>
							{ touchedFields.name && !errors.name && <ValidFeedback size="32"/> }
							{ errors.name && <InvalidFeedback size="32"/> }
						</InputGroup>
						<ValidationMessage type="invalid">{ errors.name?.message }</ValidationMessage>
					</Form.Group>
					<Form.Group vertical>
						<Form.Label>비밀번호</Form.Label>
						<InputGroup>
							<Form.Input
								type="password"
								placeholder="비밀번호 입력"
								autoComplete="off"
								{ ...register("password") }
								isValid={ touchedFields.password && !errors.password }
								isInvalid={ errors.password }
								size="lg"
							/>
							{ touchedFields.password && !errors.password && <ValidFeedback size="32"/> }
							{ errors.password && <InvalidFeedback size="32"/> }
						</InputGroup>
						<ValidationMessage type="invalid">{ errors.password?.message }</ValidationMessage>
						<InputGroup>
							<Form.Input
								type="password"
								placeholder="비밀번호 확인"
								autoComplete="off"
								{ ...register("password2") }
								isValid={ touchedFields.password && touchedFields.password2 && !errors.password && !errors.password2 }
								isInvalid={ !errors.password && errors.password2 }
								size="lg"
							/>
							{ touchedFields.password2 && !errors.password2 && <ValidFeedback size="32"/> }
							{ errors.password2 && <InvalidFeedback size="32"/> }
						</InputGroup>
						<ValidationMessage type="invalid">{ errors.password2?.message }</ValidationMessage>
					</Form.Group>
					<Form.Group>
						<SubmitButton type="submit" size="lg">가입하기</SubmitButton>
					</Form.Group>
				</Form>
			</Wrapper>
		</AuthenticationLayout>
	);
};

export default SignUp;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	
    @media ${ device.tablet } {
        width: 500px;
    }
`;
const ValidFeedback = styled(Check)`
    color: #198754;
`;
const InvalidFeedback = styled(ErrorCircle)`
	color: red;
`;
const InputGroup = styled.div`
	position: relative;
	
	> input {
        padding: 6px 40px 6px 12px;
	}
	> svg {
		position: absolute;
		top: 6px;
		right: 4px;
	}
`;
const SubmitButton = styled(SimpleButton)`
	flex: 1;
`;