import { atom, DefaultValue, selector } from "recoil";

export type SelectedBet = {
    name: string;
    rate: number;
};
export type FolkState = {
    amount: number; // Tiền cược
    selected: SelectedBet[]; // Tỉ lệ cược
};

export const folkGameAtom = atom<FolkState>({
    key: "folkGameAtom",
    default: {
        amount: 0,
        selected: [],
    },

});

export const folkComputed = selector({
    key: "folkComputed",
    get: ({ get }) => {
        const { amount, selected } = get(folkGameAtom);
        // Tổng tiền cược
        const totalBet = amount * selected.length;

        // Tổng tiền thắng kỳ vọng
        const expectedWin = selected.reduce((sum, item) => {
            return sum + amount * item?.rate;
        }, 0);

        return {
            totalBet,
            expectedWin,
        };


    },
});
