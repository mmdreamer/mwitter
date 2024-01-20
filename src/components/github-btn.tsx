import {
	GithubAuthProvider,
	getRedirectResult,
	signInWithRedirect,
} from "firebase/auth";
import { styled } from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
			await signInWithRedirect(auth, provider);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const handleRedirectResult = async () => {
			try {
				const result = await getRedirectResult(auth);
				// result가 null이 아니고, result.user가 존재하는 경우에만 리디렉션 수행
				if (result !== null && result.user) {
					navigate("/");
				} else {
					console.log("GitHub 로그인 결과에 사용자 정보가 없습니다.", result);
				}
			} catch (error) {
				console.error("GitHub 로그인 결과 가져오기 실패:", error);
			}
		};

		handleRedirectResult();
	}, [navigate]);

	return (
		<Button onClick={onClick}>
			<Logo src="/github-logo.svg" />
			Continue with Github
		</Button>
	);
}
