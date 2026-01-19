import { useEffect, useState, type FC } from "react";
import img_home from "@/assets/home.png";
import "./home.scss";
import { NavLink } from "react-router-dom";
import myapi from "@/services/myapi";
import type { CommonFields } from "@/types/interface";
import { loadImage } from "@/utils/base";
import { useRecoilState } from "recoil";
import { publisherAtom } from "@/stores/digit/publisher";
const HomePage: FC = () => {
	const [banner, setBanner] = useState<CommonFields>({})
	const [schedules, setSchedules] = useState<CommonFields[]>([]);
	const [, setPublisher] = useRecoilState(publisherAtom);
	const loadBanner = async () => {
		const mdata = await myapi.getBanner("home");
		if (mdata?.data) {
			setBanner(mdata?.data)
		}
	}
	const loadPublisher = async () => {
		const schedules = await myapi.getScheduleToday();
		if (schedules?.data) {
			setSchedules(schedules?.data?.schedule);
			const publisher = schedules?.data?.schedule?.[0]?.publisher;

			const result = publisher.map((item: CommonFields) => ({
				value: item?.name,
				label: item?.name,
				name: item?.name,
				slug: item?.slug,
				date: item?.date,
				region_name: item?.region_name,
				timeClose: item?.timeClose,
			}));
			setPublisher(result);

		}
	}
	useEffect(() => {
		loadBanner();
		loadPublisher();
	}, [])
	return (
		<div className=" w-full min-h-screen relative">
			<div className="img">
				<img
					src={loadImage(banner?.image) || img_home}
					alt=""
					className="absolute inset-0 w-full h-full object-cover"
				/>
			</div>
			<div className="flex items-center justify-center absolute left-80 top-10">
				<h4 className="text-5xl text-amber-300">20/12/2023</h4>
			</div>
			<div className="box-button flex items-center justify-center absolute gap-4">
				{schedules.length > 0 && schedules.map((schedule, index) => {
					return <NavLink
						key={`home-${index}`}
						to={`/bet/south?slug=${schedule?.publisher_slug}`}
						onClick={() => {
							const result = schedule?.publisher?.map((item: CommonFields) => ({
								value: item?.name,
								label: item?.name,
								name: item?.name,
								slug: item?.slug,
								date: item?.date,
								region_name: item?.region_name,
								timeClose: item?.timeClose,
							}));
							setPublisher(result);
						}}
						className={`blink-button ${index == 0 ? "green" : index == 1 ? "red" : "purple"}`}>
						{schedule?.publisher_name}
					</NavLink>
				})}
			</div>

		</div>
	);
};

export default HomePage;
