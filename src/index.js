const snekfetch = require("snekfetch");
const logger = require("./util/Logger");
const { clientid, telegramid, secretid } = require("../config.json");

snekfetch
  .get(`https://www.nationstates.net/cgi-bin/api.cgi?a=sendTG&client=${clientid}&tgid=${telegramid}&key=${secretid}&to=new-indochina`)
  .then(res => {
    logger.log("NSAPI", res.status);
    logger.log("NSAPI", res.ok);
  })
  .catch(error => logger.error("NSAPI", error.stack));