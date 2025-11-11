import { useRoutes, Navigate } from "react-router-dom";

import DefaultLayout from "@/components/layout/default";
import type { FC } from "react";
import HomePage from "@/pages/home";
import TncPage from "@/pages/tnc";

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

		{ path: "*", element: <Navigate to="/" replace /> },
	]);
	return routes;
};
