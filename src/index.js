const { clientID, tgID, secretID } = require("../config.json");
const logger = require("./util/Logger");
const { getNation, sendTG } = require("./rest/request");

async function recruit() {
  try {
    logger.log("RECRUITER", "Searching for nation...");
    const nation = await getNation();
    if (!nation) {
      logger.info("RECRUITER", "No nation found to recruit, skipping...");
      return;
    }
    logger.log("RECRUITER", `Nation found: ${nation}`);

    logger.log("RECRUITER", `Attempting to send telegram to ${nation}...`);
    const { status, code } = await sendTG({ clientID, tgID, secret: secretID, nation });
    logger.info("RECRUITER", `Successfully sent telegram to: ${nation}, status: ${status}, response code ${code}. Waiting 180 seconds...`);
  } catch (err) {
    logger.info("RECRUITER", `Failed to send telegram: ${err}`);
  }
}
logger.info("RECRUITER", "Recruiter active! Waiting 180 seconds...");
setInterval(recruit, 181e3);
