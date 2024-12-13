const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
