import { atom } from "recoil";
type NumbersType = {
	[key: `number_${number}`]: number;
};
export const digitAtom = atom({
	key: "digitAtom",
	default: {
		number: "",
		type: 2,
		numbers: {} as NumbersType,
		type_bet: "one",
	},
});
