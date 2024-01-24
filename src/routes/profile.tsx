import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 20px;
`;
const AvatarUpload = styled.label`
	display: flex;
	overflow: hidden;
	justify-content: center;
	align-items: center;
	width: 82px;
	height: 80px;
	border-radius: 50px;
	border: 1px solid #eee;
	background-color: #fff;
	cursor: pointer;

	svg {
		width: 50px;
		height: 50px;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 50%;
		color: #ddd;
	}
`;
const AvatarImg = styled.img`
	width: 100%;
	height: 100%;
	border-radius: 50px;
`;
const AvatarInput = styled.input`
	display: none;
`;

const Name = styled.div`
	font-weight: lighter;
	font-size: 26px;
`;
const NameButton = styled.button`
	display: inline-block;
	padding: 10px;
	border: none;
	background: none;
	color: #999;
	cursor: pointer;
	svg {
		width: 20px;
		height: 20px;
	}
	&:hover {
		color: #88520b;
	}
`;
const NameInput = styled.input`
	display: block;
	width: 100%;
	margin-bottom: 20px;
	padding: 10px;
	border: none;
	font-size: 18px;
	text-align: center;
	letter-spacing: 2px;
	&:focus {
		border: none;
		background: #efffef;
		outline: none;
		transition: all 0.5s;
	}
`;

const ConfirmButton = styled.button`
	display: block;
	width: 100px;
	height: 30px;
	margin: 0 auto 20px;
	padding: 0 20px;
	border: 1px solid #1e1e1e;
	border-radius: 25px;
	background: #fff;
	color: #1e1e1e;
	cursor: pointer;
	&:hover {
		opacity: 0.8;
	}
`;

const Tweets = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
`;

export default function Profile() {
	const [user, setUser] = useState(auth.currentUser);
	const [avatar, setAvatar] = useState(user?.photoURL);
	const [tweets, setTweets] = useState<ITweet[]>([]);
	const [isEditingName, setIsEditingName] = useState(false);
	const [newName, setNewName] = useState(user?.displayName || "");

	const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (!user) return;
		if (files && files.length === 1) {
			const file = files[0];
			const locationRef = ref(storage, `avatars/${user?.uid}`);
			const result = await uploadBytes(locationRef, file);
			const avatarUrl = await getDownloadURL(result.ref);
			setAvatar(avatarUrl);
			await updateProfile(user, {
				photoURL: avatarUrl,
			});
		}
	};

	const onNameChange = async () => {
		try {
			if (user && newName.trim() !== "") {
				// 유저 이름 업데이트
				await updateProfile(user, {
					displayName: newName,
				});

				// 현재 유저의 트윗 가져오기
				const tweetQuery = query(
					collection(db, "tweets"),
					where("userId", "==", user.uid)
				);
				const snapshot = await getDocs(tweetQuery);
				const tweetsToUpdate = snapshot.docs.map((doc) => doc.ref);

				// 트윗에 변경된 이름 업데이트
				await Promise.all(
					tweetsToUpdate.map(async (tweetRef) => {
						await updateDoc(tweetRef, {
							username: newName,
						});
					})
				);

				setIsEditingName(false);
			}
		} catch (error) {
			console.error("Error updating user profile and tweets:", error);
		}
	};

	const fetchTweet = async () => {
		const tweetQuery = query(
			collection(db, "tweets"),
			where("userId", "==", user?.uid),
			orderBy("createdAt", "desc"),
			limit(25)
		);
		const snapshot = await getDocs(tweetQuery);
		const tweets = snapshot.docs.map((doc) => {
			const { tweet, createdAt, userId, username, photo } = doc.data();
			return {
				tweet,
				createdAt,
				userId,
				username,
				photo,
				id: doc.id,
			};
		});
		setTweets(tweets);
	};

	useEffect(() => {
		fetchTweet();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		});

		return () => {
			// 컴포넌트가 언마운트될 때 리스너 해제
			unsubscribe();
		};
	}, []);

	return (
		<Wrapper>
			<AvatarUpload htmlFor="avatar">
				{avatar ? (
					<AvatarImg src={avatar} />
				) : (
					<svg
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
			</AvatarUpload>
			<AvatarInput
				onChange={onAvatarChange}
				id="avatar"
				type="file"
				accept="image/*"
			/>
			<Name>
				{isEditingName ? (
					<>
						<NameInput
							id="username"
							type="text"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
						/>
						<ConfirmButton onClick={onNameChange}>Confirm </ConfirmButton>
					</>
				) : (
					<>
						{user?.displayName ?? "Anonymous"}
						<NameButton onClick={() => setIsEditingName(true)}>
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
									d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
								/>
							</svg>
						</NameButton>
					</>
				)}
			</Name>
			<Tweets>
				{tweets.map((tweet) => (
					<Tweet key={tweet.id} {...tweet} />
				))}
			</Tweets>
		</Wrapper>
	);
}
