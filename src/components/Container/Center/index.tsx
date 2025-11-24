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
import { useEffect, useState } from "react";
import type { CommonState } from "@/types/interface";
import { buildData } from "@/utils/base";
import { betAtom, betComputed } from "@/stores/digit/bet";
import { useForm } from "react-hook-form";
import { modalAtom } from "@/stores/modal";
import { BUTTON_NAME } from "@/types/contants";

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
const Center = () => {
	const [digit, setDigit] = useRecoilState(digitAtom);
	const [bet, setBet] = useRecoilState(betAtom);
	const computBet = useRecoilValue(betComputed);

	useEffect(() => {
		console.log(digit, "di");
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
				console.log(data, "sss");
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
		const trueCount = Object.values(checkedItems).filter(
			(v) => v === true
		).length;
		// console.log(trueCount, "trueCount");
		setBet((pre) => ({
			...pre,
			numbers: trueCount,
		}));
	}, [checkedItems]);

	const handleCheck = (name: string) => {
		// setCheckedItems((prev) => ({
		// 	...prev,
		// 	[name]: !prev[name],
		// }));
		setCheckedItems((prev) => {
			const trueCount = Object.values(prev).filter(
				(v) => v === true
			).length;
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
					mount: Number(mount_set),
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
	const [commonModal, setCommonModal] = useRecoilState(modalAtom);

	const handleConfirmBet = () => {
		const dataBet = {
			...bet,
			...digit,
			...computBet,
			checkedItems,
		};
		setCommonModal((pre) => ({
			...pre,
			open: true,
			content: `<p class="bg-white p-4 rounded shadow overflow-x-auto text-sm">${JSON.stringify(
				dataBet
			)}</p>`,
			buttonName: BUTTON_NAME.CLOSE,
		}));
		return;
	};
	const handleClearAll = () => {
		setBet((pre) => ({
			...pre,
			mount: 0,
			rate: 70,
			numbers: 0,
		}));
		setValue("mount", 0);
		setDigit((pre) => ({
			...pre,
			number: "-",
			type: 2,
			numbers: {},
			type_bet: "none",
		}));
	};
	return (
		<div className="flex-1  px-0">
			<div className="flex flex-row items-center justify-center mb-2">
				<div className="flex-1 font-semibold text-center">Đài:</div>
				<div className="flex-9">
					<div className="text-sm font-semibold">
						<Select options={options} className="rounded-2xl" />
					</div>
				</div>
			</div>
			<div className="flex-1 bg-white shadow rounded-lg p-4">
				<h2 className="text-center font-semibold mb-4">
					Lượt Xổ Ngày 10/09/2025
				</h2>

				<div className="w-2/3 border m-auto rounded-lg overflow-hidden bg-gray-100">
					<table className="w-full border-collapse">
						<thead>
							<tr className="bg-yellow-100 border-b">
								<th className="p-1 w-16 border-r">Giải</th>
								<th className="p-1 text-center border-r">
									Chọn Giải Cược
								</th>
								<th className="p-1 w-10 text-center">
									<input
										type="checkbox"
										className="w-4 h-4"
										onChange={handleCheckAll}
										checked={
											(digit?.type_bet == "all" &&
												digit?.number != "") ||
											false
										}
									/>
								</th>
							</tr>
						</thead>
						<tbody>
							{data1.map((row, idx) => {
								const rows = Array.from({ length: row.count });

								return rows.map((_, subIdx) => (
									<tr
										key={idx + "-" + subIdx}
										className="border-b last:border-b-0">
										{subIdx === 0 && (
											<td
												rowSpan={row?.count}
												className="text-sm font-medium text-center align-middle  border-r">
												{row?.label}
											</td>
										)}

										<td className="p-0.5 border-r">
											<div className="flex items-center gap-2 justify-end">
												{row?.num >= digit?.type &&
													Array(
														row?.num - digit?.type
													)
														.fill(null)
														.map((_, i) => (
															<div
																key={i}
																className="w-6 h-6 rounded-full border flex items-center justify-center text-xs bg-gray-200"></div>
														))}

												{Array(digit?.type)
													.fill(null)
													.map((_, i) => {
														if (
															row?.max >=
															digit?.type
														) {
															return (
																<div
																	key={i}
																	className="w-6 h-6 bg-white rounded-full border flex items-center justify-center text-xs">
																	{
																		digit
																			?.numbers?.[
																			`number_${i}`
																		]
																	}
																</div>
															);
														}
													})}
											</div>
										</td>

										<td className="p-[px] text-center align-top bg-gray-50">
											{row?.max >= digit?.type && (
												<input
													name={`${row?.name}_${
														subIdx + 1
													}`}
													key={`${row?.name}_${
														subIdx + 1
													}`}
													type="checkbox"
													className="w-4 h-4"
													checked={
														checkedItems[
															`${row?.name}_${
																subIdx + 1
															}`
														] || false
													}
													onChange={() =>
														handleCheck(
															`${row?.name}_${
																subIdx + 1
															}`
														)
													}
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
							Tỉ lệ cược: <span>{bet?.rate}</span>
						</p>
					</div>
					<div className="flex-6 flex flex-row gap-0.5 justify-center items-center">
						<div className="img w-full">
							<img src={coin_5} className="w-1/2 m-auto" alt="" />
						</div>
						<div className="img w-full">
							<img
								src={coin_10}
								className="w-1/2 m-auto"
								alt=""
							/>
						</div>
						<div className="img w-full">
							<img
								src={coin_20}
								className="w-1/2 m-auto"
								alt=""
							/>
						</div>
						<div className="img w-full">
							<img
								src={coin_50}
								className="w-1/2 m-auto"
								alt=""
							/>
						</div>
						<div className="img w-full">
							<img
								src={coin_100}
								className="w-1/2 m-auto"
								alt=""
							/>
						</div>
						<div className="img w-full">
							<img
								src={coin_500}
								className="w-1/2 m-auto"
								alt=""
							/>
						</div>
					</div>
				</div>

				<div className="w-full h-px bg-gray-200"></div>
				<div className="flex flex-row items-center justify-center my-2 gap-5">
					<div className="flex-5 font-semibold ">
						<p>Tiền cược: (1000 VND)</p>
						<input
							{...register(`mount`, {
								required: true,
								minLength: 1,
								pattern: /[0-9]/,
							})}
							className="border px-2 py-1 rounded w-full"
							placeholder="Tiền cược"
							onChange={handChangeMount}
						/>
					</div>
					<div className="flex-5 ">
						<p>Bộ số đã chọn:</p>
						<input
							className="border px-2 py-1 rounded w-full"
							placeholder="Bộ số đã chọn"
							value={bet?.numbers}
							readOnly
						/>
					</div>
				</div>
				<div className="w-full h-px bg-gray-200 mt-4"></div>

				<div className="mt-4 flex justify-between items-center">
					<p className="text-gray-500 font-semibold">Tổng cược:</p>
					<p
						className="text font-semibold text-2xl"
						title={`mount *1000 * total number =${computBet?.totalBet.toLocaleString()}`}>
						{computBet?.totalBet.toLocaleString()} VNĐ
					</p>
				</div>
				<div className="mt-0 flex justify-between items-center">
					<p className="text-gray-500 font-semibold">
						Thắng Dự kiến:
					</p>
					<p
						className="text-amber-300 font-semibold"
						title={`Rate * mount *1000 * total number =${computBet?.expectedWin.toLocaleString()}`}>
						{computBet?.expectedWin.toLocaleString()} VNĐ
					</p>
				</div>
			</div>
			<div className="flex justify-between items-center mt-5 mx-10 gap-5">
				<button
					onClick={handleConfirmBet}
					className="w-full border bg-[#2A5381] text-white py-2 rounded-4xl font-bold hover:bg-amber-400 cursor-pointer">
					Confirm Bet
				</button>
				<button
					onClick={handleClearAll}
					className="w-full border border-red-500 bg-[#FFEFEF] text-red-500 py-2 rounded-4xl font-bold hover:bg-red-400 hover:text-amber-300 cursor-pointer">
					Clear All
				</button>
			</div>
		</div>
	);
};

export default Center;
