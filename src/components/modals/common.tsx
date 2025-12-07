import React, { type FC } from "react";
import Modal from "react-modal";
// -- Components --
import _ from "lodash";
import "./modals.scss";

import { motion } from "framer-motion";

import close from "@/assets/images/close.png";
import ButtonDefault from "../ButtonDefault/ButtonDefault";
import type { CommonForm, CommonProps } from "@/types/interface";
import { MODAL_NAME } from "@/types/contants";
import { useForm, type FieldErrors } from "react-hook-form";
import useAuth from "@/hooks/useAuth";

const CommonModal: FC<CommonProps> = (props) => {
	const { handleLogin } = useAuth();
	const { modalIsOpen, onClose, content, name, buttonName = "Về OA", handleModalActionClick, noted = "" } = props;
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ shouldFocusError: true });

	const onSubmit = async (data: CommonForm) => {
		try {
			const login = await handleLogin(data?.username, data?.password);
			if (login?.success) {
				onClose();
			}
		} catch (error) {}
	};
	const onError = (e: FieldErrors) => {
		console.log(`==>`, e);
	};
	const renderContent = () => {
		let button: string | null | React.ReactElement = <ButtonDefault text={buttonName} buttonType="button-style flex justify-center mt-5" onClick={handleModalActionClick} />;

		if (name == MODAL_NAME.CONFIRM) {
			return (
				<div className="content">
					<div dangerouslySetInnerHTML={{ __html: content }} />
					<ButtonDefault
						text={buttonName}
						buttonType="button-style flex justify-center mt-5"
						onClick={() => {
							props?.onAction();
							onClose();
						}}
					/>
				</div>
			);
		} else if (name == MODAL_NAME.LOGIN) {
			return (
				<div className="content">
					<div className="w-full  flex items-center justify-center text-left">
						<div className="w-full">
							<h2 className="text-2xl font-bold text-center mb-6">Login</h2>

							<div className="flex flex-col gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
									<input
										type="text"
										{...register("username", {
											required: true,
											maxLength: 30,
											minLength: 1,
											pattern: /[a-zA-Z0-9]/,
										})}
										maxLength={30}
										className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="Enter username"
									/>
									{errors.username && <div className="text-sm text-red-500">Please enter your username</div>}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
									<input
										type="password"
										{...register("password", {
											required: true,
											maxLength: 30,
											minLength: 1,
											pattern: /[a-zA-Z0-9]/,
										})}
										className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="Enter password"
									/>
									{errors.password && <div className="text-sm text-red-500">Please enter your password</div>}
								</div>

								<button onClick={handleSubmit(onSubmit, onError)} className="w-full py-2 mt-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
									Login
								</button>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="content">
					<div dangerouslySetInnerHTML={{ __html: content }} />
					{button}
				</div>
			);
		}
	};

	const handelClickButton = async (buttonName = "") => {
		onClose();
	};

	return (
		<Modal isOpen={modalIsOpen} contentLabel="Example Modal" ariaHideApp={!modalIsOpen}>
			<div className="modal alert mt-5" style={{ marginTop: "80px" }}>
				<motion.div
					whileTap={{
						scale: 0.9,
					}}
					className="md-icon"
					onClick={() => {
						onClose();
					}}
				>
					<div className="img">
						<img src={close} alt="" />
					</div>
				</motion.div>

				<div className="px-5">
					<div className="md-content box">
						<div className="body">
							<div className="content text-center">{renderContent()}</div>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};
export default CommonModal;
