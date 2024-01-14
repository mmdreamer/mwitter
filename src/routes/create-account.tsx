import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
	Error,
	Input,
	Form,
	Switcher,
	Title,
	Wrapper,
	Section,
	Subtitle,
	Strong,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";

// const errors = {
// 	"auth/email-already-in-use": "The email already exists.",
// };

export default function CreateAccount() {
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {
			target: { name, value },
		} = e;
		if (name === "name") {
			setName(value);
		} else if (name === "email") {
			setEmail(value);
		} else if (name === "password") {
			setPassword(value);
		}
	};
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		if (isLoading || name === "" || email === "" || password === "") return;
		try {
			//Create an account
			setLoading(true);
			const credentials = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			console.log(credentials.user);
			await updateProfile(credentials.user, {
				displayName: name,
			});
			navigate("/");
			//Set the name of the user profile
			//Redirect to the home page
		} catch (e) {
			//setError
			if (e instanceof FirebaseError) {
				setError(e.message);
			}
		} finally {
			setLoading(false);
		}
		//console.log(name, email, password);
	};

	return (
		<Wrapper>
			<Section>
				<img
					className="bg-img"
					src="images/Home.jpg"
					alt="Login page home image"
				/>
			</Section>
			<Section>
				<Title>Welcome to Mwitter!</Title>
				<Subtitle>Be Our Member Today.</Subtitle>
				<GithubButton />
				<Strong> or </Strong>
				<Form onSubmit={onSubmit}>
					<Input
						onChange={onChange}
						name="name"
						value={name}
						placeholder="Name"
						type="text"
						required
					/>
					<Input
						onChange={onChange}
						name="email"
						value={email}
						placeholder="Email"
						type="text"
						required
					/>
					<Input
						onChange={onChange}
						name="password"
						value={password}
						placeholder="Password"
						type="password"
						required
					/>
					<Input
						type="submit"
						value={isLoading ? "Loading...." : "Create Account"}
					/>
				</Form>
				{error !== "" ? <Error> {error} </Error> : null}
				<Switcher>
					Already have an account?{""}
					<Link to="/login">Log in &rsaquo;</Link>
				</Switcher>
			</Section>
		</Wrapper>
	);
}
