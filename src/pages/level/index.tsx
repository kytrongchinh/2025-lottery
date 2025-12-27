import myapi from "@/services/myapi";
import { loadingAtom } from "@/stores";
import type { CommonFields } from "@/types/interface";
import { useEffect, useState, type FC } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

const LevelPage: FC = () => {
	const navigate = useNavigate();
	const [publishers, setPublishers] = useState<CommonFields[]>([]);
	const [levels, setLevels] = useState<CommonFields[]>([]);
	const [, setLoading] = useRecoilState(loadingAtom);

	const loadResult = async () => {
		try {
			setLoading(true);
			const items = await myapi.getLevels();
			if (items?.data) {
				setLevels(items?.data);
			}

			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
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
		} catch (error) {}
	};
	return (
		<div className="m-container w-full min-h-screen bg-gray-100 p-4">
			{/* <div className="max-w-[1400px] mx-auto flex gap-4"> */}
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
					<div className="flex flex-col gap-2 text-[#2A5381] box-number w-full  bg-white shadow rounded-lg p-4">
						<h3 className="text-center font-bold pt-3">List Level</h3>
						{levels?.length > 0 &&
							levels?.map((item: CommonFields, i: number) => (
								<div className="p-4" key={item?._id}>
									<div className="w-full overflow-x-auto">
										<table className="min-w-[900px] bg-white border border-gray-300 rounded-lg overflow-hidden">
											<thead className="bg-gray-100">
												<tr>
													<th className="px-4 py-2 border-b">#</th>
													<th className="px-4 py-2 border-b">Level</th>
													<th className="px-4 py-2 border-b">Rate</th>
													<th className="px-4 py-2 border-b">Value</th>
												</tr>
											</thead>

											<tbody>
												<tr key={item?._id} className="text-center hover:bg-gray-50">
													<td className="px-4 py-2 border-b">{i + 1}</td>

													<td className="px-4 py-2 border-b">{item?.level}</td>
													<td className="px-4 py-2 border-b">{item?.rate} %</td>
													<td className="px-4 py-2 border-b">{">="} {item?.level_value?.toLocaleString()}</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LevelPage;
