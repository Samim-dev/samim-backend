const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// token middleware
const requiredToken = async (req, res, next) => {
    const auth = req.headers['authorization']
    const token = auth && auth.split(' ')[1]

    // checking tokens existens
        if(!token) return res.status(401).json('Authorization token is needed')

    try {
        const { _id } = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = await User.findById({ _id }).select('_id')
        next()
    } catch (error) {
        return res.status(401).json({error: error.message })
    }
}

module.exports = requiredToken