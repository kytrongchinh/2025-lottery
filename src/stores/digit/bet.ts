import { atom, DefaultValue, selector } from "recoil";
import { digitAtom } from "./digit";

export type BetState = {
	amount: number; // Tiền cược
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
	effects: [
		({ setSelf, onSet, getPromise }) => {
			onSet(async () => {
				const digit = await getPromise(digitAtom);

				const rate = digit.type === 2 ? 70 : digit.type === 3 ? 90 : digit.type === 4 ? 120 : 70;

				setSelf((prev) => {
					if (prev instanceof DefaultValue) {
						return {
							mount: 0,
							numbers: 0,
							rate,
						};
					}

					return { ...prev, rate };
				});
			});
		},
	],
});

export const betComputed = selector({
	key: "betComputed",
	get: ({ get }) => {
		const { amount, numbers, rate } = get(betAtom);

		const totalBet = amount * numbers || 0;
		const expectedWin = amount * rate * numbers || 0;

		return {
			count: numbers,
			totalBet,
			expectedWin,
		};
	},
});
