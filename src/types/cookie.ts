import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import _ from "lodash";

type CookieValue = string | number | object | any[] | null;

interface CookieOptions {
	secure?: boolean;
	httpOnly?: boolean;
	sameSite?: "strict" | "lax" | "none";
	domain?: string;
	path?: string;
}

const cookie = {
	set(key: string, data: CookieValue): void {
		const hashed = getHashedKey(key);

		const options: CookieOptions = {
			secure: true,
			httpOnly: false,
			sameSite: "strict",
			// domain: import.meta.env.VITE_COOKIES_DOMAIN,
		};

		// Env check
		if (import.meta.env.VITE_ENV !== "development") {
			// options.httpOnly = true; // cannot enable httpOnly on client
		}

		// Save data
		if (_.isArray(data) || _.isObject(data)) {
			Cookies.set(hashed, JSON.stringify(data), options);
		} else if (data !== null && data !== undefined) {
			Cookies.set(hashed, data.toString(), options);
		}
	},

	get(key: string): CookieValue {
		const hashed = getHashedKey(key);
		const raw = Cookies.get(hashed);
		if (!raw) return null;

		try {
			return JSON.parse(raw);
		} catch {
			return raw;
		}
	},

	remove(key: string): void {
		const hashed = getHashedKey(key);
		Cookies.remove(hashed, {
			path: "",
			domain: import.meta.env.VITE_COOKIES_DOMAIN,
		});
	},

	getKey(key: string): string {
		return getHashedKey(key);
	},
};

// Helper
const getHashedKey = (key: string): string => {
	const hashed = CryptoJS.SHA256(key).toString();
	return `${import.meta.env.VITE_COOKIES_KEY}_${hashed}`;
};

export default cookie;
