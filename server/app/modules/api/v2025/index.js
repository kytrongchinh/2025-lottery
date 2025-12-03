const express = require("express");
const helmet = require("helmet");
const v2025 = express();
const { checkLoginToken, checkFollow } = require("../../../utils/middleware");

v2025.use(helmet(appConfig.helmet));

// v2025.use(checkTimeline);
/**
 * Logins the user
 */
// v2025.use("/login", require("./login/index"));
/**
 *  The user information
 */
v2025.use("/info", require("./info/index"));
v2025.use("/mini", require("./mini/index"));

// v2025.use("/user", checkLoginToken, require("./user/index"));

module.exports = v2025;
