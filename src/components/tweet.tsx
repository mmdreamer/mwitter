import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
	padding: 30px 0 30px 20px;
	border-top: 1px solid #eee;
`;

const Column = styled.div`
	position: relative;
	padding: 0 20px 0 60px;
	&.photo {
		padding: 0 20px 0 60px;
	}
`;

const UserTweet = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 20px 0;
	& button.edit {
		border: none;
		background: none;
		color: #88520B;
		cursor: pointer;
		svg {
			width: 22px;
			height: 22px;
		}
		&:hover {
			color: #1e1e1e;
			opacity: 0.8;
		}
	}
	& button.edit:last-child {
		color: #555;
	}
	& .editTextarea {
		display: block;
		width: 100%;
		min-height: 100px;
		padding: 15px;
		border: 1px solid #eee;
		border-radius: 8px;
		background-color: #fff;
		outline: none;
		&::placeholder {
			text-align: center;
		}
		&:focus {
			border: none;
			outline: 1px dotted #a7b01e;
			transition: all 0.5s;
		}
	}
	& .editInput {
		display: none;
	}
	& .editLabel {
		display: block;
		width: 100%;
		padding: 8px 10px;
		border-radius: 20px;
		background: #1e1e1e;
		font-size: 12px;
		font-weight: normal;
		text-align: center;
		color: #fff;
		cursor: pointer;
		&:hover{
			opacity: 0.8;
        }
		}
	}
`;

const UserImg = styled.img`
	position: absolute;
	top: 0;
	left: -10px;
	display: inline-block;
	width: 50px;
	height: 50px;
	background: #eee;
	border-radius: 50%;
`;
const Username = styled.span`
	font-size: 15px;
	font-weight: 600;
	.avatar {
		position: absolute;
		top: 0;
		left: 0;
		display: inline-block;
		width: 50px;
		height: 50px;
		padding: 8px;
		background: #eee;
		border-radius: 50%;
		color: #fff;
	}
`;

const UserButtons = styled.div`
	position: absolute;
	top: 0;
	right: 0;
`;

const EditButton = styled.button`
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

const DeleteButton = styled.button`
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
	font-size: 16px;
`;
const Photo = styled.img`
	width: 100%;
	height: auto;
	max-height: 425px;
	border-radius: 15px;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
	const user = auth.currentUser;
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [newImage, setNewImage] = useState<File | null>(null);
	const [editedTweet, setEditedTweet] = useState(tweet);
	const [avatar, setAvatar] = useState<string | null>(null);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setNewImage(null);
		setEditedTweet(tweet); // 수정 취소 시 이전 내용으로 복원
	};

	const handleSaveEdit = async () => {
		try {
			setLoading(true);
			const tweetDocRef = doc(db, "tweets", id);

			//이미지 업로드
			if (newImage) {
				const storageRef = ref(storage, `tweets/${user?.uid}/${id}`);
				await uploadBytes(storageRef, newImage);
			}

			await updateDoc(tweetDocRef, {
				tweet: editedTweet,
				updatedAt: Date.now(),
			});

			//수정모드 종료
			setIsEditing(false);

			//업데이트 된 내용 서버에서 가져오기
			const updatedTweetSnapshot = await getDoc(tweetDocRef);
			const updatedTweetData = updatedTweetSnapshot.data();

			//업데이트된 트윗 내용을 상태에 업뎃
			setEditedTweet(updatedTweetData?.tweet);
		} catch (error) {
			console.error("Error updating tweet:", error);
		} finally {
			setLoading(false);
		}

		// location.reload();
		navigate("");
	};

	//새로운 이미지 선택
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setNewImage(file);
		}
	};
	useEffect(() => {
		const fetchPhotoUrl = async () => {
			if (id) {
				try {
					const tweetDoc = await getDoc(doc(db, "tweets", id));
					const tweetData = tweetDoc.data();

					if (tweetData && tweetData.photo) {
						await getDownloadURL(ref(storage, tweetData.photo));
					}
				} catch (error) {
					console.error("Error fetching photo URL:", error);
				}
			}
		};

		fetchPhotoUrl();
	}, [id, storage]);

	//Tweets 사용자 아바타
	const fetchAvatarUrl = async (userId: string) => {
		try {
			const userDocRef = doc(db, "tweets", userId);
			const userDoc = await getDoc(userDocRef);
			const userDataID = userDoc.id;
			const avatarRef = ref(storage, `avatars/${userDataID}`);

			return await getDownloadURL(avatarRef);
		} catch (error) {
			console.error("Error fetching avatar URL:", error);
			return null;
		}
	};

	useEffect(() => {
		const fetchTweetAvatar = async () => {
			if (userId) {
				const avatarUrl = await fetchAvatarUrl(userId);
				setAvatar(avatarUrl);
			} else {
				console.log("userId is undefined or null");
			}
		};

		fetchTweetAvatar();
	}, [userId]);

	//게시물 삭제
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
			console.error(e);
		} finally {
			//
		}
	};
	return (
		<Wrapper>
			<Column>
				<Username>
					{avatar ? (
						<UserImg src={avatar} />
					) : (
						<svg
							className="avatar"
							fill="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								clipRule="evenodd"
								fillRule="evenodd"
								d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
							/>
						</svg>
					)}

					{username}
				</Username>
				<UserTweet>
					{user?.uid === userId ? (
						<UserButtons>
							{!isEditing ? (
								<>
									<EditButton onClick={handleEdit}>
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
												d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
											/>
										</svg>
									</EditButton>
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
								</>
							) : (
								<>
									<button className="edit" onClick={handleSaveEdit}>
										{/* 저장 버튼 */}
										Save
									</button>
									<button className="edit" onClick={handleCancelEdit}>
										{/* 취소 버튼 */}
										Cancel
									</button>
								</>
							)}
						</UserButtons>
					) : null}

					{isEditing ? (
						<>
							<textarea
								className="editTextarea"
								value={editedTweet}
								onChange={(e) => setEditedTweet(e.target.value)}
							/>
							<input
								id="editInputFile"
								className="editInput"
								type="file"
								accept="image/*"
								onChange={handleImageChange}
							/>

							<label htmlFor="editInputFile" className="editLabel">
								Select File
							</label>
						</>
					) : (
						<Payload>{tweet}</Payload>
					)}
				</UserTweet>
			</Column>
			{photo ? (
				<Column className="photo">
					<Photo src={`${photo}?timestamp=${Date.now()}`} />
				</Column>
			) : newImage ? (
				<Column className="photo">
					<Photo src={URL.createObjectURL(newImage)} />
				</Column>
			) : null}
		</Wrapper>
	);
}
