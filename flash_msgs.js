const business = require("./business")

async function setFlash(sessionKey,message){
    let sessionData=await business.getSessionData(sessionKey)
    sessionData.data.flashData=message
    //this adds a message to the attribute flashData within the data object and we will be passing in flash.code & flash.content as attributes of object called message 
    return await business.updateSessionData(sessionKey,sessionData) //You were passing sessionData.data before. I had to change it to sessionData because of the change
    //i made in persistence to the updateSession. I hope thats okay
}

async function getFlash(sessionKey) {
    let sessionData=await business.getSessionData(sessionKey)
    if(!sessionData){
        return null
    }
    let message=sessionData.data.flashData
    //stores the error code on the basis of which we will display the message
     sessionData.data.flashData=''
    //necessary so that a flash msg doesnt sppear everytime we refresh
    await business.updateSessionData(sessionKey,sessionData)
    //deleted the flashdata from the stored session
    return message
    //so that we can use it to check what to display

    
}

async function setFlashResetPassword(message){
    let flashData=message
    return flashData
    

}

async function getFlashResetPassword(flashData) {
    
    let message=flashData.message
    //stores the error code on the basis of which we will display the message
    delete flashData
    return message
    //so that we can use it to check what to display

    
}
module.exports={
    setFlash,getFlash,setFlashResetPassword,getFlashResetPassword
}