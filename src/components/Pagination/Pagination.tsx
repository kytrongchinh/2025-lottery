import type { CommonProps } from "@/types/interface";
import ReactPaginate from "react-paginate";
import "./pagination.scss";
const Pagination = (props: CommonProps) => {
	const { page, totalPage, onPageChange } = props;

	if (totalPage === 1) return <></>;

	return (
		<ReactPaginate
			breakLabel="..."
			// nextLabel=""
			// previousLabel=""
			onPageChange={onPageChange}
			pageRangeDisplayed={2}
			pageCount={totalPage}
			renderOnZeroPageCount={null}
			forcePage={parseInt(page)}
			className="custom-pagination"
			activeClassName="pagination-item-active"
		/>
	);
};

export default Pagination;
