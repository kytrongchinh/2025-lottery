import customClass from "clsx";

import type { CommonFields } from "@/types/interface";
import type { FC } from "react";

import number_0 from "@/assets/images/numbers/num_0.png";
import number_1 from "@/assets/images/numbers/num_1.png";
import number_2 from "@/assets/images/numbers/num_2.png";
import number_3 from "@/assets/images/numbers/num_3.png";
import number_4 from "@/assets/images/numbers/num_4.png";
import number_5 from "@/assets/images/numbers/num_5.png";
import number_6 from "@/assets/images/numbers/num_6.png";
import number_7 from "@/assets/images/numbers/num_7.png";
import number_8 from "@/assets/images/numbers/num_8.png";
import number_9 from "@/assets/images/numbers/num_9.png";

export const IMAGE_NAME = {
	number_0: "number_0",
	number_1: "number_1",
	number_2: "number_2",
	number_3: "number_3",
	number_4: "number_4",
	number_5: "number_5",
	number_6: "number_6",
	number_7: "number_7",
	number_8: "number_8",
	number_9: "number_9",
};
export const imageList: CommonFields = {
	number_0,
	number_1,
	number_2,
	number_3,
	number_4,
	number_5,
	number_6,
	number_7,
	number_8,
	number_9,
};

type ImageProps = {
	image: string;
	customFunction?: () => void;
	customWrapperClass?: string;
	imageClass?: string;
	noWrapper?: boolean;
	imageSrc?: string;
};

const Image: FC<ImageProps> = ({ image, imageSrc, customFunction, customWrapperClass = "", imageClass = "", noWrapper = true, ...rest }) => {
	const wrapperClass = customClass({
		[customWrapperClass]: true,
	});

	const imageElClass = customClass({
		[imageClass]: true,
	});

	if (noWrapper) return <img onClick={customFunction} src={imageSrc ? imageSrc : imageList[image]} className={imageElClass} alt={imageList[image]} />;

	return (
		<div className={wrapperClass} onClick={customFunction} {...rest}>
			<img src={imageSrc ? imageSrc : imageList[image]} className={imageElClass} alt="" />
		</div>
	);
};

export default Image;
