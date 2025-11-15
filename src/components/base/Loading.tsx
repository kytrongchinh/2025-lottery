import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useRecoilValue } from "recoil";
import { loadingAtom } from "@/stores";

const Loading = () => {
	const loading = useRecoilValue(loadingAtom);
	return (
		<Backdrop open={loading} sx={{ zIndex: 100 }}>
			<CircularProgress sx={{ color: "white" }} />
		</Backdrop>
	);
};

export default Loading;
