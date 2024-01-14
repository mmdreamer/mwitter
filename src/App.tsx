import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import styled, { createGlobalStyle } from "styled-components";
import "./styles/reset.css";
import LoadingScreen from "./components/loading-screen";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<ProtectedRoute>
				<Layout />
			</ProtectedRoute>
		),
		children: [
			{
				path: "",
				element: <Home />,
			},
			{
				path: "profile",
				element: <Profile />,
			},
		],
	},
	//Login 안했을때
	{
		path: "login",
		element: <Login />,
	},
	{
		path: "create-account",
		element: <CreateAccount />,
	},
]);

const GlobalStyles = createGlobalStyle`
  *{
	box-sizing:border-box
	}
	body{
	background-color: #fff;
	color:#333;
	font-family: 'Noto Sans KR', sans-serif;
}
`;

const Wrapper = styled.div`
	display: flex;
	height: 100vh;
	justify-content: center;
`;

function App() {
	const [isLoading, setLoading] = useState(true);
	const init = async () => {
		//wait for firebase
		await auth.authStateReady();

		//setTimeout(() => setIsLoading(false), 2000);
		setLoading(false);
	};

	useEffect(() => {
		init();
	}, []);

	return (
		<Wrapper>
			<GlobalStyles />
			{isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
		</Wrapper>
	);
}

export default App;
