import { HTTP_METHOD, HTTP_STATUS_CODE } from "@/types/contants";
import type { AxiosData, CommonData, MyApiResponse } from "@/types/interface";
import type { ParamsAxios } from "@/types/types";
import CallApi from "@/utils/call-api";

class MyApi extends CallApi {
	private my_url: string;
	private verify_token: string;
	constructor() {
		super();
		this.my_url = import.meta.env.VITE_MY_API_URL || "";
		this.verify_token = import.meta.env.VITE_MY_VERIFY_TOKEN || "sh05GbVwrIqc4wxFaMr5hbk";
	}

	/**
	 * Campaign information
	 * @param {*} token
	 * @param {*} data
	 * @returns
	 */

	//*********Campaign info**************/
	async info() {
		try {
			const url = `${this.my_url}/info`;
			const params: ParamsAxios = {
				url,
				headers: { "x-verify-token": this.verify_token },
				method: HTTP_METHOD.GET,
			};

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error info :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	//*********login**************/
	async login(data: AxiosData) {
		try {
			const url = `${this.my_url}/user/login`;
			const params: ParamsAxios = {
				url,
				headers: { "x-verify-token": this.verify_token },
				method: HTTP_METHOD.POST,
				data: data,
			};

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error login :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	//*********User**************/
	async getUser(token: string) {
		try {
			const url = `${this.my_url}/user`;
			const params: ParamsAxios = {
				url,
				headers: {
					"x-verify-token": this.verify_token,
					"x-login-token": token,
				},
				method: HTTP_METHOD.GET,
			};

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error getUser :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async myGift(token: string, page = 0, limit = 6) {
		try {
			const url = `${this.my_url}/gift/my-gift?page=${page}&limit=${limit}`;
			const params: ParamsAxios = {
				url,
				headers: {
					"x-verify-token": this.verify_token,
					"x-login-token": token,
				},
				method: HTTP_METHOD.GET,
			};

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error myGift :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	//*********PUBLISHERS**************/
	async getPublishers(region: string) {
		try {
			const url = `${this.my_url}/publisher/list?region=${region}`;
			const params: ParamsAxios = {
				url,
				headers: {
					"x-verify-token": this.verify_token,
				},
				method: HTTP_METHOD.GET,
			};

			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error getUser :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getNextSchedule(publisher: string) {
		try {
			const url = `${this.my_url}/schedule/next?publisher=${publisher}`;
			const params: ParamsAxios = {
				url,
				headers: {
					"x-verify-token": this.verify_token,
				},
				method: HTTP_METHOD.GET,
			};

			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error getNextSchedule :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getResultSchedule(publisher: string) {
		try {
			const url = `${this.my_url}/schedule/result?publisher=${publisher}`;
			const params: ParamsAxios = {
				url,
				headers: {
					"x-verify-token": this.verify_token,
				},
				method: HTTP_METHOD.GET,
			};

			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error getNextSchedule :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getResultScheduleByDate(publisher: string, date: string, type: string) {
		try {
			const url = `${this.my_url}/schedule/result-by-date?publisher=${publisher}&date=${date}&type=${type}`;
			const params: ParamsAxios = {
				url,
				headers: {
					"x-verify-token": this.verify_token,
				},
				method: HTTP_METHOD.GET,
			};

			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error getResultScheduleByDate :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getResultScheduleByPublisher(publisher: string, page = 0, limit = 3) {
		try {
			const url = `${this.my_url}/schedule/result-publisher?publisher=${publisher}&page=${page}&limit=${limit}`;
			const params: ParamsAxios = {
				url,
				headers: {
					"x-verify-token": this.verify_token,
				},
				method: HTTP_METHOD.GET,
			};

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error myGift :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getTopDigit(digit: number, type: string, limit: number, publisher?: string, weight?: string) {
		try {
			let url = "";
			if (digit == 2) {
				url = `${this.my_url}/digit/digit2-top?type=${type}&limit=${limit}&publisher=${publisher}&weight=${weight}`;
			}
			if (digit == 3) {
				url = `${this.my_url}/digit/digit3-top?type=${type}&limit=${limit}&publisher=${publisher}&weight=${weight}`;
			}
			if (digit == 4) {
				url = `${this.my_url}/digit/digit4-top?type=${type}&limit=${limit}&publisher=${publisher}&weight=${weight}`;
			}
			const params: ParamsAxios = {
				url,
				headers: {
					"x-verify-token": this.verify_token,
				},
				method: HTTP_METHOD.GET,
			};

			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error getResultScheduleByDate :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async sendBet(token: string, data: AxiosData) {
		try {
			const url = `${this.my_url}/bet/create`;
			const params: ParamsAxios = { url, headers: { "x-verify-token": this.verify_token, "x-login-token": token }, method: HTTP_METHOD.POST, data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error sendCode :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getListBet(token: string, page = 0, limit = 6) {
		try {
			const url = `${this.my_url}/bet/history?page=${page}&limit=${limit}`;
			const params: ParamsAxios = {
				url,
				headers: {
					"x-verify-token": this.verify_token,
					"x-login-token": token,
				},
				method: HTTP_METHOD.GET,
			};

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error getListBet :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}
	async getBetDetail(token: string, id: string) {
		try {
			const url = `${this.my_url}/bet/detail?id=${id}`;
			const params: ParamsAxios = {
				url,
				headers: {
					"x-verify-token": this.verify_token,
					"x-login-token": token,
				},
				method: HTTP_METHOD.GET,
			};

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error getListBet :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getLevels() {
		try {
			const url = `${this.my_url}/rate/level`;
			const params: ParamsAxios = {
				url,
				headers: {
					"x-verify-token": this.verify_token,
				},
				method: HTTP_METHOD.GET,
			};

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error getLevels :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}
}
export default new MyApi();
