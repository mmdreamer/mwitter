import { Link, Outlet, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { auth } from "../firebase";

const Wrapper = styled.div`
	display: grid;
	gap: 40px;
	grid-template-columns: 1fr 2.7fr 1.3fr;
	width: 100%;
	max-width: 1200px;
	height: 100%;
	padding: 50px 0;
`;
const Menu = styled.div`
	display: flex;
	flex-direction: column;
	gap: 30px;
`;
const MenuItem = styled.div`
	text-decoration: none;
	&.home-logo {
		width: 100%;
		& img {
			width: 100%;
		}
	}
	&.btn-post {
		width: 100%;
		height: 32px;
		background-color: #fff;
		border: 1px solid #194f1d;
		border-radius: 25px;
		text-align: center;
		line-height: 32px;
		color: #194f1d;
		cursor: pointer;

		&:hover {
			background-color: #efffef;
		}
	}
	&:hover {
		opacity: 0.6;
		transition: all 0.3s;
	}
`;

const Icon = styled.div`
	position: relative;
	top: 7px;
	display: inline-block;
	height: 32px;
	width: 32px;
	border-radius: 50%;
	margin-right: 10px;
	color: #1e1e1e;
	cursor: pointer;
	svg {
		color: #1e1e1e;
		width: 30px;
		fill: #fff;
	}
	&.log-out {
		svg {
			color: #88520b;
		}
	}
`;

const SideMenu = styled.div`
	display: flex;
	flex-direction: column;
	gap: 30px;
`;

const Search = styled.input`
	width: 100%;
	padding: 15px;
	border: none;
	border-radius: 10px;
	background: #efffef;
	font-size: 14px;
	color: #1e1e1e;
	outline: none;
	&::placeholder {
		text-align: center;
	}
	&:focus {
		outline: 1px solid #ddd;
		transition: all 0.5s;
	}
`;

const Subscribe = styled.div`
	width: 100%;
	padding: 15px;
	border-radius: 15px;
	background: #fefefe;
	border: 1px solid #eee;
`;
const InnerTitle = styled.p`
	font-size: 16px;
	font-weight: 600;
	line-height: 1.4em;
	color: #1e1e1e;
`;
const InnerText = styled.p`
	margin: 15px 0;
	font-size: 12px;
`;
const InnerButton = styled.button`
	margin-right: auto;
	padding: 4px 20px;
	border: none;
	border-radius: 25px;
	background: #1e1e1e;
	text-align: center;
	color: #fff;
	cursor: pointer;
	&:hover {
		opacity: 0.8;
	}
`;
const InnerImg = styled.img`
	width: 100%;
	border-radius: 10px;
`;

const Trending = styled.div`
	width: 100%;
	padding: 15px;
	border-radius: 15px;
	background: #fefefe;
	border: 1px solid #eee;
	cursor: pointer;

	&:hover {
		opacity: 0.8;
	}
`;

const Follow = styled.div`
	width: 100%;
	padding: 15px;
	border-radius: 15px;
	background: #fefefe;
	border: 1px solid #eee;
`;
const FollowTable = styled.table`
	width: 100%;
`;

const FollowTr = styled.tr``;
const FollowTd = styled.td`
	padding: 5px;
	font-size: 12px;
	font-weight: 400;
	vertical-align: middle;

	& img {
		display: inline-block;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border:1px solid #ddd;
		background: #1e1e1e;
		vertical-align: middle;
	}
	& em {
		display: block;
		font-size: 11px;
		color: #aaa;
	}
	&.btn {text-align: right;}
	&:hover {
        opacity: 0.8;
    }&
	}
`;

export default function Layout() {
	const navigate = useNavigate();
	const onLogOut = async () => {
		const ok = confirm("Are you sure you want to log out?");
		if (ok) {
			auth.signOut();
			navigate("/login");
		}
	};
	return (
		<Wrapper>
			<Menu>
				<Link to="/">
					<MenuItem className="home-logo">
						<img src="images/logo.jpg" alt="Mwitter Logo" />
					</MenuItem>
				</Link>

				<Link to="/">
					<MenuItem>
						<Icon>
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
									d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
								/>
							</svg>{" "}
						</Icon>
						Home
					</MenuItem>
				</Link>

				<Link to="/">
					<MenuItem>
						<Icon>
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
									d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
								/>
							</svg>
						</Icon>
						Explore
					</MenuItem>
				</Link>

				<Link to="">
					<MenuItem>
						<Icon>
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
									d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
								/>
							</svg>
						</Icon>
						Popular
					</MenuItem>
				</Link>

				<Link to="/profile">
					<MenuItem>
						<Icon>
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
									d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
								/>
							</svg>
						</Icon>
						Profile
					</MenuItem>
				</Link>

				<Link to="">
					<MenuItem>
						<Icon>
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
									d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
								/>
							</svg>
						</Icon>
						Notification
					</MenuItem>
				</Link>

				<Link to="">
					<MenuItem>
						<Icon>
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
									d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
								/>
							</svg>
						</Icon>
						More
					</MenuItem>
				</Link>

				<MenuItem>
					<Icon onClick={onLogOut} className="log-out">
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
								d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
							/>
						</svg>
					</Icon>
					Logout
				</MenuItem>

				<Link to="/">
					<MenuItem className="btn-post">Post</MenuItem>
				</Link>
			</Menu>

			<Outlet />

			<SideMenu>
				<Search type="search" placeholder="Search a keyword" />
				<Subscribe>
					<InnerTitle>Subscribe to Premium</InnerTitle>
					<InnerText>
						Subscribe to unlock new features and if eligible, receive a share of
						ads revenue
					</InnerText>
					<InnerButton>Subscribe</InnerButton>
				</Subscribe>
				<Trending>
					<InnerTitle>Hot Trending in the world</InnerTitle>
					<InnerText>
						Discover the freshest eco-friendly trends creating ripples
						worldwide. Stay ahead in the eco-conscious movement and join the
						global conversation for a sustainable future!
					</InnerText>
					<InnerImg src="/images/trending.svg" />
				</Trending>
				<Follow>
					<InnerTitle>Who to follow</InnerTitle>
					<FollowTable>
						<tbody>
							<FollowTr>
								<FollowTd>
									<img src="/images/nomad.jpg" alt="Nomad Coders" />
								</FollowTd>
								<FollowTd>
									Nomad Coders <em>@nomadcoder</em>
								</FollowTd>
								<FollowTd className="btn">
									<InnerButton>Follow</InnerButton>
								</FollowTd>
							</FollowTr>
							<FollowTr>
								<FollowTd>
									<img src="/images/sponge.jpg" alt="Developer Meme" />
								</FollowTd>
								<FollowTd>
									No More Coding<em>@nomorecoding</em>
								</FollowTd>
								<FollowTd className="btn">
									<InnerButton>Follow</InnerButton>
								</FollowTd>
							</FollowTr>
							<FollowTr>
								<FollowTd>
									<img src="/images/error.jpg" alt="Error" />
								</FollowTd>
								<FollowTd>
									No More Error <em>@nomoreerror</em>
								</FollowTd>
								<FollowTd className="btn">
									<InnerButton>Follow</InnerButton>
								</FollowTd>
							</FollowTr>
						</tbody>
					</FollowTable>
				</Follow>
			</SideMenu>
		</Wrapper>
	);
}
