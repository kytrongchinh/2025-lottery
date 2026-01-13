import myapi from "@/services/myapi";
import { loadingAtom } from "@/stores";
import { scheduleAtom } from "@/stores/digit/schedule";
import type { CommonFields } from "@/types/interface";
import { formatTime } from "@/utils/time";
import { useEffect, useState, type FC } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { folkGameData } from "./folkGame.config";
import { BetSection } from "./BetSection";


const FolkGamePage: FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const [publishers, setPublishers] = useState<CommonFields[]>([]);
	const [publisher, setPublisher] = useState<CommonFields>({});
	const [, setLoading] = useRecoilState(loadingAtom);
	const slug = params?.slug;
	const [schedule, setSchedule] = useRecoilState<CommonFields>(scheduleAtom);
	const loadSchedule = async (slug: string) => {
		try {
			const schedule = await myapi.getNextSchedule(slug || "");
			if (schedule?.status == 200 && schedule?.result?.data) {
				setSchedule(schedule?.result?.data);
			}
		} catch (error) { }
	};



	useEffect(() => {
		loadPublisher();
	}, [slug]);
	const loadPublisher = async () => {
		try {
			const items = await myapi.getPublishers("");
			if (items?.status == 200 && items?.result?.data) {
				const pblsers = items?.result?.data?.publishers;
				setPublishers(pblsers);
				if (slug) {
					const p = pblsers.filter((pl: CommonFields) => pl?.slug == slug);
					if (p.length > 0) {
						setPublisher(p[0]);
						loadSchedule(slug);
					}
				} else {
					setPublisher(pblsers[0]);
					loadSchedule(pblsers[0]?.slug);
				}
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
					lg:grid-cols-[260px_1fr_260px]  /* Desktop: 3 cột */"
			>
				<div className="w-full md:w-[260px]  px-0 flex flex-col gap-4">
					<div className="flex flex-col gap-2 text-[#2A5381] box-number w-full shadow-[0_0_15px_rgb(6_80_254)] bg-white  rounded-lg p-4 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
						{publishers?.length > 0 &&
							publishers.map((pls, index) => (
								<NavLink
									to={`/folkgame/${pls?.slug}`}
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
						<h3 className="text-center font-bold pt-3">Folk Game</h3>
						<div className="text-center mb-3 font-semibold text-sm ">{publisher?.name}</div>
						<h2 className="text-center font-semibold mb-4">Lượt Xổ Ngày {formatTime(schedule?.date, "DD/MM/YYYY")}</h2>
						{folkGameData.map((section, index) => (
							<BetSection
								key={index}
								label={section.label}
								cols={section.cols}
								items={section.items}
							/>
						))}

					</div>
				</div>
			</div>
		</div>
	);
};

export default FolkGamePage;
