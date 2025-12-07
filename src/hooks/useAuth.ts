import { useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "@/stores/user";
import myapi from "@/services/myapi";
import { authAtom } from "@/stores/auth";
import cookieC from "@/utils/cookie";

const useAuth = () => {
	const navigate = useNavigate();
	const [user, setUser] = useRecoilState(userAtom);
	const [, setAuth] = useRecoilState(authAtom);
	const [isProcessing, setIsProcessing] = useState(false);

	/** Memoized function to update processing state */
	const setLoadProcess = useCallback((stateValue = false) => {
		setIsProcessing(stateValue);
	}, []);

	/** Memoized user authentication handler */
	const handleLogin = useCallback(
		async (username: string = "", password: string = "", to: string = "") => {
			if (isProcessing) return { success: false, message: "Processing..." };

			try {
				setLoadProcess(true);

				const login = await myapi.login({ username, password });

				if (login?.data) {
					setAuth(login.data);
					cookieC.set("authInfo", login.data);

					const u = await myapi.getUser(login.data.access_token);
					if (u?.data) {
						setUser(u.data);
						cookieC.set("userInfo", u.data);
					}
				}

				if (to) navigate(to, { replace: true });

				return {
					success: true,
					message: "Login successful",
					data: login?.data,
				};
			} catch (error: any) {
				console.error("handleLogin error:", error);

				setAuth({});
				setUser({});
				cookieC.remove("authInfo");
				cookieC.remove("userInfo");

				return {
					success: false,
					message: error?.response?.data?.message || "Login failed",
				};
			} finally {
				setLoadProcess(false);
			}
		},
		[isProcessing, setUser, setAuth, navigate]
	);

	/** Memoized logout handler */
	const handleLogout = useCallback(async () => {
		try {
			setAuth({});
			setUser({});
			cookieC.remove("authInfo");
			cookieC.remove("userInfo");

			return navigate("/", { replace: true });
		} catch (error) {
			console.error("handleLogout error:", error);
		}
	}, [setAuth, setUser, navigate]);

	/** Memoize the user data to prevent unnecessary re-renders */
	const memoizedUser = useMemo(() => user, [user]);

	return { handleLogin, handleLogout, isProcessing, user: memoizedUser };
};

export default useAuth;
