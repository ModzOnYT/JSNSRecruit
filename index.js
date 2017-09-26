const moment = require("moment");
const config = require("./config.json");
const nsapi = require("nsapi");
const api = new nsapi.NsApi("github.com/ModzOnYT", true, 600, 60000, 180000, false);
const tgspeed = 180000;

var key = config.clientkey;
var tgid = config.telegramid;
var secretid = config.secretid;
var test = config["testing"].isTesting;
var type = config["testing"].type; // eslint-disable-line no-unused-vars

const boot = () => {
  const now = new Date();
  const date = moment(now).format("MMM/DD/YYYY");
  const time = moment(now).format("H:mm:ss");
  console.log(`${date}, ${time}: The Telegram ID is ${tgid} \nThe Secret ID is ${secretid}.`);
  console.log(`${date}, ${time}: The timeout for the telegrams is ${tgspeed}.`);
};

const sendTest = () => {
  api.worldRequest(["happenings"], {filter: "founding", limit: "5"})
    .then(data => {
      console.log("[TESTING] Testing... No actual telegrams will be sent");
      console.log(JSON.stringify(data, null, 2));
      var event = data["happenings"]["event"][0];
      var eventtext = event["text"];
      /*if (eventtext.match(/refounded/g)) { //use this in the future
        "ye"; 
      } else {
        "nah"; 
      }*/ 
      console.log(`[TESTING] ${eventtext}`);
      var nat = eventtext.split(" ")[0];
      console.log(`[TESTING] ${nat}`);
      var nation = nat.replace(/@/g, "");
      console.log("[TESTING] Sending recruitment telegram to: " + nation);
    });
};

const sendtg = () => {
  api.worldRequest(["happenings"], {filter: "founding", limit: "5"})
    .then(data => {
      //console.log(JSON.stringify(data, null, 2));
      var event = data["happenings"]["event"][0];
      let founded = event["text"];
      //console.log(`${founded}`);
      let nat = founded.split(" ")[0];
      //console.log(`${nat}`);
      let nation = nat.replace(/@/g, "");
      console.log("Sending recruitment telegram to: " + nation);
      const tgdate = moment(nsapi.lastTgTime).format("DD/MMM/YYYY");
      const tgtime = moment(nsapi.lastTgTime).format("H:mm:ss");
      api.telegramRequest(key, tgid, secretid, nation, nsapi.TelegramType.Recruitment)
        .then(() => {
          console.log(`${tgdate}, ${tgtime}: Success | Telegram sent to ${nation} \nThe next telegram will be sent in ${api.recruitTgDelayMillis} ms.`);
        })
        .catch(err => {
          console.log(`${tgdate}, ${tgtime}: Telegram was not sent: \n\n` + err);
        });
    });
}

boot();
if(tgspeed < 180000) {
  console.log("The minimum speed for recruitment is 180.000 (180 seconds), otherwise you'll risk consequences from the Nationstates mods!");
  process.exit(1);
}
if (test === true) {
  sendTest();
} else {
  setInterval(sendtg, tgspeed);
}
