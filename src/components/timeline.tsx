import {
	Unsubscribe,
	collection,
	limit,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
	id: string;
	photo?: string;
	avatar?: string;
	tweet: string;
	userId: string;
	username: string;
	createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
	const [tweets, setTweets] = useState<ITweet[]>([]);
	useEffect(() => {
		let unsubscribe: Unsubscribe | null = null;
		const fetchTweets = async () => {
			const tweetsQuery = query(
				collection(db, "tweets"),
				orderBy("createdAt", "desc"),
				limit(25)
			);
			// const snapshot = await getDocs(tweetsQuery);
			// const tweets = snapshot.docs.map((doc) => {
			// 	const { tweet, createdAt, userId, userImg, username, photo } = doc.data();
			// 	return {
			// 		id: doc.id,
			// 		tweet,
			// 		createdAt,
			// 		userId,
			// 		userImg,
			// 		username,
			// 		photo,
			// 	};
			// });
			unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
				const tweets = snapshot.docs.map((doc) => {
					const { tweet, createdAt, userId, username, photo, avatar } =
						doc.data();
					return {
						id: doc.id,
						tweet,
						createdAt,
						userId,
						username,
						photo,
						avatar,
					};
				});
				setTweets(tweets);
			});
		};
		fetchTweets();
		return () => {
			//usereffect 혹은 타임라인 컴포넌트가 사용되지 않을때 아래 함수 호출
			unsubscribe && unsubscribe();
		};
	}, []);

	return (
		<Wrapper>
			{tweets.map((tweet) => (
				<Tweet key={tweet.id} {...tweet} />
			))}
		</Wrapper>
	);
}
