import { styled } from "styled-components";
import { ITweet } from "./timeline";

const Wrapper = styled.div`
    padding:30px 20px;
    border-top: 1px solid #eee;
}
`;
const Column = styled.div`
	position: relative;
	padding: 0 11%;
	&.photo {
		padding: 0 11%;
	}
`;
const UserImg = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	display: inline-block;
	width: 50px;
	height: 50px;
	background: #eee;
	border-radius: 50%;
`;
const Username = styled.span`
	font-size: 15px;
	font-weight: 600;
`;
const Payload = styled.p`
	margin: 10px 0;
	font-size: 18px;
`;
const Photo = styled.img`
	width: 100%;
	height: auto;
	max-height: 425px;
	border-radius: 15px;
`;

export default function Tweet({ userImg, username, photo, tweet }: ITweet) {
	return (
		<Wrapper>
			<Column>
				<Username>
					<UserImg src={userImg} />
					{username}
				</Username>
				<Payload>{tweet}</Payload>
			</Column>
			{photo ? (
				<Column className="photo">
					<Photo src={photo} />
				</Column>
			) : null}
		</Wrapper>
	);
}
