// Nếu route không tồn tại, chuyển về Home
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import clsx from "clsx";
import type { FC } from "react";
import NavBar from "./navbar";
import CommonModal from "../modals/common";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalAtom } from "@/stores/modal";
import Loading from "../base/Loading";
import { MODAL_NAME } from "@/types/contants";
import { seoAtom } from "@/stores/seo";
import ButtomMenu from "./bottombar";

const DefaultLayout: FC = () => {
	const [com_modal, setComModal] = useRecoilState(modalAtom);
	const seo = useRecoilValue(seoAtom);

	const hanldeCloseModalCommon = async () => {
		setComModal((prevState) => ({
			...prevState,
			name: MODAL_NAME.DEFAULT,
			open: false,
			modalOA: false,
			content: ``,
			imageUrl: ``,
			noted: ``,
			buttonName: ``,
		}));
	};

	const handleModalActionClick = async () => {
		setComModal((prevState) => ({
			...prevState,
			name: MODAL_NAME.DEFAULT,
			open: false,
			modalOA: false,
			content: ``,
			imageUrl: ``,
			noted: ``,
			buttonName: ``,
		}));
	};
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>{"LOTTERY 2025"}</title>

				<meta name="description" content={"LOTTERY 2025"}></meta>

				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" viewport-fit="cover"></meta>

				<meta property="og:title" content={"LOTTERY 2025"} />
				<meta property="og:description" content={"LOTTERY 2025"} />

				<meta property="og:image" content={seo?.thumb} />
				<meta property="og:image:alt" content={seo?.thumb} />
				<meta property="og:type" content={seo?.type} />
			</Helmet>
			<NavBar />
			<CommonModal
				modalIsOpen={com_modal.open}
				name={com_modal?.name}
				onClose={hanldeCloseModalCommon}
				handleModalActionClick={handleModalActionClick}
				content={com_modal?.content}
				noted={com_modal?.noted}
				buttonName={com_modal?.buttonName}
				onAction={com_modal?.handleAction}
			/>
			<Loading />
			<div className={clsx("w-full", location.pathname === "/" && "")}>
				<Outlet />
				<ButtomMenu />
			</div>
		</>
	);
};

export default DefaultLayout;
