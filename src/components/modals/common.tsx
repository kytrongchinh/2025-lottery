import React, { type FC } from "react";
import Modal from "react-modal";
// -- Components --
import _ from "lodash";
import "./modals.scss";

import { motion } from "framer-motion";

import close from "@/assets/images/close.png";
import ButtonDefault from "../ButtonDefault/ButtonDefault";
import type { CommonProps } from "@/types/interface";

const CommonModal: FC<CommonProps> = (props) => {
	const {
		modalIsOpen,
		onClose,
		content,
		name,
		buttonName = "Về OA",
		handleModalActionClick,
		noted = "",
	} = props;

	const renderContent = () => {
		let button: string | null | React.ReactElement = (
			<ButtonDefault
				text={buttonName}
				buttonType="button-style flex justify-center mt-5"
				onClick={handleModalActionClick}
			/>
		);

		return (
			<div className="content">
				<div dangerouslySetInnerHTML={{ __html: content }} />
				{button}
			</div>
		);
	};

	const handelClickButton = async (buttonName = "") => {
		onClose();
	};

	return (
		<Modal
			isOpen={modalIsOpen}
			contentLabel="Example Modal"
			ariaHideApp={!modalIsOpen}>
			<div className="modal alert mt-5" style={{ marginTop: "80px" }}>
				<motion.div
					whileTap={{
						scale: 0.9,
					}}
					className="md-icon"
					onClick={() => {
						onClose();
					}}>
					<div className="img">
						<img src={close} alt="" />
					</div>
				</motion.div>

				<div className="px-5">
					<div className="md-content box">
						<div className="body">
							<div className="content text-center">
								{renderContent()}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};
export default CommonModal;
