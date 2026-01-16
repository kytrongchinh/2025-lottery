import myapi from "@/services/myapi";
import { loadingAtom } from "@/stores";
import { scheduleAtom } from "@/stores/digit/schedule";
import type { CommonFields } from "@/types/interface";
import { formatTime } from "@/utils/time";
import { useEffect, useState, type FC } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
// import { folkGameData } from "./folkGame.config";
import coin_5 from "@/assets/coins/5.png";
import coin_10 from "@/assets/coins/10.png";
import coin_20 from "@/assets/coins/20.png";
import coin_50 from "@/assets/coins/50.png";
import coin_100 from "@/assets/coins/100.png";
import coin_500 from "@/assets/coins/500.png";
import { BetSection } from "./BetSection";
import { useForm } from "react-hook-form";
import { folkComputed, folkGameAtom } from "@/stores/folkgame";
import { publisherAtom } from "@/stores/digit/publisher";
type SelectedBet = {
	name: string;
	rate: number;
	label: string;
	type: string;
	group: string;
	description?: string;
};

const FolkGamePage: FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const [publishers, setPublishers] = useState<CommonFields[]>([]);
	// const [publisher, setPublisher] = useState<CommonFields>({});
	const [publisher, setPublisher] = useRecoilState(publisherAtom);
	const [, setLoading] = useRecoilState(loadingAtom);
	const slug = params?.slug;
	const [schedule, setSchedule] = useRecoilState<CommonFields>(scheduleAtom);
	const [folk, setFolk] = useRecoilState(folkGameAtom);
	const computFolk = useRecoilValue(folkComputed);

	const {
		register,
		setValue,
		getValues,
		formState: { errors },
	} = useForm({ shouldFocusError: true });

	const loadSchedule = async (slug: string) => {
		try {
			const schedule = await myapi.getNextSchedule(slug || "");
			if (schedule?.status == 200 && schedule?.result?.data) {
				setSchedule(schedule?.result?.data);
			}
		} catch (error) { }
	};
	const [selectedBets, setSelectedBets] = useState<SelectedBet[]>([]);
	const [folkGames, setFolkGames] = useState<CommonFields[]>([]);


	useEffect(() => {
		loadPublisher();

	}, [slug]);

	useEffect(() => {
		loadFolkGame();
	}, []);
	useEffect(() => {
		// console.log(selectedBets, "selectedBets");
		const amount = getValues("amount")
		if (selectedBets.length > 0 && amount) {
			setFolk((pre) => ({
				...pre,
				amount: amount,
				selected: selectedBets
			}));
		} else {
			if (selectedBets.length) {
				setFolk((pre) => ({
					...pre,
					selected: selectedBets
				}));
			}
		}
	}, [selectedBets]);
	const loadPublisher = async () => {
		try {
			const items = await myapi.getPublishers("");
			if (items?.status == 200 && items?.result?.data) {
				const pblsers = items?.result?.data?.publishers;
				setPublishers(pblsers);
				if (slug) {
					const p = pblsers.filter((pl: CommonFields) => pl?.slug == slug);
					if (p.length > 0) {
						setPublisher(p[0]);
						loadSchedule(slug);
					}
				} else {
					setPublisher(pblsers[0]);
					loadSchedule(pblsers[0]?.slug);
				}
			}
		} catch (error) { }
	};

	const loadFolkGame = async () => {
		try {
			const items = await myapi.getFolkGame();
			if (items?.status == 200 && items?.result?.data) {
				const data = items?.result?.data;
				setFolkGames(data);

			}
		} catch (error) { }
	};
	return (
		<div className="m-container w-full min-h-screen bg-gray-100 p-4 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
			{/* <div className="max-w-[1400px] mx-auto flex gap-4"> */}
			<div
				className="max-w-[1400px] mx-auto grid gap-4
					grid-cols-1          /* Mobile: 1 cột */
					md:grid-cols-[260px_1fr]   /* Tablet: Sidebar + Center */
					lg:grid-cols-[260px_1fr]  /* Desktop: 3 cột */"
			>
				<div className="w-full md:w-[260px]  px-0 flex flex-col gap-4">
					<div className="flex flex-col gap-2 text-[#2A5381] box-number w-full shadow-[0_0_15px_rgb(6_80_254)] bg-white  rounded-lg p-4 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
						{publishers?.length > 0 &&
							publishers.map((pls, index) => (
								<NavLink
									to={`/folkgame/${pls?.slug}`}
									key={index}
									className={`border bg-white dark:bg-[rgb(3,3,40)] dark:text-amber-50 dark:hover:bg-indigo-800 py-1 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer text-center${pls?.slug == publisher?.slug ? " bg-amber-400!" : ""
										}`}
								>
									{pls?.name}
								</NavLink>
							))}
					</div>
				</div>
				<div className="w-full">
					<div className="flex flex-col gap-2 text-[#2A5381] box-number w-full shadow-[0_0_15px_rgb(216_80_254)] bg-white  rounded-lg p-4 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
						<h2 className="text-center font-semibold mb-2">Folk Game / {publisher?.name} / Lượt Xổ Ngày {formatTime(schedule?.date, "DD/MM/YYYY")}</h2>
						{folkGames?.length > 0 && folkGames.map((section, index) => (
							<BetSection
								key={section.label}
								label={section.label}
								group={section?.group}
								description={section?.description}
								cols={section.cols}
								items={section.items}
								selected={selectedBets}
								setSelected={setSelectedBets}
							/>
						))}

						<div className="flex flex-row items-center justify-center my-2">

							<div className="flex-6 flex flex-row gap-0.5 justify-center items-center">
								<div className="img w-full cursor-pointer" onClick={() => {
									setValue("amount", 5000);
									setFolk((pre) => ({
										...pre,
										amount: 5000,
									}));
								}}>
									<img src={coin_5} className="w-[50px] m-auto" alt="" />
								</div>
								<div className="img w-full cursor-pointer" onClick={() => {
									setValue("amount", 10000);
									setFolk((pre) => ({
										...pre,
										amount: 10000,
									}));
								}}>
									<img src={coin_10} className="w-[50px] m-auto" alt="" />
								</div>
								<div className="img w-full cursor-pointer" onClick={() => {
									setValue("amount", 20000);
									setFolk((pre) => ({
										...pre,
										amount: 20000,
									}));
								}}>
									<img src={coin_20} className="w-[50px] m-auto" alt="" />
								</div>
								<div className="img w-full cursor-pointer" onClick={() => {
									setValue("amount", 50000);
									setFolk((pre) => ({
										...pre,
										amount: 50000,
									}));
								}}>
									<img src={coin_50} className="w-[50px] m-auto" alt="" />
								</div>
								<div className="img w-full cursor-pointer" onClick={() => {
									setValue("amount", 100000);
									setFolk((pre) => ({
										...pre,
										amount: 100000,
									}));
								}}>
									<img src={coin_100} className="w-[50px] m-auto" alt="" />
								</div>
								<div className="img w-full cursor-pointer" onClick={() => {
									setValue("amount", 500000);
									setFolk((pre) => ({
										...pre,
										amount: 500000,
									}));
								}}>
									<img src={coin_500} className="w-[50px] m-auto" alt="" />
								</div>
							</div>
						</div>
						<div className="flex flex-row items-center justify-center my-2 gap-5">
							<div className="flex-5 font-semibold ">
								<p>
									Tiền cược: <span className="text-[12px] md:text-[16px]">(1000 VND)</span>{" "}
								</p>
								<input
									{...register(`amount`, {
										required: true,
										minLength: 1,
										pattern: /[0-9]/,
									})}
									className="border rounded w-full  border-blue-300 px-2 py-3  text-center dark:shadow-[0_0_15px_rgb(6_80_254)] dark:border-blue-700"
									placeholder="Tiền cược"
								/>
							</div>
							<div className="flex-5 ">
								<p>Bộ số đã chọn:</p>
								<input
									className="border rounded w-full  border-blue-300 px-2 py-3  text-center dark:shadow-[0_0_15px_rgb(6_80_254)] dark:border-blue-700"
									placeholder="Bộ số đã chọn"
									readOnly
									value={selectedBets?.length}
								/>
							</div>
						</div>
						<div className="w-full h-px bg-gray-200 mt-0"></div>

						<div className="mt-0 flex justify-between items-center">
							<p className="text-gray-500 font-semibold">Tổng cược:</p>
							<p className="text font-semibold text-2xl">
								{computFolk?.totalBet.toLocaleString()} VNĐ
							</p>
						</div>
						<div className="mt-0 flex justify-between items-center">
							<p className="text-gray-500 font-semibold">Thắng Dự kiến:</p>
							<p className="text-amber-300 font-semibold" title={``}>
								{computFolk?.expectedWin.toLocaleString()} VNĐ
							</p>
						</div>
					</div>
					<div className="flex justify-between items-center mt-5 mx-10 gap-5">
						<button

							className="w-full dark:bg-[rgb(3,3,40)] dark:text-amber-50  bg-[#2A5381]  text-white py-2 rounded-4xl font-bold hover:bg-amber-400 cursor-pointer shadow-[0_0_15px_rgb(6_80_254)]"
						>
							Confirm Bet
						</button>
						<button

							className="w-full dark:bg-[rgb(3,3,40)] dark:text-amber-50 bg-[#FFEFEF] text-red-500 py-2 rounded-4xl font-bold hover:bg-red-400 hover:text-amber-300 cursor-pointer shadow-[0_0_15px_rgb(248_113_113)]"
						>
							Clear All
						</button>
					</div>

				</div>

			</div>

		</div>
	);
};

export default FolkGamePage;
