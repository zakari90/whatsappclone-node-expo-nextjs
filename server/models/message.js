import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
    content:{
        type: String,
        required: true,
    },
    seen:{
        type: Boolean,
        default: false
    },
    senderId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 

},{timestamps: true});

const Message = model('Message', messageSchema);

export default Message;


