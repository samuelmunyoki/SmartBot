const makeWASocketCont = require("@whiskeysockets/baileys");
const makeWASocket = makeWASocketCont.default;
const { useMultiFileAuthState, DisconnectReason } = makeWASocketCont;

const { cleaner } = require("./core/cleaner");
const fs = require("fs");
const { db } = require("./database/dbconnect");
const { checker } = require("./core/keyword_checker");
const Group = require("./database/Models/Group");
const commandHandler = require("./functions/commandHandler");

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  db();
  const sock = makeWASocket({
    // can provide additional config here
    auth: state,
    // version: "SmartBot v1.0.0",
    printQRInTerminal: true,
  });
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });
  sock.ev.on("messages.upsert", async ({ messages }) => {
    let m = messages[0];
    //console.log(JSON.stringify(m))
    let groupIdExist = await Group.findOne({ groupId: m.key.remoteJid });

    cleaner({ m: m, sock: sock }).then(async (res) => {
      if (res.isGroup) {
        let body = res["body"];
        if (res.isCmd) {
          console.log("Command-> " + JSON.stringify(res.command));
          commandHandler.commandHandler({
            sock: sock,
            m: m,
            command: res.command,
          });
        }
        if (checker({ message: body })) {
          console.log("Relevant message");

          if (!groupIdExist) {
            const groupdata = new Group({
              groupId: m.key.remoteJid,
              subscribers: res["groupMembers"],
            });
            try {
              await groupdata.save();
              console.log("Group saved");
            } catch (error) {
              console.log("error occured saving group");
            }
          }
          sendBroadCast({ m: m, body: body });
        } else {
          console.log("Irrelevant Message");
        }
      }
    });
  });
}

const sendBroadCast = async ({ m: m, body: body }) => {
  let groupInfo = await Group.findOne({
    groupId: m.key.remoteJid,
  });
  for (let i = 0; i < groupInfo["subscribers"].length; i++) {
    var subscriber = groupInfo["subscribers"][i];

    var uid = subscriber["id"];
    //console.log("UID -> " +uid)
    var msg = `🔔 Announcement!! Important message for you📌.\n${body}`;
    await sock.sendMessage(uid, { text: msg }, { quoted: m });
  }
};

// run in main file
connectToWhatsApp();
