import { styled } from "styled-components";

const Wrapper = styled.div`
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const Text = styled.span`
	font-size: 24px;
	font-family: "Inria Serif", serif;
	font-style: italic;
	font-weight: bolder;
	color: #194f1d;
`;

export default function LoadingScreen() {
	return (
		<Wrapper>
			<Text>Loading....</Text>
		</Wrapper>
	);
}
