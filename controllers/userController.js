const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env

// tokens creating function
const createTokens = async (name, _id) => {
    let token
    switch(name) {
        case 'accessToken': token = await jwt.sign(
            { _id }, ACCESS_TOKEN_SECRET, { expiresIn: '1d' }
        )
        break;

        case 'refreshToken': token = await jwt.sign(
            { _id }, REFRESH_TOKEN_SECRET, { expiresIn: '10d' }
        )
        break;
    }
    return token
}

// register user controller function
const registerController = async (req, res) => {
    const {name, email, password} = req.body
    
    try {
        // inserting user info using register custom method on the User model
        const user = await User.register(name, email, String(password))        
        const accessToken = await createTokens('accessToken', user._id) // create tokens
        return res.status(200).json({ name, accessToken });
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// login user controller function
const loginController = async (req, res) => {
    const {email, password} = req.body    
    try {
        const user = await User.login(email, String(password))
        const accessToken = await createTokens('accessToken', user._id)
        return res.status(200).json({ name: user.name, accessToken })        
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// logged user controller function
const loggedUserController = async(req, res) => {
    const _id = req.user._id

    try {
        const user = await User.findById({ _id })
        return res.status(200).json({ name: user.name })
    } catch (error) {
        return res.status(404).json({ error: error.message })        
    }

}

module.exports = { registerController, loginController, loggedUserController }