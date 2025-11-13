import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import CurrentTime from "./CurrentTime";
const NavBar = () => {
	const navigate = useNavigate();
	return (
		<div className="w-full bg-amber-300">
			<div className="mx-auto flex justify-between items-center px-4">
				<div className="logo py-1">
					<div
						className="w-16 h-16 overflow-hidden rounded-full cursor-pointer"
						onClick={() => navigate("/", { replace: true })}>
						<img
							src={logo}
							alt=""
							className="w-full h-full object-cover"
						/>
					</div>
				</div>

				<div className="menu  flex gap-4">
					<NavLink
						to={"/bet/north"}
						className={({ isActive }) =>
							`text-[#695D45] py-2 px-9 rounded-md hover:bg-gray-200 ${
								isActive
									? "bg-gray-300 font-bold text-black"
									: ""
							} pointer-events-none opacity-50`
						}>
						Miền Bắc
					</NavLink>
					<NavLink
						to={"/bet/central"}
						className={({ isActive }) =>
							`text-[#695D45] py-2 px-9 rounded-md hover:bg-gray-200 ${
								isActive
									? "bg-gray-300 font-bold text-black"
									: ""
							} pointer-events-none opacity-50`
						}>
						Miền Trung
					</NavLink>
					<NavLink
						to={"/bet/south"}
						className={({ isActive }) =>
							`text-[#695D45] py-2 px-9 rounded-md hover:bg-gray-200 ${
								isActive
									? "bg-gray-300 font-bold text-black"
									: ""
							}`
						}>
						Miền Nam
					</NavLink>
				</div>

				<div className="bg-amber-50 px-5 py-2 rounded-md time text-lg font-bold">
					<CurrentTime />
				</div>
			</div>
		</div>
	);
};
export default NavBar;
