import { useRoutes, Navigate } from "react-router-dom";

import DefaultLayout from "@/components/layout/default";
import type { FC } from "react";
import HomePage from "@/pages/home";
import TncPage from "@/pages/tnc";
import SouthPage from "@/pages/bet/south";
import CentralPage from "@/pages/bet/central";
import NorthPage from "@/pages/bet/north";

export const RouterCustom: FC = () => {
	const routes = useRoutes([
		{
			path: "/",
			element: <DefaultLayout />,
			children: [
				{ path: "", element: <HomePage /> },
				{ path: "tnc", element: <TncPage /> },
			],
		},
		{
			path: "/bet/",
			element: <DefaultLayout />,
			children: [
				{ path: "south", element: <SouthPage /> },
				{ path: "central", element: <CentralPage /> },
				{ path: "north", element: <NorthPage /> },
			],
		},

		{ path: "*", element: <Navigate to="/" replace /> },
	]);
	return routes;
};
