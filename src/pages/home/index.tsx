import type { FC } from "react";
import img_home from "@/assets/home.png";
import "./home.scss";
import { NavLink } from "react-router-dom";
const HomePage: FC = () => {
	return (
		<div className=" w-full min-h-screen relative">
			<div className="img">
				<img
					src={img_home}
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
