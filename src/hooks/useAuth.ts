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
			if (isProcessing) return;
			try {
				setLoadProcess(true);
				const data_login = {
					username: username,
					password: password,
				};
				const login = await myapi.login(data_login);
				if (login?.data) {
					setAuth(login?.data);
					cookieC.set("authInfo", login?.data);
					const u = await myapi.getUser(login?.data?.access_token);
					if (u?.data) {
						setUser(u?.data);
						cookieC.set("userInfo", u?.data);
					}
				}
				// Determine the redirect route
				let redirectTo = to;
				if (redirectTo) {
					navigate(redirectTo, { replace: true });
				}
			} catch (error) {
				console.error("handleLogin error:", error);

				setAuth(null);
				setUser(null);
				cookieC.remove("authInfo");
				cookieC.remove("userInfo");
			} finally {
				setLoadProcess(false);
			}
		},
		[isProcessing, setUser, setAuth, navigate]
	);

	/** Memoized logout handler */
	const handleLogout = useCallback(async () => {
		try {
			setAuth(null);
			setUser(null);
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
