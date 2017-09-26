const fs = require("fs");
      moment = require("moment");
      config = require("./config.json");
      key = config.clientkey;
      tgid = config.telegramid;
      secretid = config.secretid;
      tgtimeout = config.recruitment;
      nsapi = require("nsapi");
      api = new nsapi.NsApi("github.com/ModzOnYT", true, 600, 60000, 180000, false);
      tgspeed = 180000;

      function boot() {
        const now = new Date();
        const date = moment(now).format("MMM/DD/YYYY");
        const time = moment(now).format("H:mm:ss");
        console.log(`${date}, ${time}: The Telegram ID is ${tgid} \nThe Secret ID is ${secretid}.`);
        console.log(`${date}, ${time}: The timeout for the telegrams is ${tgspeed}.`);
      };

      function sendTest() {
        const now = new Date();
        const date = moment(now).format("MMM/DD/YYYY");
        const time = moment(now).format("H:mm:ss");
        api.worldRequest(["happenings"], {filter: "founding", limit: "5"})
          .then(function(data) {
            console.log("[TESTING] Testing... No actual telegrams will be sent");
            console.log(JSON.stringify(data, null, 2));
            var event = data["happenings"]["event"][0];
            let founded = event["text"];
            console.log(`[TESTING] ${founded}`);
            let nat = founded.substr(0, founded.indexOf(" "));
            console.log(`[TESTING] ${nat}`);
            let ion = nat.replace("@@", "");
            console.log(`[TESTING] ${ion}`);
            let nation = ion.replace("@@", "");
            console.log("[TESTING] Sending recruitment telegram to: " + nation);
          });
      };

      function sendtg() {
          var clientKey = ""; //not used yet
          var telegramId = ""; //not used yet
          var telegramSecretKey = ""; //not used yet
          api.worldRequest(["happenings"], {filter: "founding", limit: "5"})
              .then(function(data) {
                //console.log(JSON.stringify(data, null, 2));
                var event = data["happenings"]["event"][0];
                let founded = event["text"];
                //console.log(`${founded}`);
                let nat = founded.substr(0, founded.indexOf(" "));
                //console.log(`${nat}`);
                let ion = nat.replace("@@", "");
                //console.log(ion);
                let nation = ion.replace("@@", "");
                console.log("Sending recruitment telegram to: " + nation);
                const tgdate = moment(nsapi.lastTgTime).format("DD/MMM/YYYY");
                const tgtime = moment(nsapi.lastTgTime).format("H:mm:ss");
                api.telegramRequest(key, tgid, secretid, nation, nsapi.TelegramType.Recruitment)
                  .then(function(err) {
                    console.log(`${tgdate}, ${tgtime}: Success | Telegram sent to ${nation} \nThe next telegram will be sent in ${api.recruitTgDelayMillis} ms.`);
                  })
                  .catch(function(err) {
                    console.log(`${tgdate}, ${tgtime}: Telegram was not sent: \n\n` + err);
                });
          });
      };

      boot();
      if(tgspeed < 180000) {
        console.log("The minimum speed for recruitment is 180.000 (180 seconds), otherwise you'll risk consequences from the Nationstates mods!");
        process.exit(1);
      };
      setInterval(sendtg, tgspeed);
