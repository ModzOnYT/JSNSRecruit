const Messages = {
  INVALID_OPTIONS: "An invalid Client ID, Telegram ID or Secret ID was provided",
  RATELIMIT: "The client has been ratelimited",
  TOO_MANY_REQUESTS: "There have been too much requests made",
  NOT_FOUND: "API returned 404"
};
/**
 * Creates an error for the Nationstates API
 * @extends Error
 */
class NSAPIError extends Error {
  /**
   * Creates an error for the Nationstates API
   * @param {string} key - Error key.
   * @param {...any} args - Arguments.
   */
  constructor(key, ...args) {
    if (Messages[key] === null) throw new TypeError(`Error key '${key}' does not exist`);
    const message = typeof Messages[key] === "function"
      ? Messages[key](...args)
      : Messages[key];

    super(message);
    this.code = key;
  }

  get name() {
    return `nsAPIError [${this.code}]`;
  }
}

module.exports = NSAPIError;