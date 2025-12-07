import myapi from "@/services/myapi";
import { loadingAtom } from "@/stores";
import { authAtom } from "@/stores/auth";
import type { CommonFields } from "@/types/interface";
import { formatTime } from "@/utils/time";
import { useEffect, useReducer, useState, type FC } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
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
const BetDetailPage: FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const [publishers, setPublishers] = useState<CommonFields[]>([]);
	const [, setLoading] = useRecoilState(loadingAtom);
	const id = params?.id || "";
	const [bet, setBet] = useState<CommonFields>({});

	const auth = useRecoilValue(authAtom) as CommonFields;

	const loadDetail = async () => {
		try {
			setLoading(true);
			const item = await myapi.getBetDetail(auth?.access_token, id);
			console.log(item?.data, "sss");
			if (item?.data) {
				setBet(item?.data);
			}
			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadPublisher();
		loadDetail();
	}, []);
	const loadPublisher = async () => {
		try {
			const items = await myapi.getPublishers("");
			if (items?.status == 200 && items?.result?.data) {
				const pblsers = items?.result?.data?.publishers;
				setPublishers(pblsers);
			}
		} catch (error) {}
	};
	return (
		<div className="m-container w-full min-h-screen bg-gray-100 p-4">
			<div
				className="max-w-[1400px] mx-auto grid gap-4
    grid-cols-1          /* Mobile: 1 cột */
    md:grid-cols-[260px_1fr]   /* Tablet: Sidebar + Center */
    lg:grid-cols-[260px_1fr_260px]  /* Desktop: 3 cột */
  "
			>
				<div className="w-full md:w-[260px]  px-0 flex flex-col gap-4">
					<div className="flex flex-col gap-2 text-[#2A5381] box-number w-full  bg-white shadow rounded-lg p-4">
						{publishers?.length > 0 &&
							publishers.map((pls, index) => (
								<NavLink
									to={`/publisher/${pls?.slug}`}
									key={index}
									className={`border bg-white py-1 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer text-center`}
								>
									{pls?.name}
								</NavLink>
							))}
					</div>
				</div>
				<div className="w-full">
					<div className="flex-1 bg-white shadow rounded-lg p-4">
						<span title="Back" className="cursor-pointer" onClick={() => navigate(-1)}>
							{`👈`}
						</span>
						<h2 className="text-center font-semibold mb-4 text-2xl">Xổ số {bet?.publisher_name}</h2>
						<h2 className="text-center font-semibold mb-4">Lượt Xổ Ngày {formatTime(bet?.date, "DD/MM/YYYY")}</h2>
						<div className="flex flex-row flex-wrap items-center justify-center my-2 text-center">
							<div className="basis-1/2 font-semibold">
								<p>
									Tỉ lệ cược: <span>{bet?.rate}</span>
								</p>
							</div>

							<div className="basis-1/2 font-semibold">
								<p>
									Số bộ: <span>{bet?.count?.toLocaleString()}</span>
								</p>
							</div>

							<div className="basis-1/2 font-semibold">
								<p>
									Tiền cược: <span>{bet?.amount?.toLocaleString()}</span>
								</p>
							</div>

							<div className="basis-1/2 font-semibold">
								<p>
									Trạng thái: {bet?.status == 1 && <span className=" bg-emerald-400 px-2 rounded-2xl text-red-300">Hoàn thành</span>}
									{bet?.status == 0 && <span className="text-cyan-100 bg-gray-400 px-2 rounded-2xl">Đợi kết quả</span>}
								</p>
							</div>
						</div>

						<div className="w-2/3 border m-auto rounded-lg overflow-hidden bg-gray-100">
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-yellow-100 border-b">
										<th className="p-1 w-16 border-r">Giải</th>
										<th className="p-1 text-center border-r">Bộ số</th>
										<th className="p-1 w-10 text-center">Đã chọn</th>
									</tr>
								</thead>
								<tbody>
									{data1.map((row, idx) => {
										const rows = Array.from({ length: row.count });

										return rows.map((_, subIdx) => (
											<tr key={idx + "-" + subIdx} className="border-b last:border-b-0">
												{subIdx === 0 && (
													<td rowSpan={row?.count} className="text-sm font-medium text-center align-middle  border-r">
														{row?.label}
													</td>
												)}

												<td className="p-0.5 border-r">
													<div className="flex items-center gap-2 justify-end">
														{row?.num >= bet?.type &&
															Array(row?.num - bet?.type)
																.fill(null)
																.map((_, i) => (
																	<div key={i} className="w-6 h-6 rounded-full border flex items-center justify-center text-xs bg-gray-200"></div>
																))}

														{Array(bet?.type)
															.fill(null)
															.map((_, i) => {
																if (row?.max >= bet?.type) {
																	return (
																		<div key={i} className="w-6 h-6 bg-white rounded-full border flex items-center justify-center text-xs">
																			{bet?.numbers?.[`number_${i}`]}
																		</div>
																	);
																}
															})}
													</div>
												</td>
												<td className="p-[px] pt-1 text-center align-top bg-gray-50">
													{row?.max >= bet?.type && (
														<input
															name={`${row?.name}_${subIdx + 1}`}
															key={`${row?.name}_${subIdx + 1}`}
															type="checkbox"
															className="w-4 h-4"
															checked={bet?.checkedItems[`${row?.name}_${subIdx + 1}`] || false}
															readOnly={true}
														/>
													)}
												</td>
											</tr>
										));
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BetDetailPage;
