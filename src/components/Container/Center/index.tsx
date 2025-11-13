const Center = () => {
	const prizes = ["G8", "G7", "G6", "G5", "G4", "G3", "G2", "G1", "Đặc Biệt"];

	return (
		<div className="flex-1 bg-white shadow rounded-lg p-4">
			<h2 className="text-center font-semibold mb-4">
				Lượt Xổ Ngày 10/09/2025
			</h2>

			<table className="w-full text-sm">
				<tbody>
					{prizes.map((g, idx) => (
						<tr key={idx} className="border-b">
							<td className="py-2 w-[80px] font-medium">{g}</td>
							<td className="py-2">
								<div className="flex gap-2">
									{[...Array(10)].map((_, i) => (
										<input
											key={i}
											type="checkbox"
											className="w-4 h-4"
										/>
									))}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="mt-4 flex justify-between items-center">
				<input
					className="border px-2 py-1 rounded"
					placeholder="Tiền cược"
				/>
				<button className="bg-blue-600 text-white px-6 py-2 rounded">
					Confirm Bet
				</button>
			</div>
		</div>
	);
};

export default Center;
