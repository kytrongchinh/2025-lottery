const fs = require('fs');
const path = require('path');

// import all schema file in this dir, except index.js
const db = {};
fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf('.js') !== 0) && (file !== 'index.js');
}).forEach(function (file) {
    const resourceModel = require(path.join(__dirname, file));
    db[resourceModel.modelName] = resourceModel;
});

//load model default
const myModel = require('../../../libs/mongoose');
const { COLLECTIONS } = require('../../../configs/constants');
const model = new myModel(db);

//load model custom
model['custom'] = {
    countBetSuccess: async () => {
        try {
            const redisKey = "TOTAL_BET_" + helpers.date.getToday();
            let data = await libs.redis.get(redisKey);
            if (data !== false && data !== null) {
                return data;
            }
            data = await model.count(COLLECTIONS.BET, {});
            if (data === null) {
                throw new Error("count failed");
            }
            // set redis
            await libs.redis.set(redisKey, data, 3600);
            return data;
        } catch (error) {
            console.log(error, "countUserTurnCodeSuccess");
            return 0;
        }
    },
    incrUserTurnCodeSuccess: async (uid) => {
        try {
            const redisKey = "TOTAL_BET" + helpers.date.getToday();
            await libs.redis.incrby(redisKey, 1, 3600);
            return true;
        } catch (error) {
            return false;
        }
    },
};
module.exports = model;
