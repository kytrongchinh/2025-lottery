"use strict";

const Queue = require("bull");
const _ = require("lodash");
const { COLLECTIONS } = require("../../../../app/configs/constants");
const appConfig = require("../../../configs");
const luckyModel = require("../../lucky/models");

const { REDIS_CONFIG } = require("../../../configs/redis.constant");

const options = { removeOnSuccess: true, removeOnComplete: true, removeOnFailure: true, timeout: 20000 };

const config_bull = {
	redis: { ...REDIS_CONFIG, enableReadyCheck: false },
	defaultJobOptions: { ...options },
	prefix: REDIS_CONFIG.keyPrefix,
};

if (appConfig.env != "develop") {
	config_bull.settings = {
		// Enable trustProxy to handle X-Forwarded-For header
		trustProxy: true,
	};
}

global.callResultLottey = new Queue("callResultLottey2025_" + appConfig.env, config_bull);
callResultLottey.setMaxListeners(0);
callResultLottey.process(async (job) => {
	try {
		const date = job?.data?.date; // dd-mm-yyyy giống URL
		console.log("load data date:", date);
		const date_get = helpers.date.format(date, "DD-MM-YYYY");
		const data = await utils.bud_mu.fetchXSMN(date_get);
		const labelMap = {
			g8: "G8",
			g7: "G7",
			g6: "G6",
			g5: "G5",
			g4: "G4",
			g3: "G3",
			g2: "G2",
			g1: "G1",
			gdb: "G.Đặc Biệt",
		};

		if (data?.length > 0) {
			for (let index = 0; index < data.length; index++) {
				const item = data[index];
				const results = item?.prizes;
				const results_convert = Object.keys(results).map((key) => {
					const item = {
						label: labelMap[key],
						values: results[key],
					};
					if (key === "gdb") {
						item["special"] = true;
					}

					return item;
				});
				const data_update = {
					g8: item?.prizes?.g8,
					g7: item?.prizes?.g7,
					g6: item?.prizes?.g6,
					g5: item?.prizes?.g5,
					g4: item?.prizes?.g4,
					g3: item?.prizes?.g3,
					g2: item?.prizes?.g2,
					g1: item?.prizes?.g1,
					gdb: item?.prizes?.gdb,
					results: item?.prizes,
					prizes: results_convert,
					digit2: {},
					digit3: {},
					digit4: {},
					status: 1,
					// publisher_slug: item?.matinh,
				};
				const prizes = item?.prizes;
				if (prizes) {
					const last2DigitsPrizes = {};
					for (const key in prizes) {
						last2DigitsPrizes[key] = prizes[key].map((num) => num.slice(-2));
					}
					data_update.digit2 = last2DigitsPrizes;

					const prizes3Digits = {};
					for (const key in prizes) {
						prizes3Digits[key] = prizes[key]
							.filter((num) => num.length >= 3) // chỉ giữ số có từ 3 chữ số
							.map((num) => num.slice(-3)); // lấy 3 số cuối
					}
					data_update.digit3 = prizes3Digits;

					const prizes4Digits = {};
					for (const key in prizes) {
						prizes4Digits[key] = prizes[key]
							.filter((num) => num.length >= 4) // chỉ giữ số có từ 4 chữ số
							.map((num) => num.slice(-4)); // lấy 4 số cuối
					}
					data_update.digit4 = prizes4Digits;
				}
				const up = await luckyModel.updateOne(COLLECTIONS.SCHEDULE, { publisher_name: item?.province, publisher_slug: item?.matinh, date: date, status: 0 }, data_update);
				if (up?.status) {
					const schedule = up?.msg;
					const data_in = {
						publisher_id: schedule?.publisher_id,
						publisher: schedule?.publisher.toString(),
						publisher_name: schedule?.publisher_name,
						publisher_slug: schedule?.publisher_slug,
						date: schedule?.date,
						month: schedule?.month,
						year: schedule?.year,
						digit2: Object.values(schedule?.digit2 || data_update.digit2).flat(),
						digit3: Object.values(schedule?.digit3 || data_update.digit3).flat(),
						digit4: Object.values(schedule?.digit4 || data_update.digit4).flat(),
						status: 1,
					};
					luckyModel.create(COLLECTIONS.DIGIT, data_in);
				}
				// luckyModel.updateOne(COLLECTIONS.SCHEDULE, { publisher_name: item?.province, date: date, status: 0 }, data_update);
			}
		}
		return true;
	} catch (error) {
		console.log(error, "error");
		return false;
	}
});

global.callResultBet = new Queue("callResultBet2025_" + appConfig.env, config_bull);
callResultBet.setMaxListeners(0);
callResultBet.process(async (job) => {
	try {
		const item = job?.data?.item; // dd-mm-yyyy giống URL
		const grouped = {};
		if (item) {
			const checkedItems = item?.checkedItems;

			Object.entries(checkedItems).forEach(([key, value]) => {
				const [group, idxStr] = key.split("_");
				const index = Number(idxStr) - 1;

				if (!grouped[group]) grouped[group] = [];

				grouped[group][index] = value;
			});
			console.log(grouped, "grouped");
		}

		let winCount = 0;
		let lossCount = 0;
		const resultData = {};
		const schedule = await luckyModel.findOne(COLLECTIONS.SCHEDULE, { status: 1, date: item?.date_schedule, publisher_id: item?.publisher_id });
		const A = grouped;
		const B = item?.number;
		const wins = {};
		if (schedule && A) {
			let C = schedule?.digit2;
			if (item?.type == 3) {
				C = schedule?.digit3;
			}
			if (item?.type == 4) {
				C = schedule?.digit4;
			}
			for (const group in A) {
				const chooseArr = A[group];
				const resultDigits = C[group] || [];

				let isWin = false;

				chooseArr.forEach((selected, index) => {
					if (selected === true) {
						if (String(B).padStart(item?.type, "0") === resultDigits[index]) {
							isWin = true;
							winCount++;
						} else {
							lossCount++;
						}
					}
				});

				resultData[group] = {
					choose: chooseArr,
					is_win: isWin,
					digit: B,
				};
				if (isWin) {
					wins[group] = {
						choose: chooseArr,
						is_win: isWin,
						digit: B,
					};
				}
			}
		}

		// tinh tien loi nhuan
		const profit = winCount * item?.amount * item?.rate;
		const loss = lossCount * item?.amount;
		const is_win = winCount > 0 ? true : false;
		const data_win = {
			profit,
			is_win,
			wins,
			resultData,
			winCount,
			status: 1,
		};

		const updateBet = await luckyModel.updateOne(COLLECTIONS.BET, { _id: item?._id }, data_win);
		if (updateBet?.status == true) {
			// update profit and lose user bet date
			const bet = updateBet?.msg;
			let data_update = {
				$inc: {
					profit: Number(profit) || 0,
					loss: Number(loss) || 0,
					"digit_two.profit": Number(profit) || 0,
					"digit_two.loss": Number(loss) || 0
				},
			};
			if (item?.type == 3) {
				data_update = {
					$inc: {
						profit: Number(profit) || 0,
						loss: Number(loss) || 0,
						"digit_three.profit": Number(profit) || 0,
						"digit_three.loss": Number(loss) || 0
					},
				};
			}
			if (item?.type == 4) {
				data_update = {
					$inc: {
						profit: Number(profit) || 0,
						loss: Number(loss) || 0,
						"digit_four.profit": Number(profit) || 0,
						"digit_four.loss": Number(loss) || 0
					},
				};
			}
			luckyModel.updateOne(COLLECTIONS.USET_BET_DATES, { date: bet?.date, user_id: bet?.user_id }, data_update);
			luckyModel.updateOne(COLLECTIONS.USET_BETS, { user_id: bet?.user_id }, data_update);

			luckyModel.updateOne(COLLECTIONS.PUBLISHER_BET_DATES, { date: bet?.date, publisher_id: bet?.publisher_id }, data_update);
			luckyModel.updateOne(COLLECTIONS.PUBLISHER_BETS, { publisher_id: bet?.publisher_id }, data_update);
			// update profit and lose user bet
		}
		return true;
	} catch (error) {
		console.log(error, "error");
		return false;
	}
});


global.callResultFolkGameBet = new Queue("callResultFolkGameBet2025_" + appConfig.env, config_bull);
callResultFolkGameBet.setMaxListeners(0);
callResultFolkGameBet.process(async (job) => {
	try {
		const item = job?.data?.item; // dd-mm-yyyy giống URL
		const schedule = await luckyModel.findOne(COLLECTIONS.SCHEDULE, { status: 1, date: item?.date_schedule, schedule_id: item?.schedule_id });
		const g8 = schedule?.digit2?.g8;
		const gdb = schedule?.digit2?.gdb;

		// const g8 = 10;
		// const gdb = 92;
		const topCond = {
			big: g8 >= 50,
			small: g8 < 50,
			odd: g8 % 2 != 0,
			even: g8 % 2 == 0,
			pair: [11, 22, 33, 44, 55, 66, 77, 88, 99].includes(g8),
			dragon: [12, 23, 34, 45, 56, 67, 78, 89].includes(g8),

			big_odd: g8 >= 50 && g8 % 2 != 0,
			big_even: g8 >= 50 && g8 % 2 == 0,
			small_odd: g8 < 50 && g8 % 2 != 0,
			small_even: g8 < 50 && g8 % 2 == 0,
		};

		const bottomCond = {
			big: gdb >= 50,
			small: gdb < 50,
			odd: gdb % 2 != 0,
			even: gdb % 2 == 0,
			pair: [11, 22, 33, 44, 55, 66, 77, 88, 99].includes(gdb),
			dragon: [12, 23, 34, 45, 56, 67, 78, 89].includes(gdb),

			small_odd: gdb < 50 && gdb % 2 != 0,
			small_even: gdb < 50 && gdb % 2 == 0,
		};

		const topBottomCond = {
			big: g8 >= 50 && gdb >= 50,
			small: g8 < 50 && gdb < 50,
			odd: g8 % 2 != 0 && gdb % 2 != 0,
			even: g8 % 2 == 0 && gdb % 2 == 0,
		};

		const topEwsnCond = {
			east: g8 < 25,
			south: g8 >= 25 && g8 < 50,
			west: g8 >= 50 && g8 < 75,
			north: g8 >= 75,
		};

		const conditionMap = {
			top: topCond,
			bottom: bottomCond,
			top_bottom: topBottomCond,
			top_ewsn: topEwsnCond,
		};
		// const selected = [{ "group": "top_ewsn", "label": "Top (E-W-S-N)", "name": "West", "rate": 3.7, "description": "50-74", "type": "west" }, { "group": "top", "label": "Top", "name": "Small", "rate": 1.96, "description": "00-49", "type": "small" }, { "group": "top", "label": "Top", "name": "Big Odd", "rate": 3.7, "description": "50-99 & last 1,3,5,7,9", "type": "big_odd" }, { "group": "top", "label": "Top", "name": "Odd", "rate": 1.96, "description": "last 1,3,5,7,9", "type": "odd" }, { "group": "bottom", "label": "Bottom", "name": "Small", "rate": 1.96, "description": "00-49", "type": "small" }, { "group": "bottom", "label": "Bottom", "name": "Small Even", "rate": 3.7, "description": "00-49 & last 2,4,6,8", "type": "small_even" }, { "group": "top_bottom", "label": "Top & Bottom", "name": "Big", "rate": 3.7, "description": "50-99", "type": "big" }]
		const selected = item?.selected;
		const betAmount = item?.amount;

		const result = selected.map(item => {
			const isWin =
				conditionMap[item.group]?.[item.type] === true;

			return {
				...item,
				is_win: isWin,
				win_amount: isWin ? betAmount * item.rate : 0,
			};
		});

		const summary = result.reduce(
			(acc, item) => {
				if (item.is_win) {
					acc.winItems.push(item);
					acc.totalWinCount += 1;
					acc.totalWinAmount += item.win_amount;
				}
				return acc;
			},
			{
				winItems: [],
				totalWinCount: 0,
				totalWinAmount: 0,
			}
		);

		const { winItems, totalWinCount, totalWinAmount } = summary;

		// tinh tien loi nhuan
		const profit = totalWinAmount - item?.amount * item?.count > 0 ? totalWinAmount - item?.amount * item?.count : 0;
		const loss = totalWinAmount > item?.amount * item?.count ? totalWinAmount - item?.amount * item?.count : item?.amount * item?.count - totalWinAmount;
		const is_win = totalWinAmount > item?.amount * item?.count ? true : false;
		const data_win = {
			profit,
			is_win,
			wins: winItems,
			resultData: result,
			winCount: totalWinCount,
			status: 1,
		};

		const updateBet = await luckyModel.updateOne(COLLECTIONS.FOLKGAME_BETS, { _id: item?._id }, data_win);
		if (updateBet?.status == true) {
			// update profit and lose user bet date
			const bet = updateBet?.msg;
			const data_update = {
				$inc: {
					profit: Number(profit) || 0,
					loss: Number(loss) || 0,
					"folk_game.profit": Number(profit) || 0,
					"folk_game.loss": Number(loss) || 0
				},
			};
			luckyModel.updateOne(COLLECTIONS.USET_BET_DATES, { date: bet?.date, user_id: bet?.user_id }, data_update);
			luckyModel.updateOne(COLLECTIONS.USET_BETS, { user_id: bet?.user_id }, data_update);

			luckyModel.updateOne(COLLECTIONS.PUBLISHER_BET_DATES, { date: bet?.date, publisher_id: bet?.publisher_id }, data_update);
			luckyModel.updateOne(COLLECTIONS.PUBLISHER_BETS, { publisher_id: bet?.publisher_id }, data_update);
			// update profit and lose user bet
		}
		return true;
	} catch (error) {
		console.log(error, "error");
		return false;
	}
});

class base_worker {
	constructor() { }

	async call_result_lottey(data) {
		const job = await callResultLottey.add(data, { delay: 5000 });

		return new Promise((res, rej) => {
			callResultLottey.on("completed", (jobjob, result) => {
				if (job?.id == jobjob?.id) {
					console.log(jobjob?.id, "jobjob?.id");
					job.remove();
					res(result);
				}
			});
			callResultLottey.on("error", (err) => {
				console.log("data", err);
				rej(err);
			});
			callResultLottey.on("failed", (err) => {
				console.log("data", err);
				rej(err);
			});
		});
	}

	async call_result_bet(data) {
		const job = await callResultBet.add(data, { delay: 5000 });

		return new Promise((res, rej) => {
			callResultBet.on("completed", (jobjob, result) => {
				if (job?.id == jobjob?.id) {
					console.log(jobjob?.id, "jobjob?.id");
					job.remove();
					res(result);
				}
			});
			callResultBet.on("error", (err) => {
				console.log("data", err);
				rej(err);
			});
			callResultBet.on("failed", (err) => {
				console.log("data", err);
				rej(err);
			});
		});
	}

	async call_result_folkgame_bet(data) {
		const job = await callResultBet.add(data, { delay: 5000 });

		return new Promise((res, rej) => {
			callResultBet.on("completed", (jobjob, result) => {
				if (job?.id == jobjob?.id) {
					console.log(jobjob?.id, "jobjob?.id");
					job.remove();
					res(result);
				}
			});
			callResultBet.on("error", (err) => {
				console.log("data", err);
				rej(err);
			});
			callResultBet.on("failed", (err) => {
				console.log("data", err);
				rej(err);
			});
		});
	}
}

module.exports = new base_worker();
