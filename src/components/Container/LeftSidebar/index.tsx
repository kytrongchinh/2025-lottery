const LeftSidebar = () => {
	return (
		<div className="w-full md:w-[260px] bg-white shadow rounded-lg p-4 flex flex-col gap-4">
			<div className="text-sm font-semibold">Last 2 Digits</div>
			<div className="flex gap-2">
				{/* <button className="flex-1 border rounded py-2">3</button> */}
				{/* <button className="flex-1 border rounded py-2">8</button> */}
				<input
					className="border px-2 py-3 rounded w-1/2 text-center"
					placeholder="10"
				/>
				<input
					className="border px-2 py-1 rounded w-1/2 text-center"
					placeholder="11"
				/>
			</div>

			<button className="bg-blue-600 text-white py-2 rounded-4xl hover:bg-amber-400 cursor-pointer">
				Lucky Numbers
			</button>

			<div className="border rounded-lg p-3 text-center text-sm">
				<div className="font-semibold mb-2">Thống kê số</div>

				<div className="bg-gray-200 p-2 rounded">
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
				<div className="bg-gray-200 p-2 rounded mt-2">
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

			<div className="flex flex-col gap-2">
				<button className="border py-2 rounded hover:bg-gray-200 cursor-pointer">
					Bet All Draw
				</button>
				<button className="border py-2 rounded hover:bg-gray-200 cursor-pointer">
					Bet 7 Draw
				</button>
				<button className="border py-2 rounded hover:bg-gray-200 cursor-pointer">
					Top And Bottom
				</button>
				<button className="border py-2 rounded hover:bg-gray-200 cursor-pointer">
					Folk Game
				</button>
			</div>
		</div>
	);
};

export default LeftSidebar;
