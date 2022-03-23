const moment = require("moment");
function formatMessage(username, message) {
  return {
    user: username,
    message,
    time: moment().format("h:mm a"),
  };
}

module.exports = formatMessage;
