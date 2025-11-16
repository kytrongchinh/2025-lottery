import { useEffect, useRef, useState } from "react";
import Select from "react-select";
const options = [
	{ value: 2, label: "Last 2 Digits" },
	{ value: 3, label: "Last 3 Digits" },
	{ value: 4, label: "Last 4 Digits" },
];
import { useForm, type FieldErrors } from "react-hook-form";
import type { CommonForm } from "@/types/interface";
import { useRecoilState } from "recoil";
import { digitAtom } from "@/stores/digit/digit";
import { modalAtom } from "@/stores/modal";
import { MESSAGE_TEMPLATES } from "@/types/messages";
import { BUTTON_NAME } from "@/types/contants";
const LeftSidebar = () => {
	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
	const [digit, setDigit] = useRecoilState(digitAtom);
	const [commonModal, setCommonModal] = useRecoilState(modalAtom);
	const [lastDigit, setLastDigit] = useState(options[0]);
	const handleOnChange = (e: any) => {
		setLastDigit(e);
		setMyNumber(Array(e?.value).fill(""));
	};

	const [myNumber, setMyNumber] = useState(Array(options[0].value).fill(""));

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number
	) => {
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
		console.log(myNumber, "myNumber");
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
		<div className="w-full md:w-[260px]  px-0 flex flex-col gap-4">
			<div className="box-number w-full  bg-white shadow rounded-lg p-4 flex flex-col gap-4">
				<div className="text-sm font-semibold">
					<Select
						options={options}
						defaultValue={lastDigit}
						onChange={handleOnChange}
					/>
				</div>
				<div className="flex gap-2">
					{Array(Number(lastDigit.value))
						.fill(0)
						.map((_, i) => (
							<input
								{...register(`number_${i}`, {
									required: true,
									maxLength: 1,
									minLength: 1,
								})}
								ref={(el) => {
									inputsRef.current[i] = el;
								}}
								onKeyDown={(e) => handleKeyDown(e, i)}
								key={i}
								maxLength={1}
								className="border px-2 py-3 rounded w-1/2 text-center"
								placeholder="10"
							/>
						))}
				</div>
				<input
					type="hidden"
					{...register(`my_last_digits`, {
						required: true,
					})}
				/>
				{errors.my_last_digits && (
					<div className="text-center -mt-2 text-red-500 font-semibold">
						Please enter your number
					</div>
				)}
				<button
					className="bg-[#2A5381] text-white font-bold py-2 rounded-4xl hover:bg-amber-400 cursor-pointer"
					onClick={handleSubmit(onSubmit, onError)}>
					Lucky Numbers
				</button>
			</div>

			<div className="border bg-white shadow rounded-lg p-3 text-center text-sm">
				<div className="font-semibold mb-2">Thống kê số</div>

				<div className="bg-gray-200 p-2 rounded-md">
					<div className="font-semibold mb-2">Top số ra nhiều</div>
					<div className="grid grid-cols-3 gap-2 text-center font-bold">
						<div className="bg-green-200 w-12 h-12 flex items-center justify-center rounded-full p-2">
							28
						</div>
						<div className="bg-green-200 w-12 h-12 flex items-center justify-center rounded-full p-2">
							28
						</div>
						<div className="bg-green-200 w-12 h-12 flex items-center justify-center rounded-full p-2">
							28
						</div>
					</div>
				</div>
				<div className="bg-gray-200 p-2 rounded-md mt-2">
					<div className="font-semibold mb-2">Số lâu chưa ra</div>
					<div className="grid grid-cols-3 gap-2 text-center font-bold">
						<div className="bg-red-500 w-12 h-12 flex items-center justify-center rounded-full p-2">
							28
						</div>
						<div className="bg-red-500 w-12 h-12 flex items-center justify-center rounded-full p-2">
							28
						</div>
						<div className="bg-red-500 w-12 h-12 flex items-center justify-center rounded-full p-2">
							28
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-2 text-[#2A5381]">
				<button
					onClick={() => handleTypeBet("all")}
					className="border bg-white py-2 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer">
					Bet All Draw
				</button>
				<button
					onClick={() => handleTypeBet("7draw")}
					className="border bg-white py-2 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer">
					Bet 7 Draw
				</button>
				<button
					onClick={() => handleTypeBet("topandbottom")}
					className="border bg-white py-2 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer">
					Top And Bottom
				</button>
				<button className="border bg-white py-2 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer">
					Folk Game
				</button>
			</div>
		</div>
	);
};

export default LeftSidebar;
