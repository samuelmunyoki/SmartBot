const keywords = require('../config/keywords')
const threshold =1;
exports.checker = ({message})=>{
    let counter = 0;
    let body_arr = message.split(" ")
    if(counter==threshold)
    {
        return true
    }
    for (let i = 0; i < keywords.length; i++) {
        let keyword = keywords[i];
        
            for (let j = 0; j < body_arr.length; j++) {
                if(counter==threshold)
                {
                    return true
                }
                let body_arr_element = body_arr[j];
                if (keyword.toLowerCase() === body_arr_element.toLowerCase()) {
                    counter+=1;
                
            }
            }
        
    }
    return false

}