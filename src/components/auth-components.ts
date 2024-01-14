import { styled } from "styled-components";

export const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	width:420px;
	padding 50px 0;
`;
export const Title = styled.h1`
	font-size: 42px;
`;
export const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
	margin-top: 50px;
	margin-bottom: 10px;
`;
export const Input = styled.input`
	width: 100%;
	padding: 10px 20px;
	border: 1px solid #eee;
	border-radius: 50px;
	font-size: 16px;

	&:focus {
		outline: 1px solid #a9aca9;
		transition: all 0.5s;
	}

	&[type="submit"] {
		cursor: pointer;
		background-color: #54a063;
		color: #fff;

		&:hover {
			opacity: 0.8;
		}
	}
`;
export const Error = styled.span`
	font-weight: 400;
	color: tomato;
`;

export const Switcher = styled.span`
	margin-top: 20px;
	a {
		padding-left: 10px;
		color: #ac8249;
	}
`;
