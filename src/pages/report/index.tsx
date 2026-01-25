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

const ReportPage: FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const [publishers, setPublishers] = useState<CommonFields[]>([]);
	const [userBet, setUserBet] = useState<CommonFields>({});
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
			const result = await myapi.getListUserBet(auth?.access_token);
			dispatch({
				type: "FETCH_SUCCESS",
				payload: result?.data,
			});
			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	};

	const loadUserBet = async () => {
		try {

			const mresult = await myapi.getUserBet(auth?.access_token);
			if (mresult && mresult?.data) {
				setUserBet(mresult?.data?.item);
			}
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
		const result = await myapi.getListUserBet(auth?.access_token, selected + 1);
		dispatch({
			type: "FETCH_SUCCESS",
			payload: result?.data,
		});
		setLoading(false);
	};

	useEffect(() => {
		loadPublisher();
		loadResult();
		loadUserBet();
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
				<div className="hidden md:flex w-full md:w-[260px]  px-0 flex-col gap-4">
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
						<h3 className="text-center font-bold text-2xl pt-3 underline uppercase">User Bet</h3>
						<div className="flex flex-row flex-wrap items-center justify-center my-2 text-center">
							<div className="basis-1/2 font-semibold">
								<p>
									<span className="underline decoration-dotted">Number bets</span>: <span>{userBet?.num_bet?.toLocaleString()}</span>
								</p>
							</div>

							<div className="basis-1/2 font-semibold">
								<p>
									<span className="underline decoration-dotted">Total</span>: <span>{userBet?.total_amount?.toLocaleString()} VND</span>
								</p>
							</div>

							<div className="basis-1/2 font-semibold">
								<p>
									<span className="underline decoration-dotted">Profit</span>: <span>{userBet?.profit?.toLocaleString()} VND</span>
								</p>
							</div>

							<div className="basis-1/2 font-semibold">
								<p>
									<span className="underline decoration-dotted">Loss</span>: <span>{userBet?.loss?.toLocaleString()} VND</span>
								</p>
							</div>
							<div className="basis-1/4 font-semibold">
								<p className="text-green-600 underline">Digit two: </p>
								<p>
									Num: {userBet?.digit_two?.number} / Total: {userBet?.digit_two?.values}
								</p>
							</div>
							<div className="basis-1/4 font-semibold">
								<p className="text-red-600 underline">Digit three: </p>
								<p>
									Num: {userBet?.digit_three?.number} / Total: {userBet?.digit_three?.values}
								</p>
							</div>
							<div className="basis-1/4 font-semibold">
								<p className="text-blue-600 underline">Digit four: </p>
								<p>
									Num: {userBet?.digit_four?.number} / Total: {userBet?.digit_four?.values}
								</p>
							</div>
							<div className="basis-1/4 font-semibold">
								<p className="text-amber-600 underline">Folk Game: </p>
								<p>
									Num: {userBet?.folk_game?.number} / Total: {userBet?.folk_game?.values}
								</p>
							</div>

						</div>
						{list?.items?.length > 0 &&
							list?.items.map((item: CommonFields, i: number) => (
								<div className="p-4" key={item?._id}>
									<div className="w-full overflow-x-auto">
										<table className="min-w-[900px] bg-white border border-gray-300 rounded-lg overflow-hidden">
											<thead className="bg-gray-100">
												<tr>
													<th className="px-4 py-2 border-b">#</th>
													<th className="px-4 py-2 border-b">Date</th>
													<th className="px-4 py-2 border-b">Num bet</th>
													<th className="px-4 py-2 border-b">Profix</th>
													<th className="px-4 py-2 border-b">Loss</th>
													<th className="px-4 py-2 border-b">Total</th>
													<th className="px-4 py-2 border-b">Digit Two</th>
													<th className="px-4 py-2 border-b">Digit Three</th>
													<th className="px-4 py-2 border-b">Digit Four</th>
													<th className="px-4 py-2 border-b">Folk Game</th>
												</tr>
											</thead>

											<tbody>
												<tr key={item?._id} className="text-center hover:bg-gray-50">
													<td className="px-4 py-2 border-b">{(list?.page - 1) * list?.limit + (i + 1)}</td>

													<td className="px-4 py-2 border-b">{formatTime(item?.date, "DD/MM/YYYY")}</td>

													<td className="px-4 py-2 border-b">{item?.num_bet}</td>
													<td className="px-4 py-2 border-b">{item?.profix}</td>
													<td className="px-4 py-2 border-b">{item?.loss}</td>
													<td className="px-4 py-2 border-b">{item?.total_amount}</td>

													<td className={`px-4 py-2 border-b font-semibold text-[12px] text-green-600`}>
														Num: {item?.digit_two?.number} / Total: {item?.digit_two?.values}
													</td>

													<td className={`px-4 py-2 border-b font-semibold text-[12px] text-red-600`}>
														Num: {item?.digit_three?.number} / Total: {item?.digit_three?.values}
													</td>
													<td className={`px-4 py-2 border-b font-semibold text-[12px] text-blue-600`}>
														Num: {item?.digit_four?.number} / Total: {item?.digit_four?.values}
													</td>
													<td className={`px-4 py-2 border-b font-semibold text-[12px] text-amber-600`}>
														Num: {item?.folk_game?.number} / Total: {item?.folk_game?.values}
													</td>



												</tr>
											</tbody>
										</table>
									</div>
								</div>
							))}
						{list?.total > list?.limit && convertPage(list?.total, list?.limit) > 0 && (
							<div className="mx-6 my-2">
								<Pagination page={list?.page - 1} totalPage={convertPage(list?.total, list?.limit)} onPageChange={(event: any) => handleChangePage(event)} />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReportPage;
