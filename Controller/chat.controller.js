const ChatModel = require('../Model/chat.model');


module.exports = {
    getChats: async (req, res, next) => {
       try {
        const result = await ChatModel.find({
          $or: [
            { sender_id: req.query.user_id },
            { receiver_id: req.query.user_id }
          ]
        });
        return res.status(200).json({
            statusCode: 200,
            message: "successfully feched data",
            data: result,
          });
       } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            error: error.message,
          });
       }
    },
}
