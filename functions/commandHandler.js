const tt = require('../json/timetable')
exports.commandHandler = async ({sock: sock, m: m, command: command})=>{
    let cmd = command.toLowerCase()
   
    switch (cmd){
        case "monday":
            var formattedString1 = ""
            for (let i = 0; i < tt[0].length; i++) {
                const day = tt[0][i];
                formattedString1 +="Lesson "+i+"\n"+"Unit: "+day.unit+"\nLec: "+day.lec+"\nRoom: "+day.room+"\nTime: "+day.time+"\n\n"
                
            }
            await sock.sendMessage(m.key.remoteJid,{text: formattedString1 }, {quoted: m})
            break;
            case "tuesday":
                var formattedString2 = ""
                for (let i = 0; i < tt[0].length; i++) {
                    const day = tt[1][i];
                    formattedString2 +="Lesson "+i+"\n"+"Unit: "+day.unit+"\nLec: "+day.lec+"\nRoom: "+day.room+"\nTime: "+day.time+"\n\n"
                    
                }
                await sock.sendMessage(m.key.remoteJid,{text: formattedString2 }, {quoted: m})
                break;
                case "wednesday":
                    var formattedString3 = ""
                    for (let i = 0; i < tt[0].length; i++) {
                        const day = tt[2][i];
                        formattedString3 +="Lesson "+i+"\n"+"Unit: "+day.unit+"\nLec: "+day.lec+"\nRoom: "+day.room+"\nTime: "+day.time+"\n\n"
                        
                    }
                    await sock.sendMessage(m.key.remoteJid,{text: formattedString3 }, {quoted: m})
                    break;
                    case "thursday":
                        var formattedString4 = ""
                        for (let i = 0; i < tt[0].length; i++) {
                            const day = tt[3][i];
                            formattedString4 +="Lesson "+i+"\n"+"Unit: "+day.unit+"\nLec: "+day.lec+"\nRoom: "+day.room+"\nTime: "+day.time+"\n\n"
                            
                        }
                        await sock.sendMessage(m.key.remoteJid,{text: formattedString4 }, {quoted: m})
                        break;
                    case "friday":
                        var formattedString5 = ""
                        for (let i = 0; i < tt[0].length; i++) {
                            const day = tt[4][i];
                            formattedString5 +="Lesson "+i+"\n"+"Unit: "+day.unit+"\nLec: "+day.lec+"\nRoom: "+day.room+"\nTime: "+day.time+"\n\n"
                            
                        }
                        await sock.sendMessage(m.key.remoteJid,{text: formattedString5 }, {quoted: m})
                        break;
        default: break;

                
    }

}
