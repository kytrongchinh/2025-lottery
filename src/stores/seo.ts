import { atom } from "recoil";

export const seoAtom = atom({
	key: "SEO",
	default: {
		title: "Lucky Lotto",
		description: "",
		key_word: "",
		type: ``,
		thumb: ``,
	},
});
