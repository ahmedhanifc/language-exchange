const { MongoClient } = require('mongodb')
const mongodb = require('mongodb')

const database = "Language-Exchange";

 //These are the four collections we have in our database. We can access them via indexing as needed, reducing variable names
const collections = ["UserAccounts","UserSessions","UserContacts","UserBlocked"]

let userAccounts = undefined; //This variable will contain the data defined in the collection userAccountCollectionName
let userSessions = undefined; //This variable will contain the data defined in the collection userSessionCollectionName
let userContacts = undefined;
let userBlocked = undefined;


/**
 * Connects to the MongoDB database and initializes the collections if they are not already loaded.
 * @async
 */
async function connectDatabase() {
    if (!userAccounts) {
        client = new MongoClient('mongodb+srv://ahmed:12class34@cluster0.jj6rj.mongodb.net/')
        await client.connect()
        userAccounts = client.db(database).collection(collections[0]) // loads userAccounts collection data into the variable userAccounts
    }
    if(!userSessions) {
        client = new MongoClient('mongodb+srv://ahmed:12class34@cluster0.jj6rj.mongodb.net/')
        await client.connect()
        userSessions = client.db(database).collection(collections[1]) // loads userSessions collection data into the variable userAccounts
    }
    if(!userContacts) {
        client = new MongoClient('mongodb+srv://ahmed:12class34@cluster0.jj6rj.mongodb.net/')
        await client.connect()
        userContacts = client.db(database).collection(collections[2]) 
    }
    if(!userBlocked) {
        client = new MongoClient('mongodb+srv://ahmed:12class34@cluster0.jj6rj.mongodb.net/')
        await client.connect()
        userBlocked = client.db(database).collection(collections[3])
    }
}

/**
 * Finds a user by their username or email.
 * @async
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object|null>} The user document if found, otherwise null.
 */
async function findUser(username,email){
    await connectDatabase()
    return await userAccounts.findOne(({ 
        $or: [
          { username},
          { email},
        ]
      }))
      //will reutrn a document that matches either and this function can be reused
}

/**
 * Finds a user by their reset key.
 * @async
 * @param {string} resetKey - The reset key associated with the user.
 * @returns {Promise<Object|null>} The user document if found, otherwise null.
 */
async function findUserReset(resetKey){
    await connectDatabase()
    return await userAccounts.findOne({resetKey})
      //will reutrn a document that matches either and this function can be reused
}


/**
 * Creates a new user in the database.
 * @async
 * @param {string} username - The username of the new user.
 * @param {string} email - The email of the new user.
 * @param {string} password - The password of the new user.
 * @param {string|null} resetKey - The reset key for the user, initially null.
 * @returns {Promise<Object>} The result of the insertion operation.
 */
async function createUser(username,email,password,resetKey){
    await connectDatabase()
    return await userAccounts.insertOne({username, email, password,resetKey})
    //resetKey is always set to null after a password has been reset

}

async function updateUserBio(username,userBio){
    await connectDatabase();
    return await userAccounts.updateOne({username}, {$set: {userBio}})

}

/**
 * Updates the reset key for a user.
 * @async
 * @param {string} email - The email of the user.
 * @param {string|null} resetKey - The new reset key for the user.
 * @returns {Promise<Object>} The result of the update operation.
 */
async function updateUserReset(email,resetKey){
    await connectDatabase()
    return await userAccounts.updateOne({email},{ $set:{
        "resetKey": resetKey,
    }
})
    //resetKey is always set to null after a password has been reset
}


/**
 * Updates the password for a user using their reset key.
 * @async
 * @param {string} resetKey - The reset key associated with the user.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<Object>} The result of the update operation.
 */
async function updatePassword(resetKey,newPassword){
    await connectDatabase()
    return await userAccounts.updateOne({resetKey},{ $set:{
        "password": newPassword,
    }
})
    //resetKey is always set to null after a password has been reset
}


/**
 * Updates the verification status for a user.
 * @async
 * @param {string} email - The email of the user.
 * @param {boolean} verificationStatus - The verification status to set (true/false).
 * @returns {Promise<Object>} The result of the update operation.
 */
async function updateUserVerification(email,verificationStatus){
    await connectDatabase()
    return await userAccounts.updateOne({email},{ $set:{
        "isVerified": verificationStatus,
    }
})
    //resetKey is always set to null after a password has been reset
}

/**
 * Saves a new session in the database.
 * @async
 * @param {Object} sessionData - The data for the session to be saved.
 * @returns {Promise<Object>} The result of the insertion operation.
 */
async function saveSession(sessionData) {
    await connectDatabase()
    return await userSessions.insertOne(sessionData)
}

/**
 * Updates a session's data using its session key.
 * @async
 * @param {string} sessionKey - The session key to identify the session.
 * @param {Object} data - The data to update in the session.
 * @returns {Promise<Object>} The result of the update operation.
 */
async function updateSession(sessionKey, data){
    await connectDatabase()
    let sessionData = await userSessions.updateOne({sessionKey}, {
        $set:{
            "data.username": data.data.username,
            "data.languageLearn":data.data.languageLearn,
            "data.languageFluent":data.data.languageFluent,
            "data.csrfToken":data.data.csrfToken,
            "data.flashData":data.data.flashData
        }
    })

    return sessionData
}

/**
 * Updates the language a user is learning.
 * @async
 * @param {string} username - The username of the user.
 * @param {string} languageLearn - The new language the user is learning.
 * @returns {Promise<Object>} The result of the update operation.
 */
async function updateUserAccountLanguageLearn(username, languageLearn){
    await connectDatabase()
    return await userAccounts.updateOne({username:username}, {$set:{languageLearn:languageLearn}})
}

/**
 * Updates the language a user is fluent in.
 * @async
 * @param {string} username - The username of the user.
 * @param {string} languageFluent - The new language the user is fluent in.
 * @returns {Promise<Object>} The result of the update operation.
 */
async function updateUserAccountLanguageFluent(username, languageFluent){
    await connectDatabase()
    return await userAccounts.updateOne({username:username}, {$set:{languageFluent:languageFluent}})
}


/**
 * Retrieves session data using a session key.
 * @async
 * @param {string} sessionKey - The session key to identify the session.
 * @returns {Promise<Object|null>} The session data if found, otherwise null.
 */
async function getSessionData(sessionKey) {
    await connectDatabase()
    return await userSessions.findOne({sessionKey})
}


/**
 * Deletes a session from the database using a session key.
 * @async
 * @param {string} sessionKey - The session key to identify the session.
 * @returns {Promise<Object>} The result of the deletion operation.
 */
async function deleteSession(sessionKey){
    await connectDatabase()
    return await userSessions.deleteOne({sessionKey})
}


module.exports={
    createUser,
    findUser,
    findUserReset,
    updateUserReset,
    updatePassword,
    updateUserVerification,
    getSessionData,
    saveSession,
    updateSession,
    updateUserAccountLanguageLearn,
    updateUserAccountLanguageFluent,
    deleteSession,
    updateUserBio
   
}