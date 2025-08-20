import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        maxlength: 100,
        trim: true,
        default: 'Hey there! I am using WhatsApp'
    }
},{timestamps: true});

const User = model('User', userSchema);

export default User;
