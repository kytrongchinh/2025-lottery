const express = require("express");
const helmet = require("helmet");
const v2025 = express();
const { checkLoginToken, checkFollow } = require("../../../utils/middleware");

v2025.use(helmet(appConfig.helmet));



module.exports = v2025;
