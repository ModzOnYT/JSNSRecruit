/* eslint-disable capitalized-comments */
const request = require("snekfetch");
const { USER_AGENT } = require("../util/Constants");
const { parseString } = require("xml2js");
const NSAPIError = require("../errors/nsAPIError");

let hasBeenRatelimited = false;

let nextTelegram = null;

class Request {
  /**
   * Get a nation with the Nationstates API
   * @return {Promise<string>}
   * @private
   */
  static getNation() {
    return new Promise(async (resolve, reject) => {
      if (hasBeenRatelimited === true) {
        reject(new NSAPIError("RATELIMITED"));
      }
      try {
        const result = await request
          .get("https://www.nationstates.net/cgi-bin/api.cgi?q=happenings;filter=founding;limit=5")
          .set({ "User-Agent": USER_AGENT });

        if (result.status === 200) {
          let nation;
          parseString(result.text, (err, obj) => {
            if (err) reject(err);
            const raw = obj.WORLD.HAPPENINGS[0].EVENT[0];
            const text = raw.TEXT[0].split("@@").join("");
            [nation] = text.trim().split(" ");
          });
          resolve(nation);
        }
        if (result.status === 429 || typeof result.headers["X-Retry-After"] !== "undefined") {
          hasBeenRatelimited = true;
          setTimeout(() => {
            hasBeenRatelimited = false;
          }, 900e3);
          reject(new NSAPIError("RATELIMIT"));
        }
        if (result.status === 403) {
          reject(new NSAPIError("INVALID_OPTIONS"));
        }
        if (result.status === 404) {
          reject(new NSAPIError("NOT_FOUND"));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Sends a telegram with the Nationstates API
   * @param {Object} options - Options passed
   * @param {string} options.clientID - The Client ID
   * @param {string} options.tgID - The Telegram ID of the telegram to send
   * @param {string} options.secret - The Secret ID of the telegram to send
   * @param {string} options.nation - The nation to send the telegram to
   * @return {Promise<Snekfetch>}
   * @private
   */
  static sendTG({ clientID, tgID, secret, nation } = {}) {
    return new Promise(async (resolve, reject) => {
      if (!clientID || !tgID || !secret || !nation || nation === null) reject(new NSAPIError("INVALID_OPTIONS"));
      if (nextTelegram > Date.now() || hasBeenRatelimited) reject(new NSAPIError("TOO_MANY_REQUESTS"));
      try {
        const res = await request
          .get(`https://www.nationstates.net/cgi-bin/api.cgi?a=sendTG&client=${clientID}&tgid=${tgID}&key=${secret}&to=${nation}`)
          .set({ "User-Agent": USER_AGENT });

        // console.log(res.status);
        // console.log(res.headers);
        // console.log(res);
        if (res.status === 200) {
          nextTelegram = Date.now() + 180000;
          resolve(res);
        }
        if (res.status === 429 || typeof res.headers["X-Retry-After"] !== "undefined") {
          hasBeenRatelimited = true;
          setTimeout(() => {
            hasBeenRatelimited = false;
          }, 900e3);
          reject(new NSAPIError("RATELIMIT"));
        }
        if (res.status === 403) {
          reject(new NSAPIError("INVALID_OPTIONS"));
        }
        if (res.status === 404) {
          reject(new NSAPIError("NOT_FOUND"));
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = Request;