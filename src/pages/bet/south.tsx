import Center from "@/components/Container/Center";
import LeftSidebar from "@/components/Container/LeftSidebar";
import RightSiderbar from "@/components/Container/RightSidebar";
import { useEffect, useState, type FC } from "react";
import "./bet.scss";
import type { CommonFields } from "@/types/interface";
import myapi from "@/services/myapi";
const SouthPage: FC = () => {
	const [publishers, setPublishers] = useState<CommonFields[]>([]);
	useEffect(() => {
		const loadPublisher = async () => {
			const pls = await myapi.getPublishers("south");
			if (pls?.status == 200 && pls?.result?.data) {
				setPublishers(pls?.result?.data?.publishers);
			}
		};
		loadPublisher();
	}, []);
	return (
		<div className="m-container w-full min-h-screen bg-gray-100 p-4">
			{/* <div className="max-w-[1400px] mx-auto flex gap-4"> */}
			<div
				className="max-w-[1400px] mx-auto grid gap-4
    grid-cols-1          /* Mobile: 1 cột */
    md:grid-cols-[350px_1fr]   /* Tablet: Sidebar + Center */
    lg:grid-cols-[350px_1fr_350px]  /* Desktop: 3 cột */
  ">
				<LeftSidebar region="south" publishers={publishers} />
				<Center region="south" publishers={publishers} />
				<RightSiderbar region="south" publishers={publishers} />
			</div>
		</div>
	);
};

export default SouthPage;
