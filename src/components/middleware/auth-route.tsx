import _ from "lodash";
import { useEffect, type FC, type JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthRouteProps {
	user: any;
	children: JSX.Element;
}

const AuthRoute: FC<AuthRouteProps> = ({ user, children }) => {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (_.isEmpty(user)) {
			navigate("/login", { state: { from: location }, replace: true });
		}
	}, [location.pathname]);
	return <>{children}</>;
};

export default AuthRoute;
