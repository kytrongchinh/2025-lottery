import { useEffect, useState } from "react";

export default function CurrentTime() {
	const [time, setTime] = useState<string>("");

	useEffect(() => {
		// Hàm cập nhật thời gian
		const updateTime = () => {
			const now = new Date();
			const formatted = now.toLocaleTimeString("vi-VN", {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			});
			setTime(formatted);
		};

		updateTime(); // gọi ngay khi load
		const interval = setInterval(updateTime, 1000); // cập nhật mỗi giây

		return () => clearInterval(interval); // clear khi unmount
	}, []);

	return <div className="text-lg font-semibold font-mono min-w-[4ch] text-right">🕒 {time}</div>;
}
