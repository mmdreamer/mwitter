import { styled } from "styled-components";
import { auth } from "../firebase";
import PostTweetForm from "../components/post-tweet-form";

const Wrapper = styled.div``;

export default function Home() {
	const logOut = () => {
		auth.signOut();
	};

	return (
		<Wrapper>
			<PostTweetForm />
		</Wrapper>
	);
}
