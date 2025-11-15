import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import CurrentTime from "./CurrentTime";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NavBar = () => {
	const navigate = useNavigate();
	const [openMenu, setOpenMenu] = useState(false);
	return (
		// <div className="w-full bg-amber-300">
		// 	<div className="mx-auto flex justify-between items-center px-4">
		// 		<div className="logo py-1">
		// 			<div
		// 				className="w-16 h-16 overflow-hidden rounded-full cursor-pointer"
		// 				onClick={() => navigate("/", { replace: true })}>
		// 				<img
		// 					src={logo}
		// 					alt=""
		// 					className="w-full h-full object-cover"
		// 				/>
		// 			</div>
		// 		</div>

		// 		<div className="menu  flex gap-4">
		// 			<NavLink
		// 				to={"/bet/north"}
		// 				className={({ isActive }) =>
		// 					`text-[#695D45] py-2 px-9 rounded-md hover:bg-gray-200 ${
		// 						isActive
		// 							? "bg-gray-300 font-bold text-black"
		// 							: ""
		// 					} pointer-events-none opacity-50`
		// 				}>
		// 				Miền Bắc
		// 			</NavLink>
		// 			<NavLink
		// 				to={"/bet/central"}
		// 				className={({ isActive }) =>
		// 					`text-[#695D45] py-2 px-9 rounded-md hover:bg-gray-200 ${
		// 						isActive
		// 							? "bg-gray-300 font-bold text-black"
		// 							: ""
		// 					} pointer-events-none opacity-50`
		// 				}>
		// 				Miền Trung
		// 			</NavLink>
		// 			<NavLink
		// 				to={"/bet/south"}
		// 				className={({ isActive }) =>
		// 					`text-[#695D45] py-2 px-9 rounded-md hover:bg-gray-200 ${
		// 						isActive
		// 							? "bg-gray-300 font-bold text-black"
		// 							: ""
		// 					}`
		// 				}>
		// 				Miền Nam
		// 			</NavLink>
		// 		</div>

		// 		<div className="bg-amber-50 px-5 py-2 rounded-md time text-lg font-bold">
		// 			<CurrentTime />
		// 		</div>
		// 	</div>
		// </div>

		<div className="w-full bg-amber-300">
			{/* HEADER WRAP */}
			<div className="mx-auto flex justify-between items-center px-4 py-2">
				{/* LOGO */}
				<div className="logo">
					<div
						className="w-14 h-14 overflow-hidden rounded-full cursor-pointer"
						onClick={() => navigate("/", { replace: true })}>
						<img
							src={logo}
							alt="logo"
							className="w-full h-full object-cover"
						/>
					</div>
				</div>

				{/* MENU PC */}
				<div className="hidden md:flex menu gap-4">
					<NavLink
						to="/bet/north"
						className={({ isActive }) =>
							`text-[#695D45] py-2 px-6 rounded-md hover:bg-gray-200 ${
								isActive
									? "bg-gray-300 font-bold text-black"
									: ""
							} pointer-events-none opacity-50`
						}>
						Miền Bắc
					</NavLink>

					<NavLink
						to="/bet/central"
						className={({ isActive }) =>
							`text-[#695D45] py-2 px-6 rounded-md hover:bg-gray-200 ${
								isActive
									? "bg-gray-300 font-bold text-black"
									: ""
							} pointer-events-none opacity-50`
						}>
						Miền Trung
					</NavLink>

					<NavLink
						to="/bet/south"
						className={({ isActive }) =>
							`text-[#695D45] py-2 px-6 rounded-md hover:bg-gray-200 ${
								isActive
									? "bg-gray-300 font-bold text-black"
									: ""
							}`
						}>
						Miền Nam
					</NavLink>
				</div>

				{/* TIME (PC ONLY) */}
				<div className="hidden md:block bg-amber-50 px-5 py-2 rounded-md time text-lg font-bold">
					<CurrentTime />
				</div>

				{/* ICON MENU (MOBILE) */}
				<button
					className="md:hidden p-2"
					onClick={() => setOpenMenu(!openMenu)}>
					{openMenu ? <X size={28} /> : <Menu size={28} />}
				</button>
			</div>

			{/* MOBILE DROPDOWN MENU */}
			{openMenu && (
				<div className="md:hidden bg-amber-200 px-4 pb-4 space-y-2 animate-slideDown">
					<NavLink
						to="/bet/north"
						className="block bg-white rounded px-4 py-3 text-[#695D45] opacity-50 pointer-events-none"
						onClick={() => setOpenMenu(false)}>
						Miền Bắc
					</NavLink>

					<NavLink
						to="/bet/central"
						className="block bg-white rounded px-4 py-3 text-[#695D45] opacity-50 pointer-events-none"
						onClick={() => setOpenMenu(false)}>
						Miền Trung
					</NavLink>

					<NavLink
						to="/bet/south"
						className="block bg-white rounded px-4 py-3 text-[#695D45]"
						onClick={() => setOpenMenu(false)}>
						Miền Nam
					</NavLink>

					<div className="bg-amber-50 rounded px-4 py-3 text-lg font-bold">
						<CurrentTime />
					</div>
				</div>
			)}
		</div>
	);
};
export default NavBar;
