// Nếu route không tồn tại, chuyển về Home
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import clsx from "clsx";
import type { FC } from "react";

const DefaultLayout: FC = () => {
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>{"ADTIMA"}</title>

				<meta name="description" content={"ADTIMA"}></meta>

				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
					viewport-fit="cover"></meta>

				<meta property="og:title" content={"ADTIMA"} />
				<meta property="og:description" content={"ADTIMA"} />

				{/* <meta property="og:image" content={seo?.thumb} />
				<meta property="og:image:alt" content={seo?.thumb} />
				<meta property="og:type" content={seo?.type} /> */}
			</Helmet>
			<div className={clsx("container", location.pathname === "/" && "")}>
				<Outlet />
			</div>
		</>
	);
};

export default DefaultLayout;
