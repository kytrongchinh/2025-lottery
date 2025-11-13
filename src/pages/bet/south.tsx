import Center from "@/components/Container/Center";
import LeftSidebar from "@/components/Container/LeftSidebar";
import RightSiderbar from "@/components/Container/RightSidebar";
import type { FC } from "react";
import "./bet.scss";
const SouthPage: FC = () => {
	return (
		<div className="m-container w-full min-h-screen bg-gray-100 p-4">
			{/* <div className="max-w-[1400px] mx-auto flex gap-4"> */}
			<div
				className="max-w-[1400px] mx-auto grid gap-4
    grid-cols-1          /* Mobile: 1 cột */
    md:grid-cols-[260px_1fr]   /* Tablet: Sidebar + Center */
    lg:grid-cols-[260px_1fr_260px]  /* Desktop: 3 cột */
  ">
				<LeftSidebar />
				<Center />
				<RightSiderbar />
			</div>
		</div>
	);
};

export default SouthPage;
