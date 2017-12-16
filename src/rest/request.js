const snekfetch = require("snekfetch");
const logger = require("../util/Logger");
const { userAgent } = require("../Constants");
const { parseString } = require("xml2js");

async function getNation() {
  try {
    const result = await snekfetch
      .get("https://www.nationstates.net/cgi-bin/api.cgi?q=happenings;filter=founding;limit=5")
      .set({ "User-Agent": userAgent });
    let nation;
    parseString(result.text, (err, obj) => {
      if (err) throw err;
      const raw = obj.WORLD.HAPPENINGS[0].EVENT[0];
      const text = raw.TEXT[0].split("@@").join("");
      [nation] = text.trim().split(" ");
    });
    return nation;
  } catch (error) {
    logger.error("NSAPI", error.stack);
    return null;
  }
}

function sendTG({ clientid, tgid, secret, nation } = {}) {
  return new Promise(async (resolve, reject) => {
    if (!clientid || !tgid || !secret || !nation || nation === null) reject(new RangeError("PARAMS_MISSING"));
    try {
      const res = await snekfetch
        .get(`https://www.nationstates.net/cgi-bin/api.cgi?a=sendTG&client=${clientid}&tgid=${tgid}&key=${secret}&to=${nation}`)
        .set({ "User-Agent": userAgent });

      if (res.status !== 200) {
        reject(res.text);
      }
      resolve({ status: res.text, code: res.status });
    } catch (error) {
      logger.error("NSAPI", error);
      reject(error);
    }
  });
}

module.exports = {
  sendTG,
  getNation
};