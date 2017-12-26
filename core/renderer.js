/* eslint-disable no-console */
const { webFrame } = require("electron");
const { getNation, sendTG } = require("../rest/request");

const start = document.getElementById("startbutton");
const stop = document.getElementById("stopbutton");

let interval;

let logger = {};
for (const method of Object.keys(console)) {
  logger[method] = function log(topic, ...args) {
    // eslint-disable-next-line no-console
    console[method](new Date().toLocaleString(), `[${topic}]`, ...args);
    const newline = document.createElement("div");
    const panel = document.getElementsByClassName("console")[0];
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

function set(key, ...args) {
  window[key] = encodeURIComponent(args.join(" "));
}

function startRecruit() {
  if (window.CLIENT_ID === null || window.SECRET_ID === null || window.TELEGRAM_ID === null) {
    return logger.warn("RECRUITER", "Cannot recruit with missing params! Aborting...");
  }
  return recruit().then(() => {
    interval = setInterval(recruit, 181e3);
  });
}

function stopRecruit() {
  logger.info("RECRUITER", "Stopping recruitment...");
  clearInterval(interval);
  logger.info("RECRUITER", "Stopped recruitment!");
}

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
    const { status, code } = await sendTG({ clientID: window.CLIENT_ID, tgID: window.TELEGRAM_ID, secret: window.SECRET_ID, nation });
    logger.info("RECRUITER", `Successfully sent telegram to: ${nation}, status: ${status}, response code ${code}. Waiting 180 seconds...`);
  } catch (err) {
    logger.info("RECRUITER", `Failed to send telegram: ${err}`);
  }
}

start.onmousedown = () => {
  startRecruit();
};

stop.onmousedown = () => {
  stopRecruit();
};

const clientbutton = document.getElementById("bclient");
const tgbutton = document.getElementById("btg");
const secretbutton = document.getElementById("bsecret");

clientbutton.onmousedown = () => {
  const field = document.getElementById("clientid");
  if (!field.value) return alert("Missing client ID value!");
  set("CLIENT_ID", field.value);
  const client = document.getElementById("tableclient");
  client.innerHTML = field.value;
  field.value = null;
  return alert("Successfully set the client ID");
};

tgbutton.onmousedown = () => {
  const field = document.getElementById("tgid");
  if (!field.value) return alert("Missing telegram ID value!");
  set("TELEGRAM_ID", field.value);
  const client = document.getElementById("tabletelegram");
  client.innerHTML = field.value;
  field.value = null;
  return alert("Successfully set the telegram ID");
};

secretbutton.onmousedown = () => {
  const field = document.getElementById("secretid");
  if (!field.value) return alert("Missing secret ID value!");
  set("SECRET_ID", field.value);
  const client = document.getElementById("tablesecret");
  client.innerHTML = field.value;
  field.value = null;
  return alert("Successfully set the secret ID");
};