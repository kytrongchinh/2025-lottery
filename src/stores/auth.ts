import { atom } from "recoil";
import cookieC from "@/utils/cookie";
async function initializeAdtimaAtom() {
	const authInfo = (await cookieC.getKey("authInfo")) || null;
	return authInfo;
}

const authAtom = atom({
	key: cookieC.getKey("authInfo"),
	default: initializeAdtimaAtom(),
});

export { authAtom };
