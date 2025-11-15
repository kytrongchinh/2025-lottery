import image_bar from "@/assets/banner_right.png";

const RightSiderbar = () => {
	const data = [
		{ label: "G8", values: ["111"], special: true },
		{ label: "G7", values: ["111"] },
		{ label: "G6", values: ["111", "111", "111"] },
		{ label: "G5", values: ["111"] },
		{
			label: "G4",
			values: ["111", "111", "111", "111", "111", "111", "111"],
		},
		{ label: "G3", values: ["111", "111"] },
		{ label: "G2", values: ["111"] },
		{ label: "G1", values: ["111"] },
		{ label: "G.Đặc Biệt", values: ["111"], special: true },
	];

	return (
		<div className="w-full md:w-[260px]  ">
			<div className=" bg-white shadow rounded-lg p-4">
				<div className="img">
					<img src={image_bar} alt="" />
				</div>
				<h3 className="text-center font-bold pt-3">Kết Quả Xổ Số</h3>
				<div className="text-center mb-3 font-semibold text-sm ">
					TP. Hồ Chí Minh
				</div>
				<div className="w-full bg-gray-300 py-2 rounded text-center font-semibold">
					Ngày 22/11/2025
				</div>

				<div className="border rounded-lg overflow-hidden w-full bg-white mt-2">
					{data.map((row, index) => (
						<div
							key={index}
							className="grid grid-cols-2 border-b last:border-0">
							<div className="border-r text-gray-700 text-sm font-semibold flex items-center justify-center text-center">
								{row.label}
							</div>

							<div className="text-sm">
								{row.values.map((v, i) => (
									<div
										key={i}
										className={`py-1 pr-1 text-right border-b last:border-0 ${
											row.special
												? "text-red-500 font-bold"
												: "text-black font-semibold"
										}`}>
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
