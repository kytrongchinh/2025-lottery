import Select from "react-select";
const options = [
	{ value: "hcm", label: "TP. Hồ Chí Minh" },
	{ value: "long-an", label: "Long An" },
	{ value: "can-tho", label: "Cần Thơ" },
];
import coin_5 from "@/assets/coins/5.png";
import coin_10 from "@/assets/coins/10.png";
import coin_20 from "@/assets/coins/20.png";
import coin_50 from "@/assets/coins/50.png";
import coin_100 from "@/assets/coins/100.png";
import coin_500 from "@/assets/coins/500.png";
import { useRecoilState, useRecoilValue } from "recoil";
import { digitAtom } from "@/stores/digit/digit";
import { useEffect, useState, type FC } from "react";
import type { CommonFields, CommonProps, CommonState } from "@/types/interface";
import { buildData } from "@/utils/base";
import { betAtom, betComputed } from "@/stores/digit/bet";
import { useForm } from "react-hook-form";
import { modalAtom } from "@/stores/modal";
import { BUTTON_NAME, MODAL_NAME } from "@/types/contants";
import { publisherAtom } from "@/stores/digit/publisher";
import myapi from "@/services/myapi";
import { scheduleAtom } from "@/stores/digit/schedule";
import { formatTime } from "@/utils/time";
import { MESSAGE_TEMPLATES } from "@/types/messages";
import _ from "lodash";
import { authAtom } from "@/stores/auth";
import Image from "@/components/Image";
import "./center.scss";
import { userAtom } from "@/stores/user";
import cookieC from "@/utils/cookie";
import useAuth from "@/hooks/useAuth";
import { useParams, useSearchParams } from "react-router-dom";

const data1 = [
	{ label: "G8", name: "g8", count: 1, max: 2, num: 2 },
	{ label: "G7", name: "g7", count: 1, max: 3, num: 3 },
	{ label: "G6", name: "g6", count: 3, max: 4, num: 5 },
	{ label: "G5", name: "g5", count: 1, max: 4, num: 5 },
	{ label: "G4", name: "g4", count: 7, max: 4, num: 5 },
	{ label: "G3", name: "g3", count: 3, max: 4, num: 5 },
	{ label: "G2", name: "g2", count: 1, max: 4, num: 5 },
	{ label: "G1", name: "g1", count: 1, max: 4, num: 5 },
	{ label: "Đặc Biệt", name: "gdb", count: 1, max: 4, num: 5 },
];

const mCheck = buildData(data1, "", false, 2);
const Center: FC<CommonProps> = (props) => {
	const [digit, setDigit] = useRecoilState(digitAtom);
	// console.log(digit, "digit center");
	const [searchParams] = useSearchParams();
	const { user } = useAuth() as CommonFields;
	const [, setUser] = useRecoilState(userAtom);
	const auth = useRecoilValue(authAtom) as CommonFields;
	const [bet, setBet] = useRecoilState(betAtom);
	const computBet = useRecoilValue(betComputed);
	const [publishers, setPublishers] = useState<CommonProps[]>([]);
	const [publisher, setPublisher] = useRecoilState<CommonFields>(publisherAtom);
	const [schedule, setSchedule] = useRecoilState<CommonFields>(scheduleAtom);


	useEffect(() => {
		// console.log(auth, "auth");
		// console.log(user, "user");
		if (props?.publishers) {
			const options: CommonFields[] = props?.publishers.map((item: CommonFields) => ({
				value: item?.name,
				label: item?.name,
				name: item?.name,
				slug: item?.slug,
				date: item?.date,
				region_name: item?.region_name,
				timeClose: item?.timeClose,
			}));
			setPublishers(options);
			let defaultPublisher = options[0];
			const slug = searchParams.get("slug");
			if (slug) {
				const da = options.filter(option => option.slug == slug);
				if (da) {
					console.log(da, "da")
					defaultPublisher = da[0];
				}
			}
			console.log(defaultPublisher, "publisher")
			setPublisher(defaultPublisher);
			const loadSchedule = async () => {
				try {
					console.log(defaultPublisher?.slug, "defaultPublisher?.slug")
					const schedule = await myapi.getNextSchedule(defaultPublisher?.slug);
					if (schedule?.status == 200 && schedule?.result?.data) {
						setSchedule(schedule?.result?.data);
					}
				} catch (error) { }
			};
			loadSchedule();
		}
	}, [props]);

	useEffect(() => {
		if (digit?.number) {
			const num_digit = digit?.type;
			if (digit?.type_bet == "all") {
				let data = buildData(data1, "all", true, num_digit);
				setCheckedItems((prev) => ({
					...prev,
					...data,
				}));
				return;
			} else if (digit?.type_bet == "topandbottom") {
				let data = buildData(data1, "topandbottom", true, num_digit);
				// console.log(data, "sss");
				setCheckedItems((prev) => ({
					...prev,
					...data,
				}));
				return;
			} else if (digit?.type_bet == "7draw") {
				let data = buildData(data1, "7draw", true, num_digit);

				setCheckedItems((prev) => ({
					...prev,
					...data,
				}));
				return;
			} else if (digit?.type_bet == "one") {
				let data = buildData(data1, "one", true, num_digit);
				setCheckedItems(data);
				return;
			} else if (digit?.type_bet == "none") {
				let data = buildData(data1, "none", false, num_digit);
				setCheckedItems(data);
				return;
			} else {
				// setCheckedItems((prev) => ({
				// 	...prev,
				// 	g8_1: true,
				// }));
			}
		}
	}, [digit]);

	const [checkedItems, setCheckedItems] = useState<CommonState>(mCheck);
	useEffect(() => {
		const trueCount = Object.values(checkedItems).filter((v) => v === true).length;
		// console.log(trueCount, "trueCount");
		setBet((pre) => ({
			...pre,
			numbers: trueCount,
		}));
	}, [checkedItems, user]);

	const handleCheck = (name: string) => {
		// setCheckedItems((prev) => ({
		// 	...prev,
		// 	[name]: !prev[name],
		// }));
		setCheckedItems((prev) => {
			const trueCount = Object.values(prev).filter((v) => v === true).length;
			if (trueCount == 19) {
				setDigit((pre) => ({
					...pre,
					type_bet: "all",
				}));
				return {
					...prev,
					[name]: !prev[name],
				};
			} else {
				setDigit((pre) => ({
					...pre,
					type_bet: "custom",
				}));
				return {
					...prev,
					[name]: !prev[name],
				};
			}
		});
	};
	const handleCheckAll = () => {
		setDigit((pre) => ({
			...pre,
			type_bet: pre?.type_bet == "all" ? "one" : "all",
		}));
	};

	const handChangeMount = (e: any) => {
		const mount_set = e.target.value;
		if (mount_set % 1000 == 0) {
			if (!isNaN(Number(mount_set))) {
				setBet((pre) => ({
					...pre,
					amount: Number(mount_set),
				}));
			}
		}
	};

	const {
		register,
		setValue,
		clearErrors,

		handleSubmit,
		formState: { errors },
	} = useForm({ shouldFocusError: true });
	const [, setCommonModal] = useRecoilState(modalAtom);

	const handleConfirmBet = () => {
		if (_.isEmpty(user)) {
			setCommonModal((pre) => ({
				...pre,
				open: true,
				name: MODAL_NAME.LOGIN,
				content: MESSAGE_TEMPLATES.BET_CONFITM,
				buttonName: BUTTON_NAME.LOGIN,
				handleAction: () => handConfirm(myBet),
			}));
			return;
		}
		const myBet = {
			...bet,
			...digit,
			...computBet,
			checkedItems,
			publisher,
			schedule,
		};
		if (myBet?.amount > 0 && myBet?.count > 0 && myBet?.number && !_.isEmpty(myBet?.publisher) && !_.isEmpty(myBet?.schedule) && myBet?.rate > 0) {
			setCommonModal((pre) => ({
				...pre,
				open: true,
				name: MODAL_NAME.CONFIRM,
				content: MESSAGE_TEMPLATES.BET_CONFITM,
				buttonName: BUTTON_NAME.OK,
				handleAction: () => handConfirm(myBet),
			}));

			return;
		} else {
			setCommonModal((pre) => ({
				...pre,
				open: true,
				content: MESSAGE_TEMPLATES.BET_INVALID,
				buttonName: BUTTON_NAME.CLOSE,
			}));
			return;
		}
	};
	const handleClearAll = () => {
		setBet((pre) => ({
			...pre,
			amount: 0,
			rate: 70,
			numbers: 0,
		}));
		setValue("amount", 0);
		setDigit((pre) => ({
			...pre,
			number: "-",
			type: 2,
			numbers: {},
			type_bet: "none",
		}));
	};

	const handConfirm = async (bet: CommonFields) => {
		const data = {
			...bet,
			date: bet?.schedule?.date,
		};
		const send = await myapi.sendBet(auth?.access_token, data);
		if (send?.status == 200 && send?.result?.data?.bet) {
			if (user?.level == send?.result?.data?.user_level) {
				const u = await myapi.getUser(auth?.access_token);
				if (u?.data) {
					setUser(u.data);
					cookieC.set("userInfo", u.data);
				}
			}

			setCommonModal((pre) => ({
				...pre,
				open: true,
				content: MESSAGE_TEMPLATES.BET_SUCCESS,
				buttonName: BUTTON_NAME.CLOSE,
			}));
		}
	};

	const handleChoosePubisher = async (e: any) => {
		setPublisher(e);
		const loadSchedule = async () => {
			try {
				const schedule = await myapi.getNextSchedule(e?.slug);
				if (schedule?.status == 200 && schedule?.result?.data) {
					setSchedule(schedule?.result?.data);
				}
			} catch (error) { }
		};
		loadSchedule();
	};
	return (
		<div className="flex-1  px-0">
			<div className="dark:bg-[rgb(3,3,40)] dark:text-amber-50 flex flex-row items-center justify-center mb-2">
				<div className="flex-1 font-semibold text-center">Đài:</div>
				<div className="flex-9">
					<div className="text-sm font-semibold ">
						<Select options={publishers} value={publisher} onChange={handleChoosePubisher} className="react-select-container " classNamePrefix={"react-select"} />
					</div>
				</div>
			</div>
			<div className="flex-1 bg-white dark:bg-[rgb(3,3,40)] dark:text-amber-50  rounded-lg p-4 dark:shadow-[0_0_8px_rgb(6_80_254)] shadow-[0_0_5px_rgb(248_113_113)]">
				<h2 className="text-center font-semibold mb-4">Lượt Xổ Ngày {formatTime(schedule?.date, "DD/MM/YYYY")}</h2>

				<div className="w-full border m-auto rounded-lg overflow-hidden bg-gray-100 dark:shadow-[0_0_8px_rgb(6_80_254)] dark:bg-[rgb(3,3,40)] dark:text-amber-50 border-amber-800 dark:border-blue-950 ">
					<table className="w-full border-collapse">
						<thead>
							<tr className="bg-yellow-100 border-b border-amber-800 dark:bg-[rgb(3,3,40)] dark:text-amber-50 dark:border-blue-600">
								<th className="p-1 w-16 border-r border-amber-800 dark:border-blue-600">Giải</th>
								<th className="p-1 text-center border-r border-amber-800 dark:border-blue-600">Chọn Giải Cược</th>
								<th className="p-1 w-20 text-center">
									<input type="checkbox" className="w-4 h-4" onChange={handleCheckAll} checked={(digit?.type_bet == "all" && digit?.number != "") || false} />
								</th>
							</tr>
						</thead>
						<tbody>
							{data1.map((row, idx) => {
								const rows = Array.from({ length: row.count });

								return rows.map((_, subIdx) => (
									<tr key={idx + "-" + subIdx} className="border-b border-amber-800 dark:border-blue-600 last:border-b-0">
										{subIdx === 0 && (
											<td rowSpan={row?.count} className="text-sm font-medium text-center align-middle  border-r border-amber-800 dark:border-blue-600">
												{row?.label}
											</td>
										)}

										<td className="p-0.5 border-r pr-4 border-amber-800 dark:border-blue-600">
											<div className="flex items-center gap-2 justify-end">
												{row?.num >= digit?.type &&
													Array(row?.num - digit?.type)
														.fill(null)
														.map((_, i) => (
															<div
																key={i}
																className="mr-2 w-6 h-6 dark:bg-[rgb(3,3,40)] dark:text-amber-50 rounded-full border border-amber-800 dark:border-blue-600 flex items-center justify-center text-xs bg-gray-200"
															></div>
														))}

												{Array(digit?.type)
													.fill(null)
													.map((_, i) => {
														if (row?.max >= digit?.type) {
															const num = `number_${digit?.numbers?.[`number_${i}`]}`;
															if (digit?.numbers?.[`number_${i}`]) {
																return (
																	<div key={i} className="mr-2 w-9 flex items-center justify-center text-xs">
																		<Image image={num} />
																	</div>
																);
															} else {
																return (
																	<div
																		key={i}
																		className="mr-2 w-6 h-6 bg-white dark:bg-[rgb(3,3,40)] dark:text-amber-50 rounded-full border border-amber-800 flex items-center justify-center text-xs dark:border-blue-600"
																	>
																		{digit?.numbers?.[`number_${i}`]}
																	</div>
																);
															}
														}
													})}
											</div>
										</td>

										<td className="p-[px] pt-1 text-center align-top bg-gray-50 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
											{row?.max >= digit?.type && (
												<input
													name={`${row?.name}_${subIdx + 1}`}
													key={`${row?.name}_${subIdx + 1}`}
													type="checkbox"
													className="w-4 h-4 border  border-amber-400 accent-amber-400 dark:accent-[#010159] dark:border-blue-600"
													checked={checkedItems[`${row?.name}_${subIdx + 1}`] || false}
													onChange={() => handleCheck(`${row?.name}_${subIdx + 1}`)}
												/>
											)}
										</td>
									</tr>
								));
							})}
						</tbody>
					</table>
				</div>

				<div className="flex flex-row items-center justify-center my-2">
					<div className="flex-4 font-semibold ">
						<p>
							Tỉ lệ cược: <span>{computBet?.rate}</span>
						</p>
					</div>
					<div className="flex-6 flex flex-row gap-0.5 justify-center items-center">
						<div className="img w-full cursor-pointer" onClick={() => {
							setValue("amount", 5000);
							setBet((pre) => ({
								...pre,
								amount: 5000,
							}));
						}}>
							<img src={coin_5} className="w-1/2 m-auto" alt="" />
						</div>
						<div className="img w-full cursor-pointer" onClick={() => {
							setValue("amount", 10000);
							setBet((pre) => ({
								...pre,
								amount: 10000,
							}));
						}}>
							<img src={coin_10} className="w-1/2 m-auto" alt="" />
						</div>
						<div className="img w-full cursor-pointer" onClick={() => {
							setValue("amount", 20000);
							setBet((pre) => ({
								...pre,
								amount: 20000,
							}));
						}}>
							<img src={coin_20} className="w-1/2 m-auto" alt="" />
						</div>
						<div className="img w-full cursor-pointer" onClick={() => {
							setValue("amount", 50000);
							setBet((pre) => ({
								...pre,
								amount: 50000,
							}));
						}}>
							<img src={coin_50} className="w-1/2 m-auto" alt="" />
						</div>
						<div className="img w-full cursor-pointer" onClick={() => {
							setValue("amount", 100000);
							setBet((pre) => ({
								...pre,
								amount: 100000,
							}));
						}}>
							<img src={coin_100} className="w-1/2 m-auto" alt="" />
						</div>
						<div className="img w-full cursor-pointer" onClick={() => {
							setValue("amount", 500000);
							setBet((pre) => ({
								...pre,
								amount: 500000,
							}));
						}}>
							<img src={coin_500} className="w-1/2 m-auto" alt="" />
						</div>
					</div>
				</div>

				<div className="w-full h-px bg-gray-200"></div>
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
							onChange={handChangeMount}
						/>
					</div>
					<div className="flex-5 ">
						<p>Bộ số đã chọn:</p>
						<input
							className="border rounded w-full  border-blue-300 px-2 py-3  text-center dark:shadow-[0_0_15px_rgb(6_80_254)] dark:border-blue-700"
							placeholder="Bộ số đã chọn"
							value={bet?.numbers}
							readOnly
						/>
					</div>
				</div>
				<div className="w-full h-px bg-gray-200 mt-4"></div>

				<div className="mt-4 flex justify-between items-center">
					<p className="text-gray-500 font-semibold">Tổng cược:</p>
					<p className="text font-semibold text-2xl" title={`amount *1000 * total number =${computBet?.totalBet.toLocaleString()}`}>
						{computBet?.totalBet.toLocaleString()} VNĐ
					</p>
				</div>
				<div className="mt-0 flex justify-between items-center">
					<p className="text-gray-500 font-semibold">Thắng Dự kiến:</p>
					<p className="text-amber-300 font-semibold" title={`Rate * amount *1000 * total number =${computBet?.expectedWin.toLocaleString()}`}>
						{computBet?.expectedWin.toLocaleString()} VNĐ
					</p>
				</div>
			</div>
			<div className="flex justify-between items-center mt-5 mx-10 gap-5 mb-20">
				<button
					onClick={handleConfirmBet}
					className="w-full dark:bg-[rgb(3,3,40)] dark:text-amber-50  bg-[#2A5381]  text-white py-2 rounded-4xl font-bold hover:bg-amber-400 cursor-pointer shadow-[0_0_15px_rgb(6_80_254)]"
				>
					Confirm Bet
				</button>
				<button
					onClick={handleClearAll}
					className="w-full dark:bg-[rgb(3,3,40)] dark:text-amber-50 bg-[#FFEFEF] text-red-500 py-2 rounded-4xl font-bold hover:bg-red-400 hover:text-amber-300 cursor-pointer shadow-[0_0_15px_rgb(248_113_113)]"
				>
					Clear All
				</button>
			</div>
		</div>
	);
};

export default Center;
