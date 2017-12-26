const request = require("snekfetch");
const { USER_AGENT } = require("../util/Constants");
const { parseString } = require("xml2js");

module.exports = class Request {
  static getNation() {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await request
          .get("https://www.nationstates.net/cgi-bin/api.cgi?q=happenings;filter=founding;limit=5")
          .set({ "User-Agent": USER_AGENT });

        if (result.status !== 200) {
          reject(result.text);
        }
        let nation;
        parseString(result.text, (err, obj) => {
          if (err) throw err;
          const raw = obj.WORLD.HAPPENINGS[0].EVENT[0];
          const text = raw.TEXT[0].split("@@").join("");
          [nation] = text.trim().split(" ");
        });
        resolve(nation);
      } catch (error) {
        reject(error);
      }
    });
  }

  static sendTG({ clientID, tgID, secret, nation } = {}) {
    return new Promise(async (resolve, reject) => {
      if (!clientID || !tgID || !secret || !nation || nation === null) reject(new RangeError("PARAMS_MISSING"));
      try {
        const res = await request
          .get(`https://www.nationstates.net/cgi-bin/api.cgi?a=sendTG&client=${clientID}&tgid=${tgID}&key=${secret}&to=${nation}`)
          .set({ "User-Agent": USER_AGENT });

        if (res.status !== 200) {
          reject(res.text);
        }
        resolve({ status: res.text.includes("\n") ? res.text.replace("\n", "") : res.text, code: res.status });
      } catch (error) {
        reject(error);
      }
    });
  }
};