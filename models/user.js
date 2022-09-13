const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255

    },

    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    
   //for password complexcity npm called joi-password-complexicty is there//

    password:{
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },

    isAdmin: Boolean
});

userSchema.methods.generateAuthtoken = function(){
    const token = jwt.sign({ _id: this._id,isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}
const User = mongoose.model('User', userSchema); 

function validateUser(user){
    const schema = Joi.object({
        name:Joi.string().min(3).max(255).required(),
        email:Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(user);
    
} 

exports.User = User;
exports.validate = validateUser ;