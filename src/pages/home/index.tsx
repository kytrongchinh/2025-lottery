import { useEffect, useState, type FC } from "react";
import img_home from "@/assets/home.png";
import "./home.scss";
import { NavLink } from "react-router-dom";
import myapi from "@/services/myapi";
import type { CommonFields } from "@/types/interface";
import { loadImage } from "@/utils/base";
const HomePage: FC = () => {
	const [banner, setBanner] = useState<CommonFields>({})
	const loadBanner = async () => {
		const mdata = await myapi.getBanner("home");
		if (mdata?.data) {
			setBanner(mdata?.data)
		}
	}
	useEffect(() => {
		loadBanner();
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
			<NavLink
				to="/bet/south"
				className="blink-button flex items-center justify-center absolute">
				Join Now
			</NavLink>
		</div>
	);
};

export default HomePage;
