import Pagination from "@/components/Pagination/Pagination";
import myapi from "@/services/myapi";
import { loadingAtom } from "@/stores";
import type { CommonFields } from "@/types/interface";
import { convertPage, getLangContent } from "@/utils/base";
import { useEffect, useReducer, useState, type FC } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
function LangButton({
	label,
	active,
	onClick,
}: {
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer 
        ${active
					? "bg-blue-600 text-white shadow"
					: "bg-gray-200 text-gray-700 hover:bg-gray-300"
				}`}
		>
			{label}
		</button>
	);
}


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
const FaqPage: FC = () => {
	const navigate = useNavigate();
	const [publishers, setPublishers] = useState<CommonFields[]>([]);
	const [publisher, setPublisher] = useState<CommonFields>({});
	const [pageNum, setPageNum] = useState(0);
	const [, setLoading] = useRecoilState(loadingAtom);
	const [{ loading, error, list }, dispatch] = useReducer(reducer, {
		loading: false,
		list: [],
		error: "",
	});

	const loadFqa = async () => {
		try {
			setLoading(true);
			dispatch({ type: "FETCH_REQUEST" });
			const result = await myapi.getFaqs();
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
		const result = await myapi.getFaqs(selected + 1);
		dispatch({
			type: "FETCH_SUCCESS",
			payload: result?.data,
		});
		setLoading(false);
	};

	useEffect(() => {
		loadPublisher();
		loadFqa();
	}, []);

	const loadPublisher = async () => {
		try {
			const items = await myapi.getPublishers("");
			if (items?.status == 200 && items?.result?.data) {
				const pblsers = items?.result?.data?.publishers;
				setPublishers(pblsers);
				setPublisher(pblsers[0]);
			}
		} catch (error) { }
	};

	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	type Lang = "vn" | "eng" | "cn";
	const [lang, setLang] = useState<Lang>("vn");
	const toggle = (index: number) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	return (
		<div className="m-container w-full min-h-screen bg-gray-100 p-4 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
			{/* <div className="max-w-[1400px] mx-auto flex gap-4"> */}
			<div
				className="max-w-[1400px] mx-auto grid gap-4
    grid-cols-1          /* Mobile: 1 cột */
    md:grid-cols-[260px_1fr]   /* Tablet: Sidebar + Center */
    lg:grid-cols-[260px_1fr]  /* Desktop: 3 cột */"
			>
				<div className="hidden  w-full md:w-[260px]  px-0 md:flex flex-col gap-4">
					<div className="flex flex-col gap-2 text-[#2A5381] box-number w-full shadow-[0_0_15px_rgb(6_80_254)] bg-white  rounded-lg p-4 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
						{publishers?.length > 0 &&
							publishers.map((pls, index) => (
								<NavLink
									to={`/publisher/${pls?.slug}`}
									key={index}
									className={`border bg-white dark:bg-[rgb(3,3,40)] dark:text-amber-50 dark:hover:bg-indigo-800 py-1 rounded-4xl font-bold hover:bg-gray-200 cursor-pointer text-center${pls?.slug == publisher?.slug ? " bg-amber-400!" : ""
										}`}
								>
									{pls?.name}
								</NavLink>
							))}
					</div>
				</div>
				<div className="w-full">
					<div className="flex flex-col gap-2 text-[#2A5381] box-number w-full shadow-[0_0_15px_rgb(216_80_254)] bg-white  rounded-lg p-4 dark:bg-[rgb(3,3,40)] dark:text-amber-50">
						<h3 className="text-center font-bold pt-3">FAQ</h3>
						<div className="flex justify-center gap-3 mb-6">
							<LangButton label="🇻🇳 Việt" active={lang === "vn"} onClick={() => setLang("vn")} />
							<LangButton label="🇺🇸 English" active={lang === "eng"} onClick={() => setLang("eng")} />
							<LangButton label="🇨🇳 中文" active={lang === "cn"} onClick={() => setLang("cn")} />
						</div>
						{list?.items?.length > 0 && list?.items.map((faq: CommonFields, index: number) => (
							<div
								key={index}
								className="border border-gray-200 dark:border-blue-600 rounded-lg overflow-hidden"
							>
								<button
									onClick={() => toggle(index)}
									className="w-full flex cursor-pointer justify-between items-center px-4 py-3 font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[rgb(8,8,60)] dark:text-amber-50 dark:hover:bg-indigo-800 transition-colors"
								>
									<span>{getLangContent(faq?.title, lang)}</span>
									<span
										className={`transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""
											}`}
									>
										⌄
									</span>
								</button>

								<div
									className={`grid transition-all duration-300 ease-in-out ${activeIndex === index
										? "grid-rows-[1fr] opacity-100"
										: "grid-rows-[0fr] opacity-0"
										}`}
								>
									<div className="overflow-hidden px-4 py-3 text-gray-700 bg-white dark:bg-[rgb(3,3,40)] dark:text-amber-100">
										{getLangContent(faq?.content, lang)}
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="mx-6 my-2 mb-10">
						{list?.total > list?.limit && convertPage(list?.total, list?.limit) > 0 && (
							<Pagination page={list?.page - 1} totalPage={convertPage(list?.total, list?.limit)} onPageChange={(event: any) => handleChangePage(event)} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FaqPage;
