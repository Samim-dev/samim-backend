const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

// user Schema
    const userSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }, { timestamps: true })

// register static method
    userSchema.statics.register = async function(name, email, password) {
        // validations
            if(!name || !email || !password) throw Error('All field must filled')
            if(!validator.isEmail(email)) throw Error('Incorrect email');

        // checking user existence
            const exist = await this.findOne({ email })
            if(exist) throw Error('User already registered');

        // bcrypt
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt)

        // inserting user into db
            const user = await this.create({ name, email, password: hash })

        return user;
    }

// login static method
    userSchema.statics.login = async function(email, password) {
        // validations
            if(!email || !password) throw Error('All field must filled')
            if(!validator.isEmail(email)) throw Error('Incorrect email');
        
        // registered user check
            const user = await this.findOne({ email })
            if(!user) throw Error('Please register first')

        // bcrypt
            const valid = await bcrypt.compare(password, user.password)
            if(!valid) throw Error('Incorrect password')
            
        return user;
    }

// user model
    module.exports = mongoose.model('User', userSchema)