const { SmartBotObject} = require('./SmartBotObject')
const pref = require('../config/prefix')
exports.cleaner = async({m, sock}) => {
    try {
        SmartBotObject.isGroup = m.key.remoteJid.split("@")[1] == "g.us" ? true : false;
        SmartBotObject.mimetype = Object.keys(m.message) == "imageMessage" ? 'image' : Object.keys(m.message) == "videoMessage" ? "video" : Object.keys(m.message) == "conversation" ? "convo" :  Object.keys(m.message) == "extendedTextMessage" ? "ex-text" : "other";
        SmartBotObject.body = SmartBotObject.mimetype == "ex-text" ?  m.message.extendedTextMessage.text: SmartBotObject.mimetype == "convo" ? m.message.conversation : "" ;
        SmartBotObject.sender =  m.key.remoteJid;
        SmartBotObject.botId = "254106760469@s.whatsapp.net";
        SmartBotObject.imgCaption = SmartBotObject.mimetype == "image" ? SmartBotObject.body = m.message.imageMessage.caption  : "";
        SmartBotObject.videoCaption = SmartBotObject.mimetype == "video" ? SmartBotObject.body = m.message.videoMessage.caption  : "";
        SmartBotObject.isCmd = pref.includes(SmartBotObject.body.charAt(0), 0)? true: false;
        SmartBotObject.command = pref.includes(SmartBotObject.body.charAt(0), 0) ? SmartBotObject.body.split(" ")[0].substring(1) : "";
        //SmartBotObject.quotedsender = SmartBotObject.mimetype == "ex-text" ? m.message.extendedTextMessage.contextInfo.participant : "";
        SmartBotObject.groupMetadata = SmartBotObject.isGroup == true ? await sock.groupMetadata(m.key.remoteJid) : '';
        var rawArgs = SmartBotObject.body.split(" ")
        var rawArgsArr = []
    
        for(var i=1; i<=rawArgs.length; i++)
        {
            var argChunk = rawArgs[i]
            rawArgsArr.push(argChunk)
        }
        SmartBotObject.args = rawArgsArr.join(" ").replace(","," ")
        SmartBotObject.groupMembers =SmartBotObject.isGroup ? SmartBotObject.groupMetadata.participants : '';
        SmartBotObject.groupAdmins = SmartBotObject.isGroup ? getGroupAdmins(SmartBotObject.groupMembers) : '';
        //console.log(SmartBotObject.groupMetadata)
        return SmartBotObject;

    } catch (error) {
        console.log("Something went wrong in cleaner file.\n"+error)
    }

    
}
function getGroupAdmins(participants){
    var admins = [];
    for (var i in participants) {
        console.log( "This is a participant "+JSON.stringify(participants[i]))
        participants[i].admin != null? admins.push(participants[i].id) : '';
    }
    return admins;
}