import { useRoutes, Navigate } from "react-router-dom";

import DefaultLayout from "@/components/layout/default";
import type { FC } from "react";
import HomePage from "@/pages/home";
import TncPage from "@/pages/tnc";
import SouthPage from "@/pages/bet/south";
import CentralPage from "@/pages/bet/central";
import NorthPage from "@/pages/bet/north";
import LoginPage from "@/pages/login";
import PublisherPage from "@/pages/publisher";
import HistoryPage from "@/pages/history";
import AuthRoute from "@/components/middleware/auth-route";
import useAuth from "@/hooks/useAuth";
import BetDetailPage from "@/pages/history/detail";
import LevelPage from "@/pages/level";
import FolkGamePage from "@/pages/folkgame";

export const RouterCustom: FC = () => {
	const { user } = useAuth();
	const routes = useRoutes([
		{
			path: "/",
			element: <DefaultLayout />,
			children: [
				{ path: "", element: <HomePage /> },
				{ path: "tnc", element: <TncPage /> },
				{ path: "login", element: <LoginPage /> },
				{ path: "publisher", element: <PublisherPage /> },
				{ path: "level", element: <LevelPage /> },
				{ path: "publisher/:slug", element: <PublisherPage /> },
				{ path: "folkgame/:slug", element: <FolkGamePage /> },
				{
					path: "history",
					element: (
						<AuthRoute user={user}>
							<HistoryPage />
						</AuthRoute>
					),
				},
			],
		},
		{
			path: "/bet/",
			element: <DefaultLayout />,
			children: [
				{ path: "south", element: <SouthPage /> },
				{ path: "central", element: <CentralPage /> },
				{ path: "north", element: <NorthPage /> },
				{
					path: "detail/:id",
					element: (
						<AuthRoute user={user}>
							<BetDetailPage />
						</AuthRoute>
					),
				},
			],
		},

		{ path: "*", element: <Navigate to="/" replace /> },
	]);
	return routes;
};
