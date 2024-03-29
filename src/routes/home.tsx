import { styled } from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
	display: grid;
	gap: 50px;
	width: 100%;
	overflow-y: scroll;
	grid-template-rows: 1fr 5fr;
`;

export default function Home() {
	return (
		<Wrapper className="tweet">
			<PostTweetForm />
			<Timeline />
		</Wrapper>
	);
}
