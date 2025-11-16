import { atom, selector } from "recoil";

export type BetState = {
	mount: number; // Tiền cược
	rate: number; // Tỉ lệ cược
	numbers: number; // Bộ số đã chọn
};

export const betAtom = atom<BetState>({
	key: "betAtom",
	default: {
		mount: 0,
		rate: 70,
		numbers: 0,
	},
});

export const betComputed = selector({
	key: "betComputed",
	get: ({ get }) => {
		const { mount, numbers, rate } = get(betAtom);

		const totalBet = mount * 1000 * numbers;
		const expectedWin = mount * 1000 * rate * numbers;

		return {
			count: numbers,
			totalBet,
			expectedWin,
		};
	},
});
