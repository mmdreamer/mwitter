import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 10px;
	position: relative;
`;
const TextArea = styled.textarea`
	width: 100%;
	padding: 20px;
	border: 1px solid #194f1d;
	border-radius: 15px;
	background: #fff;
	font-size: 16px;
	color: #1e1e1e;
	resize: none;
	&::placeholder {
		font-family: "Inria Serif", serif;
		font-size: 16px;
	}
	&:focus {
		outline: none;
		border: 1px dashed #a7b01e;
		transition: all 0.2s;
	}
`;
const AttachFileButton = styled.label`
	width: 26px;
	height: 26px;
	margin-right: auto;
	margin-left: 10px;
	background: #fff;
	color: #ddd;
	cursor: pointer;
`;
const AttachFileInput = styled.input`
	display: none;
`;
const SubmitBtn = styled.input`
	position: relative;
	top: -30px;
	width: 150px;
	margin-left: auto;
	padding: 10px 5px;
	border: none;
	border-radius: 25px;
	background-color: #194f1d;
	text-align: center;
	color: #fff;
	cursor: pointer;
	&:hover,
	&:active {
		opacity: 0.8;
	}
`;

export default function PostTweetForm() {
	const [isLoading, setLoading] = useState(false);
	const [tweet, setTweet] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTweet(e.target.value);
	};
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (files && files.length === 1 && files[0].size < 1024 * 1024) {
			setFile(files[0]);
		} else {
			setFile(null); //1MB가 넘거나, 파일이 없을때..
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const user = auth.currentUser;
		if (!user || isLoading || tweet === "" || tweet.length > 180) return;

		try {
			setLoading(true);
			const doc = await addDoc(collection(db, "tweets"), {
				tweet,
				createdAt: Date.now(),
				username: user.displayName || "Anonymous",
				userId: user.uid,
			});
			if (file) {
				const locationRef = ref(
					storage,
					`tweets/${user.uid}-${user.displayName}/${doc.id}`
				);
				const result = await uploadBytes(locationRef, file);
				const url = await getDownloadURL(result.ref);
				await updateDoc(doc, {
					photo: url,
				});
			}
			//Reset after submitting a tweet
			setTweet("");
			setFile(null);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form onSubmit={onSubmit}>
			<TextArea
				required
				onChange={onChange}
				rows={4}
				maxLength={180}
				placeholder="What is happening today?"
				value={tweet}
			/>
			<AttachFileButton htmlFor="file">
				{file ? (
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
							d="m4.5 12.75 6 6 9-13.5"
						/>
					</svg>
				) : (
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
							d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
						/>
					</svg>
				)}
			</AttachFileButton>
			<AttachFileInput
				onChange={onFileChange}
				type="file"
				id="file"
				accept="image/*"
			/>
			<SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post"} />
		</Form>
	);
}
