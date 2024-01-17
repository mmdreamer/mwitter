import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
	Error,
	Input,
	Form,
	Switcher,
	Title,
	Section,
	Wrapper,
	Subtitle,
	Strong,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";

export default function Login() {
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {
			target: { name, value },
		} = e;
		if (name === "email") {
			setEmail(value);
		} else if (name === "password") {
			setPassword(value);
		}
	};
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		if (isLoading || email === "" || password === "") return;
		try {
			//no empty inputs
			setLoading(true);
			await signInWithEmailAndPassword(auth, email, password);
			navigate("/");
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
		<Wrapper className="grid-wrapper">
			<Section>
				<img
					className="bg-img"
					src="images/Home2.jpg"
					alt="Login page home image"
				/>
			</Section>
			<Section>
				<Title>
					Welcome back!
					<br /> We're glad to see you.
				</Title>
				<Subtitle>Log into Mwitter now.</Subtitle>
				<GithubButton />
				<Strong> or </Strong>
				<Form onSubmit={onSubmit}>
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
					<Input type="submit" value={isLoading ? "Loading...." : "Login"} />
				</Form>
				{error !== "" ? <Error> {error} </Error> : null}
				<Switcher>
					Don't have an account?{""}
					<Link to="/create-account">Create your account &rsaquo;</Link>
				</Switcher>
			</Section>
		</Wrapper>
	);
}
