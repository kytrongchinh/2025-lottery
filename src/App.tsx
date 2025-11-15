import { RecoilRoot } from "recoil";

import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { RouterCustom } from "./router";

const MyApp = () => {
	if (import.meta.env.MODE == "development") {
		return (
			<RecoilRoot>
				<HelmetProvider>
					<BrowserRouter>
						<RouterCustom />
					</BrowserRouter>
				</HelmetProvider>
			</RecoilRoot>
		);
	} else {
		return (
			<RecoilRoot>
				<HelmetProvider>
					<BrowserRouter>
						<RouterCustom />
					</BrowserRouter>
				</HelmetProvider>
			</RecoilRoot>
		);
	}
};
export default MyApp;

