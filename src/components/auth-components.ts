import { styled } from "styled-components";

export const Wrapper = styled.div`
	display: grid;
	grid-template-columns: 50% 45%;
	grid-gap: 5%;
	place-items: center;
	height: 100%;
	width: 1100px;
	box-sizing: border-box;
`;
export const Section = styled.div`
	width: 90%;
	margin: 0 auto;

	& > .bg-img {
		display: block;
		width: 90%;
		max-width: 500px;
		height: 100%;
		margin: 0 auto;
	}
`;

export const Title = styled.h1`
	margin: 0 0 20px;
	font-family: "Inria Serif", serif;
	font-style: italic;
	font-weight: 800;
	font-size: 42px;
	color: #194f1d;
`;

export const Subtitle = styled.h2`
	font-family: "Inria Serif", serif;
	font-weight: 500;
	font-size: 30px;
`;

export const Strong = styled.strong`
	display: block;
	margin: 20px 0;
	font-weight: 400;
	text-align: center;
`;

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
	margin-bottom: 20px;
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
		background-color: #194f1d;
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
	display: block;
	margin-top: 30px;
	font-family: "Inria Serif", serif;
	font-weight: 500;
	font-size: 18px;
	a {
		display: block;
		width: 100%;
		margin: 15px 0;
		padding: 10px 20px;
		border: 1px solid #194f1d;
		border-radius: 50px;
		font-weight: 500;
		font-size: 16px;
		text-decoration: none;
		text-align: center;
		color: #194f1d;
		&:hover {
			opacity: 0.8;
			transition: all 0.5s;
		}
	}
`;
