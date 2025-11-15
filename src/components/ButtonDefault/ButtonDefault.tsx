import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { type FC } from "react";
import "./styles.scss";
import type { CommonProps } from "@/types/interface";

const ButtonDefault: FC<CommonProps> = ({
	text,
	buttonType,
	onClick,
	href,
	align,
	customClass,
}) => {
	const navigate = useNavigate();

	const handleButtonClick = () => {
		if (onClick) {
			onClick();
		} else if (href) {
			navigate(href, { replace: true });
		}
	};

	return (
		<motion.div
			whileTap={{
				scale: 0.96,
			}}
			className={`button-default   ${buttonType} ${align} ${customClass}`}>
			<div className="wrap" onClick={handleButtonClick}>
				<span dangerouslySetInnerHTML={{ __html: text || "" }} />
			</div>
		</motion.div>
	);
};

export default ButtonDefault;
