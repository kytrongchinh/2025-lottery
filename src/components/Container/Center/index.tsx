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
const data1 = [
	{ label: "G8", count: 1 },
	{ label: "G7", count: 1 },
	{ label: "G6", count: 3 },
	{ label: "G5", count: 1 },
	{ label: "G4", count: 7 },
	{ label: "G3", count: 3 },
	{ label: "G2", count: 1 },
	{ label: "G1", count: 1 },
	{ label: "Đặc Biệt", count: 1 },
];
const Center = () => {
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

				<div className="w-full border rounded-lg overflow-hidden bg-gray-100">
					<table className="w-full border-collapse">
						<thead>
							<tr className="bg-yellow-100 border-b">
								<th className="p-1 w-24 border-r">Giải</th>
								<th className="p-1 text-center border-r">
									Chọn Giải Cược
								</th>
								<th className="p-1 w-12 text-center">
									<input
										type="checkbox"
										className="w-4 h-4"
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
												rowSpan={row.count}
												className="text-sm font-medium text-center align-middle  border-r">
												{row.label}
											</td>
										)}

										<td className="p-1 border-r">
											<div className="flex items-center gap-2 justify-end">
												<div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs bg-gray-200"></div>
												<div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs bg-gray-200"></div>
												<div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs bg-gray-200"></div>
												<div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs">
													0
												</div>
												<div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs">
													0
												</div>
											</div>
										</td>

										<td className="p-1 text-center align-top bg-gray-50">
											<input
												type="checkbox"
												className="w-4 h-4"
											/>
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
							Tỉ lệ cược: <span>1.650</span>
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
						<p>Tiền cược:</p>
						<input
							className="border px-2 py-1 rounded w-full"
							placeholder="Tiền cược"
						/>
					</div>
					<div className="flex-5 ">
						<p>Bộ số đã chọn:</p>
						<input
							className="border px-2 py-1 rounded w-full"
							placeholder="Bộ số đã chọn"
						/>
					</div>
				</div>
				<div className="w-full h-px bg-gray-200 mt-4"></div>

				<div className="mt-4 flex justify-between items-center">
					<p className="text-gray-500 font-semibold">Tổng cược:</p>
					<p className="text font-semibold text-2xl">90.000 VNĐ</p>
				</div>
				<div className="mt-0 flex justify-between items-center">
					<p className="text-gray-500 font-semibold">
						Thắng Dự kiến:
					</p>
					<p className="text-amber-300 font-semibold">500.000</p>
				</div>
			</div>
			<div className="flex justify-between items-center mt-5 mx-10 gap-5">
				<button className="w-full border bg-[#2A5381] text-white py-2 rounded-4xl font-bold hover:bg-amber-400 cursor-pointer">
					Confirm Bet
				</button>
				<button className="w-full border border-red-500 bg-[#FFEFEF] text-red-500 py-2 rounded-4xl font-bold hover:bg-red-400 hover:text-amber-300 cursor-pointer">
					Clear All
				</button>
			</div>
		</div>
	);
};

export default Center;
