import image_bar from "@/assets/banner_right.png";
import myapi from "@/services/myapi";
import { publisherAtom } from "@/stores/digit/publisher";
import type { CommonFields, CommonProps } from "@/types/interface";
import { formatTime } from "@/utils/time";
import { useEffect, useState, type FC } from "react";
import { NavLink } from "react-router-dom";
import { useRecoilState } from "recoil";
const labelMap: CommonFields = {
	g8: "G8",
	g7: "G7",
	g6: "G6",
	g5: "G5",
	g4: "G4",
	g3: "G3",
	g2: "G2",
	g1: "G1",
	gdb: "G.Đặc Biệt",
};
const RightSiderbar: FC<CommonProps> = (props) => {
	const [publisher, setPublisher] = useRecoilState<CommonFields>(publisherAtom);
	const [result, setResult] = useState<CommonFields>({});
	const [prizes, setPrizes] = useState<CommonFields>([]);

	useEffect(() => {
		const loadResult = async () => {
			try {
				const schedule = await myapi.getResultSchedule(publisher?.slug || "");
				if (schedule?.status == 200 && schedule?.result?.data) {
					setResult(schedule?.result?.data);
					const results = schedule?.result?.data?.results;
					const data = Object.keys(results).map((key) => {
						const item: CommonFields = {
							label: labelMap[key],
							values: results[key],
						};

						if (key === "gdb") {
							item["special"] = true;
						}

						return item;
					});
					setPrizes(data);
				}
			} catch (error) {}
		};
		loadResult();
	}, [publisher]);
	// const data = [
	// 	{ label: "G8", values: ["111"], special: true },
	// 	{ label: "G7", values: ["111"] },
	// 	{ label: "G6", values: ["111", "111", "111"] },
	// 	{ label: "G5", values: ["111"] },
	// 	{
	// 		label: "G4",
	// 		values: ["111", "111", "111", "111", "111", "111", "111"],
	// 	},
	// 	{ label: "G3", values: ["111", "111"] },
	// 	{ label: "G2", values: ["111"] },
	// 	{ label: "G1", values: ["111"] },
	// 	{ label: "G.Đặc Biệt", values: ["111"], special: true },
	// ];

	const handleLoadResult = async (date: string, type: string) => {
		try {
			const schedule = await myapi.getResultScheduleByDate(publisher?.slug, date, type);
			if (schedule?.status == 200 && schedule?.result?.data) {
				setResult(schedule?.result?.data);
				const results = schedule?.result?.data?.results;
				const data = Object.keys(results).map((key) => {
					const item: CommonFields = {
						label: labelMap[key],
						values: results[key],
					};
					if (key === "gdb") {
						item["special"] = true;
					}
					return item;
				});
				setPrizes(data);
			}
		} catch (error) {}
	};

	return (
		<div className="w-full md:w-[260px]">
			<div className=" bg-white shadow rounded-lg p-4">
				<div className="img">
					<img src={image_bar} alt="" />
				</div>
				<h3 className="text-center font-bold pt-3">Kết Quả Xổ Số</h3>
				<div className="text-center mb-3 font-semibold text-sm ">
					<NavLink to={`/publisher/${publisher?.slug}`}>{publisher?.name}</NavLink>
				</div>
				<div className="text-center font-semibold text-sm underline">
					<NavLink to={`/publisher/${publisher?.slug}`}>Show more</NavLink>
				</div>
				<div className="w-full bg-gray-300 py-2 rounded text-center font-semibold">
					<span onClick={() => handleLoadResult(result?.date, "pre")} className="cursor-pointer">
						{" "}
						{`👈`}{" "}
					</span>
					Ngày {formatTime(result?.date, "DD/MM/YYYY")}
					<span onClick={() => handleLoadResult(result?.date, "next")} className="cursor-pointer">
						{" "}
						{`👉`}{" "}
					</span>
				</div>

				<div className="border rounded-lg overflow-hidden w-full bg-white mt-2">
					{prizes.length > 0 &&
						prizes.map((row: CommonFields, index: number) => (
							<div key={index} className="grid grid-cols-2 border-b last:border-0">
								<div className="border-r text-gray-700 text-sm font-semibold flex items-center justify-center text-center">{row.label}</div>

								<div className="text-sm">
									{row.values.map((v: string, i: number) => (
										<div
											key={i}
											className={`py-1 pr-1 text-right border-b last:border-0 ${row.special ? "text-red-500 font-bold" : "text-black font-semibold"}`}
										>
											{v}
										</div>
									))}
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default RightSiderbar;
