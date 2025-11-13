const RightSiderbar = () => {
	const rows = ["G8", "G7", "G6", "G5", "G4", "G3", "G2", "G1", "ĐB"];

	return (
		<div className="w-full md:w-[260px] bg-white shadow rounded-lg p-4">
			<h3 className="text-center font-semibold">Kết Quả Xổ Số</h3>
			<div className="text-center mb-3 text-sm">TP. Hồ Chí Minh</div>

			<table className="w-full text-sm">
				{rows.map((g) => (
					<tr key={g} className="border-b">
						<td className="py-1">{g}</td>
						<td className="py-1 text-red-600 text-right">111</td>
					</tr>
				))}
			</table>
		</div>
	);
};

export default RightSiderbar;
