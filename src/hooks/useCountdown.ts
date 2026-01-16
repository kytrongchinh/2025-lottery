import _ from "lodash";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

type Countdown = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
};

export function useCountdown(targetDate: string | Date): Countdown {
    const target = dayjs(targetDate).tz("Asia/Ho_Chi_Minh");

    const calc = () => {
        const now = dayjs().tz("Asia/Ho_Chi_Minh");
        const diff = target.diff(now, "second");

        if (diff <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isExpired: true,
            };
        }

        return {
            days: Math.floor(diff / 86400) || 0,
            hours: Math.floor((diff % 86400) / 3600) || 0,
            minutes: Math.floor((diff % 3600) / 60) || 0,
            seconds: diff % 60 || 0,
            isExpired: false,
        };
    };

    const [time, setTime] = useState(calc);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(calc());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return time;
}
