const mongoose = require('mongoose');
const bycrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role : {
        type: String,
    }
});

UserSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bycrypt.hash(user.password,8);
    }
    next();
});

UserSchema.methods.comparePassword = async function(password){
    const user = this;
    return await bycrypt.compare(password,user.password);
}

const UserModel = mongoose.model('User', UserSchema);

module.exports = {UserModel};