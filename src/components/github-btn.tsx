import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { styled } from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 5px;
	width: 100%;
	border: 1px solid #eee;
	border-radius: 50px;
	margin-top: 50px;
	padding: 10px 20px;
	background-color: #fefefe;
	font-weight: 500;
	cursor: pointer;
	&:hover {
		border-color: #54a063;
		opacity: 0.8;
		transition: all 0.5s;
	}
`;
const Logo = styled.img`
	height: 25px;
`;

export default function GithubButton() {
	const navigate = useNavigate();
	const onClick = async () => {
		try {
			const provider = new GithubAuthProvider();
			await signInWithPopup(auth, provider);
			navigate("/");
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<Button onClick={onClick}>
			<Logo src="/github-logo.svg" />
			Continue with Github
		</Button>
	);
}
