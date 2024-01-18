import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

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

const DeleteButton = styled.button`
	position: absolute;
	top: 0;
	right: 0;
	width: 32px;
	height: 32px;
	border: none;
	background: #fff;
	cursor: pointer;
	& > svg {
		color: #ddd;
	}

	&:hover > svg {
		color: #88520b;
		translation: all 0.5s;
	}
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

export default function Tweet({
	userImg,
	username,
	photo,
	tweet,
	userId,
	id,
}: ITweet) {
	const user = auth.currentUser;
	const onDelete = async () => {
		const ok = confirm("Are you sure you want to delete this tweet?");
		if (!ok || user?.uid !== userId) return; //로그인된 유저 ID가 트윗 작성자와 다르다면, 함수 종료
		try {
			await deleteDoc(doc(db, "tweets", id));
			if (photo) {
				const PhotoRef = ref(storage, `tweets/${user.uid}/${id}`);
				await deleteObject(PhotoRef);
			}
		} catch (e) {
			console.log(e);
		} finally {
			//
		}
	};
	return (
		<Wrapper>
			<Column>
				<Username>
					<UserImg src={userImg} />
					{username}
				</Username>
				{user?.uid === userId ? (
					<DeleteButton onClick={onDelete}>
						<svg
							fill="none"
							strokeWidth={1.5}
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
							/>
						</svg>
					</DeleteButton>
				) : null}

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
