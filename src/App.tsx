import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import { createGlobalStyle } from "styled-components";
import "./styles/reset.css";
import LoadingScreen from "./components/loading-screen";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
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
	background-color: #000;
	color:#fff;
	font-family: 'Noto Sans KR', sans-serif;
  }
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
		<>
			<GlobalStyles />
			{isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
		</>
	);
}

export default App;
