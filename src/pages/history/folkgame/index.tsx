import Pagination from "@/components/Pagination/Pagination";
import myapi from "@/services/myapi";
import { loadingAtom } from "@/stores";
import { authAtom } from "@/stores/auth";
import type { CommonFields } from "@/types/interface";
import { convertPage } from "@/utils/base";
import { formatTime } from "@/utils/time";
import { useEffect, useReducer, useState, type FC } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

type State = {
	loading: boolean;
	error: string | null;
	list: Record<string, any>; // Adjust type according to your data structure
};

type Action = { type: "FETCH_REQUEST" } | { type: "FETCH_SUCCESS"; payload: Record<string, any> } | { type: "FETCH_FAIL"; payload: string };

function reducer(state: State, action: Action) {
	switch (action.type) {
		case "FETCH_REQUEST":
			return { ...state, loading: true, error: null };
		case "FETCH_SUCCESS":
			return {
				...state,
				loading: false,
				error: null,
				list: action.payload || {}, // Ensure default empty object if payload is missing
			};
		case "FETCH_FAIL":
			return { ...state, loading: false, error: action.payload };

		default:
			return state; // Ensure default case returns state
	}
}

const HistoryFolkgamePage: FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const [publishers, setPublishers] = useState<CommonFields[]>([]);
	const [pageNum, setPageNum] = useState(0);
	const [, setLoading] = useRecoilState(loadingAtom);
	const [{ loading, error, list }, dispatch] = useReducer(reducer, {
		loading: false,
		list: [],
		error: "",
	});
	const auth = useRecoilValue(authAtom) as CommonFields;

	const loadResult = async () => {
		try {
			setLoading(true);
			dispatch({ type: "FETCH_REQUEST" });
			const result = await myapi.getListFoldGameBet(auth?.access_token);
			console.log(result, "result");
			dispatch({
				type: "FETCH_SUCCESS",
				payload: result?.data,
			});
			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	};

	const handleChangePage = async (event: any) => {
		const { selected } = event;
		let newPage = selected;
		setPageNum(newPage);
		dispatch({ type: "FETCH_REQUEST" });
		setLoading(true);
		const result = await myapi.getListFoldGameBet(auth?.access_token, selected + 1);
		dispatch({
			type: "FETCH_SUCCESS",
			payload: result?.data,
		});
		setLoading(false);
	};

	useEffect(() => {
		loadPublisher();
		loadResult();
	}, []);
	const loadPublisher = async () => {
		try {
			const items = await myapi.getPublishers("");
			if (items?.status == 200 && items?.result?.data) {
				const pblsers = items?.result?.data?.publishers;
				setPublishers(pblsers);
			}
		} catch (error) { }
	};
	return (
		<div className="m-container w-full min-h-screen bg-gray-100 p-4">
			{/* <div className="max-w-[1400px] mx-auto flex gap-4"> */}
			<div
				className="max-w-[1400px] mx-auto grid gap-4
    grid-cols-1          /* Mobile: 1 cột */
    md:grid-cols-[260px_1fr]   /* Tablet: Sidebar + Center */
    lg:grid-cols-[260px_1fr]  /* Desktop: 3 cột */
  "
			>
				<div className="hidden md:flex w-full md:w-[260px]  px-0  flex-col gap-4">
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
				<div className="w-full mb-14 md:mb-0">
					<div className="flex flex-col gap-2 text-[#2A5381] box-number w-full  bg-white shadow rounded-lg p-4">
						<h3 className="text-center font-bold pt-3">Histories Bet</h3>
						<div className="text-center mb-3 font-semibold text-sm ">You have total {list?.total} bet</div>
						{list?.items?.length > 0 &&
							list?.items.map((item: CommonFields, i: number) => (
								<div className="p-4" key={item?._id}>
									<div className="w-full overflow-x-auto">
										<table className="table-fixed min-w-[900px] bg-white border border-gray-300 rounded-lg overflow-hidden">
											<thead className="bg-gray-100">
												<tr>
													<th className="px-4 py-2 border-b">#</th>
													<th className="px-4 py-2 border-b">Date</th>
													<th className="px-4 py-2 border-b">Amount</th>
													<th className="px-4 py-2 border-b">Selected</th>
													<th className="px-4 py-2 border-b">Count</th>
													<th className="px-4 py-2 border-b">Publisher</th>
													<th className="px-4 py-2 border-b">Status</th>
													<th className="px-4 py-2 border-b">Win</th>
													<th className="px-4 py-2 border-b">CreatedAt</th>
													<th className="px-4 py-2 border-b">Action</th>
												</tr>
											</thead>

											<tbody>
												<tr key={item?._id} className="text-center hover:bg-gray-50">
													<td className="px-4 py-2 border-b">{(list?.page - 1) * list?.limit + (i + 1)}</td>

													<td className="px-4 py-2 border-b">{formatTime(item?.date, "DD/MM/YYYY")}</td>

													<td className="px-4 py-2 border-b">{item?.amount.toLocaleString()}</td>
													<td className="px-4 py-2 border-b w-[500px]">
														{item?.selected?.length > 0 &&
															item?.selected.map((d: CommonFields, i: number) => (
																<div key={`select-${i}`} className="border-b border-dotted last:border-none">
																	<p className="text-[11px]">#Label: {d?.label} #Name: {d?.name} #Rate: {d?.rate}</p>

																</div>
															))}
													</td>
													<td className="px-4 py-2 border-b">{item?.count.toLocaleString()}</td>
													<td className="px-4 py-2 border-b">{item?.publisher_name}</td>

													<td className={`px-4 py-2 border-b font-semibold ${item?.status === 1 ? "text-green-600" : "text-gray-700"}`}>
														{item?.status == 1 ? "Complete" : "Waiting"}
													</td>

													<td className={`px-4 py-2 border-b font-semibold ${item?.is_win === true ? "text-green-600" : "text-red-600"}`}>
														{item?.is_win && item?.status === 1 ? "Lucky" : item?.is_win == false && item?.status === 1 ? "Unlucky" : "-"}
													</td>
													{/* <td className="px-4 py-2 border-b underline" onClick={() => navigate("/level")}>
														{item?.level}
													</td> */}

													<td className="px-4 py-2 border-b">{formatTime(item?.createdAt, "DD/MM/YYYY HH:mm")}</td>

													<td
														className="px-4 py-2 border-b underline"
														onClick={() => {
															navigate(`/history/folkgame/detail/${item?._id}`);
														}}
													>
														View
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							))}
						<div className="mx-6 my-2 mb-10">
							{list?.total > list?.limit && convertPage(list?.total, list?.limit) > 0 && (
								<Pagination page={list?.page - 1} totalPage={convertPage(list?.total, list?.limit)} onPageChange={(event: any) => handleChangePage(event)} />
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HistoryFolkgamePage;
