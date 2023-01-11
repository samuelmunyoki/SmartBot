const makeWASocket = require('@adiwajshing/baileys').default;
const  { fetchLatestBaileysVersion, useSingleFileAuthState, Browsers } =require('@adiwajshing/baileys');
const { state, saveState } = useSingleFileAuthState('./auth.json')
const {cleaner} = require('./core/cleaner')
const fs = require('fs')
const {db }= require('./database/dbconnect')
const {checker} = require("./core/keyword_checker");
const Group = require('./database/Models/Group');
const commandHandler = require('./functions/commandHandler')
// start a connection
const startSock = async() => {
	const { version } = await fetchLatestBaileysVersion()
 db();
	const sock = makeWASocket({
		version,
		printQRInTerminal: true,
		auth: state,
        browser: Browsers.macOS("Desktop"),
        syncFullHistory: false
	})
    sock.ev.on('messages.upsert', async ({ messages }) => {
        let m = messages[0];
		//console.log(JSON.stringify(m))
        let groupIdExist = await Group.findOne({groupId: m.key.remoteJid})
        
        cleaner({m: m, sock : sock}).then(async(res)=>{
            
            if(res.isGroup)
            {
                let body = res["body"]
            if(res.isCmd)
            {
                console.log("Command-> "+JSON.stringify(res.command))
                commandHandler.commandHandler({sock: sock, m: m, command: res.command})
            }
            if (checker({message: body})) {
                console.log("Relevant message")
                
                if (!groupIdExist)
            {
            const groupdata = new Group({
                groupId: m.key.remoteJid,
                subscribers:  res["groupMembers"]
            })
            try {
                await groupdata.save()
                console.log("Group saved")
            } catch (error) {
                console.log("error occured saving group")
            }
            
        }
        sendBroadCast({m: m, body: body})

            }
            else {
                console.log("Irrelevant Message")
            }
            }
            
        })
        
        
   })

const sendBroadCast = async ({ m: m, body: body}) =>{
    
    let groupInfo = await Group.findOne({
        groupId : m.key.remoteJid
       })
     for (let i = 0; i < groupInfo["subscribers"].length; i++) {
        var subscriber = groupInfo["subscribers"][i];
        
        var uid = subscriber["id"]
        //console.log("UID -> " +uid)
        var msg = `🔔 Announcement!! Important message for you📌.\n${body}`
        await sock.sendMessage(uid, {text: msg},{quoted: m})
     }

}
//  this is a conection update
 //Connection Update
 sock.ev.on('connection.update', (update) => {
    const { connection } = update
    if(connection === 'close') {
        startSock()
    }
    
    console.log('connection update', update)
})
// listen for when the auth credentials is updated
sock.ev.on('creds.update', saveState)

return sock
    // //Connection Update
	// sock.ev.on('connection.update', (update) => {
	// 	const { connection } = update
	// 	// if(connection === 'close') {
    //     //     fs.unlinkSync('auth.json', ()=>{
    //     //        console.log('Auth file deleted')
    //     //     })
    //     //     startSock()
			
	// 	// }
        
	// 	console.log('connection update', update)
	// })
	// // listen for when the auth credentials is updated
	// sock.ev.on('creds.update', saveState)

	// return sock
}
//Starting SmartBot
startSock()