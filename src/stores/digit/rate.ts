import type { CommonFields } from "@/types/interface";
import { atom, selector } from "recoil";
import { authAtom } from "../auth";
import { digitAtom } from "./digit";

export const rateAtom = atom<CommonFields>({
    key: "rateAtom",
    default: selector({
        key: "rateSelect",
        get: ({ get }) => get(rateSelector),
    }),
});

export const rateSelector = selector<{ rate: number, level: string, type: string }>({
    key: "rateSelector",
    get: async ({ get }) => {
        const digit = get(digitAtom);
        const auth = get(authAtom) as CommonFields;
        const url_api = import.meta.env.VITE_MY_API_URL + "/rate";
        const res = await fetch(`${url_api}?digit=${digit.type}`, {
            method: "GET",
            headers: {
                "x-verify-token": import.meta.env.VITE_MY_VERIFY_TOKEN || "sh05GbVwrIqc4wxFaMr5hbk",
                "x-login-token": auth?.access_token,
            },
        });
        const data = await res.json();
        if (data?.status == 200 && data?.result?.data) {
            const my_data = data?.result?.data;
            return { rate: my_data?.rate, level: my_data?.level, type: my_data?.type };
        } else {
            return { rate: 0, level: "", type: "" };
        }
    },
});

export const rateOnlySelector = selector<number>({
    key: "rateOnlySelector",
    get: ({ get }) => {
        const { rate } = get(rateSelector); // ✅ OK
        return rate;
    },
});
