/* eslint-disable no-console */
const { webFrame } = require("electron");
const { getNation, sendTG } = require("../rest/request");

let interval;

document.getElementById("console").style.height = `${768 - 269}px`;

let logger = {};
for (const method of Object.keys(console)) {
  logger[method] = function log(topic, ...args) {
    // eslint-disable-next-line no-console
    console[method](new Date().toLocaleString(), `[${topic}]`, ...args);
    const newline = document.createElement("p");
    const panel = document.getElementById("console");
    newline.innerHTML = `&gt; ${new Date().toLocaleString()} [${topic}] ${args.join(" ")}\n`;
    panel.appendChild(newline);
    panel.scrollTop = panel.scrollHeight;
  };
}

webFrame.setZoomLevelLimits(1, 1);

window.USER_AGENT = null;
window.CLIENT_ID = null;
window.SECRET_ID = null;
window.TELEGRAM_ID = null;

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
    const { status, text } = await sendTG({ clientID: window.CLIENT_ID, tgID: window.TELEGRAM_ID, secret: window.SECRET_ID, nation });
    logger.info("RECRUITER", `Successfully sent telegram to: ${nation}, status: ${status}, response code ${text.trim()}. Waiting 180 seconds...`);
  } catch (err) {
    logger.info("RECRUITER", `Failed to send telegram: ${err}`);
  }
}

const startbutton = document.getElementById("button");

startbutton.onclick = () => {
  if (!interval) {
    logger.info("RECRUITER", "Starting recruitment...");
    recruit();
    interval = setInterval(recruit, 185000);
    startbutton.textContent = "Stop recruitment";
  } else {
    logger.info("RECRUITER", "Stopping recruitment...");
    clearInterval(interval);
    interval = null;
    logger.info("RECRUITER", "Stopped recruitment.");
    startbutton.textContent = "Start recruitment";
  }
};

const clientfield = document.getElementById("clientbox");
const tgfield = document.getElementById("telegrambox");
const secretfield = document.getElementById("secretbox");

clientfield.onchange = () => {
  window.CLIENT_ID = clientfield.value;
  document.getElementById("clientkey").innerHTML = window.CLIENT_ID !== null ? window.CLIENT_ID : "none set";
};

tgfield.onchange = () => {
  window.TELEGRAM_ID = tgfield.value;
  document.getElementById("telegramid").innerHTML = window.TELEGRAM_ID !== null ? window.TELEGRAM_ID : "none set";
};

secretfield.onchange = () => {
  window.SECRET_ID = secretfield.value;
  document.getElementById("secretid").innerHTML = window.SECRET_ID !== null ? window.SECRET_ID : "none set";
};