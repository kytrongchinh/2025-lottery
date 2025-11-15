import React, { FC, memo } from "react";
import classNames from "clsx";
import { motion, Transition, useWillChange } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MOTION_BUTTON = {
	INIT: {},
	TAP: {
		scale: 0.9,
	},
	TRANSITION: {
		type: "spring" as const,
		stiffness: 400,
		damping: 17,
	} as Transition,
};

type Props = {
	name: string;
	decord?: boolean;
	className?: string;
	stopWhileTap?: boolean;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	href?: string;
};

const ButtonMotion: FC<Props> = ({ name, className, stopWhileTap = false, ...props }) => {
	const buttonWillChange = useWillChange();
	const buttonClassName = classNames({ "button-style": true }, className);
	const navigate = useNavigate();

	const handleButtonClick = () => {
		if (props?.onClick) {
			props?.onClick();
		} else if (props?.href) {
			navigate(props?.href, { replace: true });
		}
	};
	console.log("name", name);
	return (
		<motion.button
			{...props}
			disabled={props?.disabled}
			onClick={handleButtonClick}
			className={buttonClassName}
			whileTap={!stopWhileTap ? MOTION_BUTTON.TAP : ""}
			transition={MOTION_BUTTON.TRANSITION}
			style={{ willChange: buttonWillChange, ...MOTION_BUTTON.INIT }}
		>
			<span dangerouslySetInnerHTML={{ __html: name || "" }} />
		</motion.button>
	);
};

export default memo(ButtonMotion);
