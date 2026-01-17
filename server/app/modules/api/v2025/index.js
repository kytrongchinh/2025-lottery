const express = require("express");
const helmet = require("helmet");
const v2025 = express();
const { checkLoginToken } = require("../../../utils/middleware");

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
v2025.use("/publisher", require("./publisher/index"));
v2025.use("/schedule", require("./schedule/index"));
v2025.use("/digit", require("./digit/index"));

v2025.use("/user", require("./user/index"));
v2025.use("/bet", require("./bet/index"));
v2025.use("/rate", require("./rate/index"));
v2025.use("/folkgame", require("./folkgame/index"));
v2025.use("/report", require("./report/index"));
v2025.use("/general", require("./general/index"));

module.exports = v2025;
