import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import CurrentTime from "./CurrentTime";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import type { CommonFields } from "@/types/interface";
import guestAvatar from "@/assets/guest.jpg";
import defaultAvatar from "@/assets/default.jpg";
import _ from "lodash";
import DarkModeToggle from "../DarkModeToggle";

const NavBar = () => {
	const navigate = useNavigate();
	const [openMenu, setOpenMenu] = useState(false);
	const { user } = useAuth() as CommonFields;
	console.log("user", user);
	const { handleLogout } = useAuth();

	return (
		<div className="w-full bg-amber-300 relative">
			<div className="mx-auto flex justify-between items-center px-4 py-2">
				<div className="logo">
					<div className="w-14 h-14 overflow-hidden rounded-full cursor-pointer" onClick={() => navigate("/", { replace: true })}>
						<img src={logo} alt="logo" className="w-full h-full object-cover" />
					</div>
				</div>

				<div className="hidden md:flex menu gap-5">
					<NavLink
						to="/bet/north"
						className={({ isActive }) =>
							`text-[#695D45] py-2 px-6 rounded-md hover:bg-gray-200 ${isActive ? "bg-gray-300 font-bold text-black" : ""} pointer-events-none opacity-50`
						}
					>
						Miền Bắc
					</NavLink>

					<NavLink
						to="/bet/central"
						className={({ isActive }) =>
							`text-[#695D45] py-2 px-6 rounded-md hover:bg-gray-200 ${isActive ? "bg-gray-300 font-bold text-black" : ""} pointer-events-none opacity-50`
						}
					>
						Miền Trung
					</NavLink>

					<NavLink
						to="/bet/south"
						className={({ isActive }) => `text-[#695D45] py-2 px-6 rounded-md hover:bg-gray-200 ${isActive ? "bg-gray-300 font-bold text-black" : ""}`}
					>
						Miền Nam
					</NavLink>
				</div>

				<div className="hidden md:block relative group ml-4">
					<div className="flex flex-row items-center cursor-pointer">
						<div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white">
							<img src={user?.avatar || !_.isEmpty(user) ? defaultAvatar : guestAvatar} alt="avatar" className="w-full h-full object-cover" />
						</div>
						<p className="px-1 font-bold text-[#695D45] mt-1">{user?.name}</p>
					</div>

					<div
						className="absolute right-0 mt-2 bg-white shadow rounded-md w-40 py-2 z-50
					opacity-0 invisible group-hover:opacity-100 group-hover:visible
					transition-all duration-200"
					>
						{!_.isEmpty(user) && (
							<>
								<button onClick={() => navigate("/history")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
									History
								</button>

								<button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
									Logout
								</button>
							</>
						)}
						{_.isEmpty(user) && (
							<>
								<button onClick={() => navigate("/login")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
									Login
								</button>
							</>
						)}
					</div>
				</div>

				<div className="hidden md:block bg-amber-50 px-5 py-2 rounded-md time text-lg font-bold">
					<CurrentTime />
				</div>
				<div className="hidden md:block">
					<DarkModeToggle />
				</div>

				<button className="md:hidden p-2" onClick={() => setOpenMenu(!openMenu)}>
					{openMenu ? <X size={28} /> : <Menu size={28} />}
				</button>
			</div>

			{openMenu && (
				<div className="md:hidden bg-amber-200 px-4 pb-4 space-y-2 animate-slideDown">
					<div className="bg-white rounded px-4 py-3 flex items-center gap-3">
						<img src={user?.avatar || !_.isEmpty(user) ? defaultAvatar : guestAvatar} className="w-12 h-12 rounded-full" />
						<div>
							<p className="font-bold">{user?.name}</p>
						</div>
					</div>

					<NavLink to="/bet/north" className="block bg-white rounded px-4 py-3 text-[#695D45] opacity-50 pointer-events-none" onClick={() => setOpenMenu(false)}>
						Miền Bắc
					</NavLink>

					<NavLink to="/bet/central" className="block bg-white rounded px-4 py-3 text-[#695D45] opacity-50 pointer-events-none" onClick={() => setOpenMenu(false)}>
						Miền Trung
					</NavLink>

					<NavLink to="/bet/south" className="block bg-white rounded px-4 py-3 text-[#695D45]" onClick={() => setOpenMenu(false)}>
						Miền Nam
					</NavLink>
					{!_.isEmpty(user) && (
						<>
							<button
								onClick={() => {
									navigate("/history");
									setOpenMenu(false);
								}}
								className="block w-full text-left bg-white rounded px-4 py-3 hover:bg-gray-100"
							>
								History
							</button>

							<button
								onClick={() => {
									handleLogout();
									setOpenMenu(false);
								}}
								className="block w-full text-left bg-white rounded px-4 py-3 hover:bg-gray-100 text-red-600"
							>
								Logout
							</button>
						</>
					)}

					{_.isEmpty(user) && (
						<>
							<button
								onClick={() => {
									navigate("/login");
									setOpenMenu(false);
								}}
								className="block w-full text-left bg-white rounded px-4 py-3 hover:bg-gray-100"
							>
								Login
							</button>
						</>
					)}

					<div className="bg-amber-50 rounded px-4 py-3 text-lg font-bold">
						<CurrentTime />
					</div>
				</div>
			)}
		</div>
	);
};

export default NavBar;
