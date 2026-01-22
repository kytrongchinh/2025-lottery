import { BetSection } from "@/pages/folkgame/BetSection";
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
type SelectedBet = {
	name: string;
	rate: number;
	label: string;
	type: string;
	group: string;
	description?: string;
};
const FolkGameDetailPage: FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const [publishers, setPublishers] = useState<CommonFields[]>([]);
	const [, setLoading] = useRecoilState(loadingAtom);
	const id = params?.id || "";
	const [bet, setBet] = useState<CommonFields>({});
	const [selectedBets, setSelectedBets] = useState<SelectedBet[]>([]);
	const [folkGames, setFolkGames] = useState<CommonFields[]>([]);
	const auth = useRecoilValue(authAtom) as CommonFields;
	const loadFolkGame = async () => {
		try {
			const items = await myapi.getFolkGame();
			if (items?.status == 200 && items?.result?.data) {
				const data = items?.result?.data;
				setFolkGames(data);

			}
		} catch (error) { }
	};
	const loadDetail = async () => {
		try {
			setLoading(true);
			const item = await myapi.getFolkGameBetDetail(auth?.access_token, id);
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
		loadFolkGame();
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
				<div className="w-full mb-10">
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

						<div className="w-full m-auto rounded-lg overflow-hidden ">
							{folkGames?.length > 0 && folkGames.map((section, index) => (
								<BetSection
									key={section.label}
									label={section.label}
									group={section?.group}
									description={section?.description}
									cols={section.cols}
									items={section.items}
									selected={bet?.selected}
									setSelected={setSelectedBets}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FolkGameDetailPage;
