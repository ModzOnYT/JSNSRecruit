const { EventEmitter } = require("events");
const logger = require("./util/Logger");
const { getNation, sendTG } = require("./rest/request");

module.exports = class jsNSRecruit extends EventEmitter {
  constructor(options = {}) {
    if (typeof options.clientID === "undefined") throw new RangeError("A client ID must be provided");
    if (typeof options.tgID === "undefined") throw new RangeError("A telegram ID must be provided");
    if (typeof options.secret === "undefined") throw new RangeError("A telegram secret must be provided");

    super(options);

    this.clientID = options.clientID;
    this.telegramID = options.tgID;
    this.telegramSecret = options.secret;
  }
  init() {
    logger.info("RECRUITER", "Getting ready...");

    setTimeout(async () => {
      try {
        const nation = await getNation();
        const { status, code } = await sendTG(this.clientID, this.telegramID, this.telegramSecret, nation);

        /**
         * Emitted when a telegram has succesfully been sent
         */
        this.emit("telegramSucess", status, code);
      } catch (error) {
        this.emit("telegramError", error);
      }
    }, 190e3);
  }
};