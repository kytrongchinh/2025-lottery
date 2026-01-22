import Pagination from "@/components/Pagination/Pagination";
import myapi from "@/services/myapi";
import { loadingAtom } from "@/stores";
import type { CommonFields } from "@/types/interface";
import { convertPage } from "@/utils/base";
import { formatTime } from "@/utils/time";
import { useEffect, useReducer, useState, type FC } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";

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

const PublisherPage: FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const [publishers, setPublishers] = useState<CommonFields[]>([]);
	const [publisher, setPublisher] = useState<CommonFields>({});
	const [pageNum, setPageNum] = useState(0);
	const [, setLoading] = useRecoilState(loadingAtom);
	const slug = params?.slug;
	const [{ loading, error, list }, dispatch] = useReducer(reducer, {
		loading: false,
		list: [],
		error: "",
	});

	const loadResult = async (publisher: string) => {
		try {
			setLoading(true);
			dispatch({ type: "FETCH_REQUEST" });
			const result = await myapi.getResultScheduleByPublisher(publisher);
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
		const result = await myapi.getResultScheduleByPublisher(publisher?.slug, selected + 1);
		dispatch({
			type: "FETCH_SUCCESS",
			payload: result?.data,
		});
		setLoading(false);
	};

	useEffect(() => {
		loadPublisher();
	}, [slug]);
	const loadPublisher = async () => {
		try {
			const items = await myapi.getPublishers("");
			if (items?.status == 200 && items?.result?.data) {
				const pblsers = items?.result?.data?.publishers;
				setPublishers(pblsers);
				if (slug) {
					const p = pblsers.filter((pl: CommonFields) => pl?.slug == slug);
					if (p.length > 0) {
						setPublisher(p[0]);
						loadResult(p[0]?.slug);
					}
				} else {
					setPublisher(pblsers[0]);
					loadResult(pblsers[0]?.slug);
				}
			}
		} catch (error) { }
	};
	const [open, setOpen] = useState(false);
	return (
		<div className="m-container w-full min-h-screen bg-gray-100 p-4 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
			{/* <div className="max-w-[1400px] mx-auto flex gap-4"> */}
			<div
				className="max-w-[1400px] mx-auto grid gap-4
    grid-cols-1          /* Mobile: 1 cột */
    md:grid-cols-[260px_1fr]   /* Tablet: Sidebar + Center */
    lg:grid-cols-[260px_1fr]  /* Desktop: 3 cột */
  "
			>
				<div className="w-full md:w-[260px]  px-0 flex flex-col gap-4">
					<div className="flex flex-col gap-2 text-[#2A5381] box-number w-full shadow-[0_0_15px_rgb(6_80_254)] bg-white  rounded-lg p-4 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
						{/* {publishers?.length > 0 &&
							publishers.map((pls, index) => (
								<NavLink
									to={`/publisher/${pls?.slug}`}
									key={index}
									className={`border bg-white dark:bg-[rgb(3,3,40)] dark:text-amber-50 dark:hover:bg-indigo-800 py-1 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer text-center${pls?.slug == publisher?.slug ? " bg-amber-400!" : ""
										}`}
								>
									{pls?.name}
								</NavLink>
							))} */}
						{/* Mobile selected */}
						<div
							onClick={() => setOpen(!open)}
							className="md:hidden border py-2 rounded-full font-bold text-center cursor-pointer bg-white dark:bg-[rgb(3,3,40)]"
						>
							{publisher?.name || "Chọn nhà cái"}
						</div>

						{/* List */}
						<div className={`${open ? "block" : "hidden"} md:flex flex flex-col gap-2`}>
							{publishers?.map((pls, index) => (
								<NavLink
									key={index}
									to={`/publisher/${pls.slug}`}
									onClick={() => setOpen(false)}
									className={`border bg-white dark:bg-[rgb(3,3,40)] dark:text-amber-50 dark:hover:bg-indigo-800 py-1 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer text-center${pls?.slug == publisher?.slug ? " bg-amber-400!" : ""
										}
`}
								>
									{pls.name}
								</NavLink>
							))}
						</div>
					</div>
				</div>
				<div className="w-full">
					<div className="flex flex-col gap-2 text-[#2A5381] box-number w-full shadow-[0_0_15px_rgb(216_80_254)] bg-white  rounded-lg p-4 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
						<h3 className="text-center font-bold pt-3">Kết Quả Xổ Số</h3>
						<div className="text-center mb-3 font-semibold text-sm ">{publisher?.name}</div>
						{list?.items?.length > 0 &&
							list?.items.map((item: CommonFields, i: number) => (
								<div key={i} className=" bg-white shadow rounded-lg p-4 mt-1 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
									<div className="w-full bg-gray-300 py-2 rounded text-center font-semibold dark:bg-[rgb(3,3,40)] dark:text-amber-50 shadow shadow-amber-400">
										{item?.day}, {formatTime(item?.date, "DD/MM/YYYY")}
									</div>

									<div className="border rounded-lg overflow-hidden w-full bg-white mt-2 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
										{item?.prizes.length > 0 &&
											item?.prizes.map((row: CommonFields, index: number) => (
												<div key={index} className="grid grid-cols-2 border-b last:border-0">
													<div className="border-r text-gray-700 text-sm font-semibold flex items-center justify-center text-center dark:bg-[rgb(3,3,40)] dark:text-amber-50">{row.label}</div>

													<div className="text-sm">
														{row.values.map((v: string, i: number) => (
															<div
																key={i}
																className={`py-1 pr-1 text-right border-b last:border-0 ${row.special ? "text-red-500 font-bold" : "text-black font-semibold dark:bg-[rgb(3,3,40)] dark:text-amber-50"
																	}`}
															>
																{v}
															</div>
														))}
													</div>
												</div>
											))}
									</div>
								</div>
							))}
						{list?.total > list?.limit && convertPage(list?.total, list?.limit) > 0 && (
							<div className="mx-6 my-2 mb-10">
								<Pagination page={list?.page - 1} totalPage={convertPage(list?.total, list?.limit)} onPageChange={(event: any) => handleChangePage(event)} />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PublisherPage;
