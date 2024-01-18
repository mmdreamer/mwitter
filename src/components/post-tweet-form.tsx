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
const Attachments = styled.div`
	margin-right: auto;
	padding: 0 20px;
`;
const AttachFileButton = styled.label`
	display: inline-block;
	width: 26px;
	height: 26px;
	margin-left: 10px;
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
					userImg: url,
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
			<Attachments>
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
				<AttachFileButton>
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
							d="M12.75 8.25v7.5m6-7.5h-3V12m0 0v3.75m0-3.75H18M9.75 9.348c-1.03-1.464-2.698-1.464-3.728 0-1.03 1.465-1.03 3.84 0 5.304 1.03 1.464 2.699 1.464 3.728 0V12h-1.5M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
						/>
					</svg>
				</AttachFileButton>
				<AttachFileButton>
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
							d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
						/>
					</svg>
				</AttachFileButton>
				<AttachFileButton>
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
							d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
						/>
					</svg>
				</AttachFileButton>
			</Attachments>
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
