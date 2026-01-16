import { useCountdown } from "@/hooks/useCountdown";
import myapi from "@/services/myapi";
import { publisherAtom } from "@/stores/digit/publisher";
import type { CommonFields } from "@/types/interface";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

export default function CurrentTime() {
	// const [time, setTime] = useState<string>("");
	const [targetDate, setTargetDate] = useState<string | null>(null);


	const publisher = useRecoilValue<CommonFields>(publisherAtom);
	const loadSchedule = async (slug: string) => {
		try {
			const schedule = await myapi.getNextSchedule(slug || "");
			if (schedule?.status == 200 && schedule?.result?.data) {
				const dateSet: string = `${schedule?.result?.data?.date} ${publisher?.timeClose || "16:00"}:00`
				setTargetDate(dateSet);
			}
		} catch (error) { }
	};
	useEffect(() => {
		if (publisher) {
			loadSchedule(publisher?.slug);
		}
	}, [publisher]);
	const countdown = useCountdown(targetDate || "");
	// useEffect(() => {
	// 	// Hàm cập nhật thời gian
	// 	const updateTime = () => {
	// 		const now = new Date();
	// 		const formatted = now.toLocaleTimeString("vi-VN", {
	// 			hour: "2-digit",
	// 			minute: "2-digit",
	// 			second: "2-digit",
	// 		});
	// 		setTime(formatted);
	// 	};

	// 	updateTime(); // gọi ngay khi load
	// 	const interval = setInterval(updateTime, 1000); // cập nhật mỗi giây

	// 	return () => clearInterval(interval); // clear khi unmount
	// }, []);

	return <div className="text-lg font-semibold font-mono min-w-[4ch] text-right">
		{countdown && !countdown?.isExpired &&

			<span>🕒{" "}
				{countdown?.days}d {countdown?.hours}{":"}
				{countdown?.minutes}:{countdown?.seconds}
			</span>

		}
	</div>;
}
