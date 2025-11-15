import type { ParamsAxios } from "@/types/types";
import axios from "axios";

class CallApi {
	// Make the function generic with <T>
	http_request = <T>(params: ParamsAxios): Promise<T> => {
		return new Promise<T>((resolve, reject) => {
			if (!params.url) reject(new Error("No URL provided"));

			let headers = {
				Accept: "application/json",
				"Content-Type": "application/json; charset=utf-8",
			};

			if (typeof params.headers === "object") {
				headers = { ...headers, ...params.headers };
			}

			const axiosOptions = {
				baseURL: params.url,
				headers: headers,
				timeout: params?.timeout || 10000,
			};

			const axiosClient = axios.create(axiosOptions);

			if (params.method === "GET") {
				axiosClient
					.get(params.url, { params: params.data })
					.then((res) => resolve(res.data as T))
					.catch((err) => reject(err));
			} else if (params.method === "POST") {
				axiosClient
					.post(params.url, params.data)
					.then((res) => resolve(res.data as T))
					.catch((err) => {
						// console.log(`eee POST==>`, err);
						reject(err);
					});
			} else if (params.method === "PUT") {
				axiosClient
					.put(params.url, params.data)
					.then((res) => resolve(res.data as T))
					.catch((err) => reject(err));
			} else {
				reject(new Error("Invalid HTTP method"));
			}
		});
	};

	http_request_my_api = <T>(
		params: ParamsAxios
	): Promise<{ success: boolean; data?: T; errors?: any }> => {
		return new Promise<{ success: boolean; data?: T; errors?: any }>(
			(resolve) => {
				if (!params.url) {
					return resolve({
						success: false,
						errors: new Error("No URL provided"),
					});
				}

				let headers = {
					Accept: "application/json",
					"Content-Type": "application/json; charset=utf-8",
				};

				if (typeof params.headers === "object") {
					headers = { ...headers, ...params.headers };
				}

				const axiosOptions = {
					baseURL: params.url,
					headers: headers,
					timeout: params?.timeout || 10000,
				};

				const axiosClient = axios.create(axiosOptions);

				const handleResponse = (res: any) =>
					resolve({ success: true, data: res.data as T });
				const handleError = (err: any) => {
					// console.log(`HTTP Error:`, err?.response?.data || err);
					resolve({
						success: false,
						errors: err?.response?.data || err,
					});
				};

				if (params.method === "GET") {
					axiosClient
						.get(params.url, { params: params.data })
						.then(handleResponse)
						.catch(handleError);
				} else if (params.method === "POST") {
					axiosClient
						.post(params.url, params.data)
						.then(handleResponse)
						.catch(handleError);
				} else if (params.method === "PUT") {
					axiosClient
						.put(params.url, params.data)
						.then(handleResponse)
						.catch(handleError);
				} else {
					resolve({
						success: false,
						errors: new Error("Invalid HTTP method"),
					});
				}
			}
		);
	};

	http_request_my_api_2 = <T>(
		params: ParamsAxios
	): Promise<{ success: boolean; data?: T; errors?: any }> => {
		return new Promise<{ success: boolean; data?: T; errors?: any }>(
			(resolve) => {
				if (!params.url) {
					return resolve({
						success: false,
						errors: new Error("No URL provided"),
					});
				}

				let headers = {
					Accept: "application/json",
					"Content-Type": "application/json; charset=utf-8",
				};

				if (typeof params.headers === "object") {
					headers = { ...headers, ...params.headers };
				}

				const axiosOptions = {
					baseURL: params.url,
					headers: headers,
					timeout: params?.timeout || 10000,
				};

				const axiosClient = axios.create(axiosOptions);

				const handleResponse = (res: any) =>
					resolve({ success: true, data: res });
				const handleError = (err: any) => {
					// console.log(`HTTP Error:`, err?.response?.data || err);
					resolve({
						success: false,
						errors: err?.response?.data || err,
					});
				};

				if (params.method === "GET") {
					axiosClient
						.get(params.url, { params: params.data })
						.then(handleResponse)
						.catch(handleError);
				} else if (params.method === "POST") {
					axiosClient
						.post(params.url, params.data)
						.then(handleResponse)
						.catch(handleError);
				} else if (params.method === "PUT") {
					axiosClient
						.put(params.url, params.data)
						.then(handleResponse)
						.catch(handleError);
				} else {
					resolve({
						success: false,
						errors: new Error("Invalid HTTP method"),
					});
				}
			}
		);
	};
}

export default CallApi;
