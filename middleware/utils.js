const jwt = require('jsonwebtoken');
const config = require('./../config/config.js')
const bcrypt = require('bcryptjs');

const encryptpassword = password => new Promise((resolve,reject)=>{
    bcrypt.genSalt(10, (err,salt)=>{
        if(err){
            reject(err)
        }
        bcrypt.hash(password,salt, (err,hash)=>{
            if(err){
                reject(err)
            }
            resolve(hash)
        })
    })
})

const comparePassword =  async (password,hash) => {
    try {
        return await bcrypt.compare(password,hash)
    }catch (error) {
        throw error
    }
}

const getToken = payload => {
    return jwt.sign(payload,"thescretkeystokckindotenv",{
        expiresIn: '3h'
    })
}

const getPayload = token => {

    try {
        const payload = jwt.verify(token, "thescretkeystokckindotenv");
        return { loggedIn: true, payload };
    } catch (err) {
        // Add Err Message
        return { loggedIn: false }
    }
}
module.exports = {
    getToken,
    getPayload,
    encryptpassword,
    comparePassword
}
