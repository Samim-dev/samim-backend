const express = require('express')
const route = express.Router()
const requiredToken = require('../middleware/requiredToken')

// controllers
const {
    registerController, 
    loginController, 
    loggedUserController
} = require('../controllers/userController')

// register route
route.post('/register', registerController)

// login route
route.post('/login', loginController)

// token middleware 
route.use(requiredToken)

// logged user { protected route using token middleware }
route.get('/online', loggedUserController)

module.exports = route