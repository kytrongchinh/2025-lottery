import { useEffect, type FC } from "react";
import "./login.scss";
import { useForm, type FieldErrors } from "react-hook-form";
import type { CommonForm } from "@/types/interface";
import { useRecoilState } from "recoil";
import { authAtom } from "@/stores/auth";
import { userAtom } from "@/stores/user";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import _ from "lodash";
const LoginPage: FC = () => {
	const [, setAuth] = useRecoilState(authAtom);
	const [user, setUser] = useRecoilState(userAtom);
	const navigate = useNavigate();
	const { handleLogin } = useAuth();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ shouldFocusError: true });
	useEffect(() => {
		console.log(user, "user")
		if (!_.isEmpty(user)) {
			navigate("/history", { replace: true })
		}
	}, [user])

	const onSubmit = async (data: CommonForm) => {
		try {
			const data_login = {
				username: data?.username,
				password: data?.password,
			};
			handleLogin(data?.username, data?.password, "/bet/south");
			// const login = await myapi.login(data_login);
			// if (login?.data) {
			// 	setAuth(login?.data);
			// 	cookieC.set("authInfo", login?.data);
			// 	const u = await myapi.getUser(login?.data?.access_token);
			// 	if (u?.data) {
			// 		setUser(u?.data);
			// 		cookieC.set("userInfo", u?.data);
			// 		navigate("/bet/south", { replace: true });
			// 	}
			// }
		} catch (error) { }
	};
	const onError = (e: FieldErrors) => {
		console.log(`==>`, e);
	};
	return (
		<div className="w-full min-h-screen relative login">
			<div className="">
				<div className="w-full min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[rgb(3,3,40)] dark:text-amber-50 dark:shadow-[0_0_15px_rgb(6_80_254)]">
					<div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 dark:bg-[rgb(3,3,40)] dark:text-amber-50 dark:shadow-[0_0_15px_rgb(6_80_254)]">
						<h2 className="text-2xl font-bold text-center mb-6">Login</h2>

						<div className="flex flex-col gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
								<input
									type="text"
									{...register("username", {
										required: true,
										maxLength: 30,
										minLength: 1,
										pattern: /[a-zA-Z0-9]/,
									})}
									maxLength={30}
									className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter username"
								/>
								{errors.username && <div className="text-sm text-red-500">Please enter your username</div>}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
								<input
									type="password"
									{...register("password", {
										required: true,
										maxLength: 30,
										minLength: 1,
										pattern: /[a-zA-Z0-9]/,
									})}
									className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter password"
								/>
								{errors.password && <div className="text-sm text-red-500">Please enter your password</div>}
							</div>

							<button onClick={handleSubmit(onSubmit, onError)} className="w-full py-2 mt-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
								Login
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
