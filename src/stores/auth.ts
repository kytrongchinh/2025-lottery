import { atom } from "recoil";
import cookieC from "@/utils/cookie";
import _ from "lodash";
function initializeAdtimaAtom() {
	const authInfo = cookieC.get("authInfo");
	if (_.isObject(authInfo)) {
		return authInfo;
	} else {
		return {};
	}
}

const authAtom = atom({
	key: cookieC.getKey("authInfo"),
	default: initializeAdtimaAtom(),
});

export { authAtom };
