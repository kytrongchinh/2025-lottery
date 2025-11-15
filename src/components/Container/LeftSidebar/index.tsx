import Select from "react-select";
const options = [
	{ value: "2", label: "Last 2 Digits" },
	{ value: "3", label: "Last 3 Digits" },
	{ value: "4", label: "Last 4 Digits" },
];
const LeftSidebar = () => {
	return (
		<div className="w-full md:w-[260px]  px-0 flex flex-col gap-4">
			<div className="box-number w-full  bg-white shadow rounded-lg p-4 flex flex-col gap-4">
				<div className="text-sm font-semibold">
					<Select options={options} />
				</div>
				<div className="flex gap-2">
					<input
						className="border px-2 py-3 rounded w-1/2 text-center"
						placeholder="10"
					/>
					<input
						className="border px-2 py-1 rounded w-1/2 text-center"
						placeholder="11"
					/>
				</div>
				<button className="bg-[#2A5381] text-white font-bold py-2 rounded-4xl hover:bg-amber-400 cursor-pointer">
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
				<button className="border bg-white py-2 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer">
					Bet All Draw
				</button>
				<button className="border bg-white py-2 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer">
					Bet 7 Draw
				</button>
				<button className="border bg-white py-2 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer">
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
