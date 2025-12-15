import { useEffect, useRef, useState, type FC } from "react";
import Select from "react-select";
const options = [
	{ value: 2, label: "Last 2 Digits" },
	{ value: 3, label: "Last 3 Digits" },
	{ value: 4, label: "Last 4 Digits" },
];
import { useForm, type FieldErrors } from "react-hook-form";
import type { CommonFields, CommonForm, CommonProps } from "@/types/interface";
import { useRecoilState } from "recoil";
import { digitAtom } from "@/stores/digit/digit";
import { modalAtom } from "@/stores/modal";
import { MESSAGE_TEMPLATES } from "@/types/messages";
import { BUTTON_NAME } from "@/types/contants";
import { publisherAtom } from "@/stores/digit/publisher";
import myapi from "@/services/myapi";
const colors = ["bg-green-200", "bg-blue-200", "bg-red-200", "bg-yellow-200", "bg-purple-200"];
const LeftSidebar: FC<CommonProps> = (props) => {
	const { region } = props;
	const [publisher, setPublisher] = useRecoilState<CommonFields>(publisherAtom);
	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
	const [, setDigit] = useRecoilState(digitAtom);
	const [, setCommonModal] = useRecoilState(modalAtom);
	const [lastDigit, setLastDigit] = useState(options[0]);
	const [topDigit, setTopDigit] = useState<CommonFields[]>([]);
	const [bottomDigit, setBottomDigit] = useState<CommonFields[]>([]);

	useEffect(() => {
		loadResult();
	}, [publisher, lastDigit]);

	const loadResult = async () => {
		try {
			const schedule = await myapi.getTopDigit(lastDigit.value, "year", 3, publisher?.slug || "");
			if (schedule?.status == 200 && schedule?.result?.data) {
				setTopDigit(schedule?.result?.data);
			}

			const bots = await myapi.getTopDigit(lastDigit.value, "year", 3, publisher?.slug || "", "bottom");
			if (bots?.status == 200 && bots?.result?.data) {
				setBottomDigit(bots?.result?.data);
			}
		} catch (error) {}
	};

	const handleOnChange = (e: any) => {
		setLastDigit(e);
		setMyNumber(Array(e?.value).fill(""));
		// Array.from({ length: Number(e?.value) }).forEach((_, i) => {
		// 	// reset react-hook-form
		// 	setValue(`number_${i + 1}`, "");
		// 	// reset ô input
		// 	if (inputsRef.current[i]) {
		// 		inputsRef.current[i].value = "";
		// 	}
		// });
		// setDigit((pre) => ({
		// 	...pre,
		// 	numbers: {},
		// 	number: "",
		// 	type: e?.value,
		// 	type_bet: "none",
		// }));
	};

	const [myNumber, setMyNumber] = useState(Array(options[0].value).fill(""));

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		const key = e.key;
		if (/^[0-9]$/.test(key)) {
			e.preventDefault(); // Ngăn input nhập ký tự mặc định
			setMyNumber((prev) => {
				const newArr = prev.map((v, i) => (i === index ? key : v));
				return newArr;
			});
			e.currentTarget.value = key; // Gán luôn vào input hiển thđị
			// Chuyển focus sang ô tiếp theo
			inputsRef.current[index + 1]?.focus();
			setValue(`number_${index}`, key);
		}
		inputsRef.current[index + 1]?.focus();
	};

	useEffect(() => {
		if (myNumber.every((item) => item !== "")) {
			setValue("my_last_digits", myNumber.join(""));
			clearErrors("my_last_digits");
		} else {
			setValue("my_last_digits", "");
		}
	}, [myNumber]);

	const {
		register,
		setValue,
		clearErrors,

		handleSubmit,
		formState: { errors },
	} = useForm({ shouldFocusError: true });
	const onSubmit = async (data: CommonForm) => {
		console.log(data);
		const my_digit = {
			number: data?.my_last_digits,
			type: lastDigit?.value,
			numbers: data,
			type_bet: "one",
		};
		setDigit(my_digit);
	};
	const onError = (e: FieldErrors) => {
		console.log(`==>`, e);
	};

	const handleTypeBet = async (type: string) => {
		if (myNumber.some((item) => item === "")) {
			console.log("ok");
			setCommonModal((pre) => ({
				...pre,
				open: true,
				content: MESSAGE_TEMPLATES.CHOOSE_DIGIT,
				buttonName: BUTTON_NAME.CLOSE,
			}));
			return;
		}
		setDigit((pre) => ({
			...pre,
			type_bet: type,
		}));
	};
	return (
		<div className="w-full md:w-[350px]  px-0 flex flex-col gap-4">
			<div className="box-number w-full  bg-white shadow-[0_0_15px_rgb(6_80_254)] rounded-lg p-4 flex flex-col gap-4">
				<div className="text-sm font-semibold">
					<Select options={options} defaultValue={lastDigit} onChange={handleOnChange} className="react-select-container" classNamePrefix={"react-select"} />
				</div>
				<div className="flex gap-2 mx-auto">
					{Array(Number(lastDigit.value))
						.fill(0)
						.map((_, i) => (
							<input
								{...register(`number_${i}`, {
									required: true,
									maxLength: 1,
									minLength: 1,
									pattern: /[0-9]/,
								})}
								ref={(el) => {
									inputsRef.current[i] = el;
								}}
								onKeyDown={(e) => handleKeyDown(e, i)}
								key={`input-${i}`}
								maxLength={1}
								className="border-3 border-blue-300 px-2 py-3 rounded w-16 text-center"
								placeholder="-"
							/>
						))}
				</div>
				<input
					type="hidden"
					{...register(`my_last_digits`, {
						required: true,
					})}
				/>
				{errors.my_last_digits && <div className="text-center -mt-2 text-red-500 font-semibold">Please enter your number</div>}
				<button className="bg-[#2A5381] text-white font-bold py-2 rounded-4xl hover:bg-amber-400 cursor-pointer" onClick={handleSubmit(onSubmit, onError)}>
					Lucky Numbers
				</button>
			</div>

			<div className=" shadow-[0_0_15px_rgb(216_80_254)] bg-white rounded-lg p-3 text-center text-sm">
				<div className="font-semibold mb-2">Thống kê số</div>

				<div className="bg-gray-200 p-2 rounded-md shadow-[0_0_5px_rgb(6_80_254)]">
					<div className="font-semibold mb-3">Top số ra nhiều</div>
					<div className="grid grid-cols-3 gap-2 text-center font-bold ">
						{topDigit?.length > 0 &&
							topDigit.map((digit, index) => (
								<div className="relative flex justify-center" key={`top-${digit?._id}`}>
									<div className="relative">
										<div
											className={`${
												colors[index % colors.length]
											} shadow-[inset_0_-6px_12px_rgba(248,113,113,0.5)] w-12 h-12 flex items-center justify-center rounded-full p-2`}
										>
											{digit?._id}
										</div>
										<div
											className="absolute -top-1 -right-1 translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black text-xs font-bold border border-gray-300 rounded-2xl px-1"
											title={`${digit?.total}/year`}
										>
											{digit?.total}
										</div>
									</div>
								</div>
							))}
					</div>
				</div>

				<div className="bg-gray-200 p-2 rounded-md shadow-[0_0_5px_rgb(6_80_254)] mt-3">
					<div className="font-semibold mb-3">Top số ít ra</div>
					<div className="grid grid-cols-3 gap-2 text-center font-bold ">
						{bottomDigit?.length > 0 &&
							bottomDigit.map((digit, index) => (
								<div className="relative flex justify-center" key={`bottom-${digit?._id}`}>
									<div className="relative" >
										<div
											className={`${
												colors[index + (3 % colors.length)]
											} shadow-[inset_0_-6px_12px_rgba(248,113,113,0.5)] w-12 h-12 flex items-center justify-center rounded-full p-2`}
										>
											{digit?._id}
										</div>
										<div
											className="absolute -top-1 -right-1 translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black text-xs font-bold border border-gray-300 rounded-2xl px-1"
											title={`${digit?.total}/year`}
										>
											{digit?.total}
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-2 text-[#2A5381]">
				<button onClick={() => handleTypeBet("all")} className="shadow-[0_0_15px_rgb(16_180_154)]  bg-white py-2 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer">
					Bet All Draw
				</button>
				<button onClick={() => handleTypeBet("7draw")} className="shadow shadow-amber-400 bg-white py-2 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer">
					Bet 7 Draw
				</button>
				<button onClick={() => handleTypeBet("topandbottom")} className="shadow shadow-blue-400 bg-white py-2 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer">
					Top And Bottom
				</button>
				<button className="shadow shadow-pink-400 bg-white py-2 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer">Folk Game</button>
			</div>
		</div>
	);
};

export default LeftSidebar;
