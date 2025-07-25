import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const MessageSchema = new Schema({
  id: { type: String, default: uuidv4 },
  text: { type: String, required: true },
  isUser: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default MessageSchema; 