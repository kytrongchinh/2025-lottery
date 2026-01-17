import myapi from "@/services/myapi";
import { loadingAtom } from "@/stores";
import type { CommonFields } from "@/types/interface";
import { useEffect, useState, type FC } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
const FaqPage: FC = () => {
	const navigate = useNavigate();
	const [publishers, setPublishers] = useState<CommonFields[]>([]);
	const [publisher, setPublisher] = useState<CommonFields>({});
	const [pageNum, setPageNum] = useState(0);
	const [, setLoading] = useRecoilState(loadingAtom);
	useEffect(() => {
		loadPublisher();
	}, []);
	const loadPublisher = async () => {
		try {
			const items = await myapi.getPublishers("");
			if (items?.status == 200 && items?.result?.data) {
				const pblsers = items?.result?.data?.publishers;
				setPublishers(pblsers);
				setPublisher(pblsers[0]);
			}
		} catch (error) { }
	};
	return (
		<div className="m-container w-full min-h-screen bg-gray-100 p-4 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
			{/* <div className="max-w-[1400px] mx-auto flex gap-4"> */}
			<div
				className="max-w-[1400px] mx-auto grid gap-4
    grid-cols-1          /* Mobile: 1 cột */
    md:grid-cols-[260px_1fr]   /* Tablet: Sidebar + Center */
    lg:grid-cols-[260px_1fr]  /* Desktop: 3 cột */
  "
			>
				<div className="w-full md:w-[260px]  px-0 flex flex-col gap-4">
					<div className="flex flex-col gap-2 text-[#2A5381] box-number w-full shadow-[0_0_15px_rgb(6_80_254)] bg-white  rounded-lg p-4 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
						{publishers?.length > 0 &&
							publishers.map((pls, index) => (
								<NavLink
									to={`/publisher/${pls?.slug}`}
									key={index}
									className={`border bg-white dark:bg-[rgb(3,3,40)] dark:text-amber-50 dark:hover:bg-indigo-800 py-1 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer text-center${pls?.slug == publisher?.slug ? " bg-amber-400!" : ""
										}`}
								>
									{pls?.name}
								</NavLink>
							))}
					</div>
				</div>
				<div className="w-full">
					<div className="flex flex-col gap-2 text-[#2A5381] box-number w-full shadow-[0_0_15px_rgb(216_80_254)] bg-white  rounded-lg p-4 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
						<h3 className="text-center font-bold pt-3">FAQ</h3>

					</div>
				</div>
			</div>
		</div>
	);
};

export default FaqPage;
