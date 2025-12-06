import { atom } from "recoil";
import cookieC from "@/utils/cookie";
async function initializeAdtimaAtom() {
	const userInfo = (await cookieC.get("userInfo")) || {};
	return userInfo;
}

const userAtom = atom({
	key: cookieC.getKey("userInfo"),
	default: initializeAdtimaAtom(),
});

export { userAtom };
