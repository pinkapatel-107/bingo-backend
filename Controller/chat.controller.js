const ChatModel = require('../Model/chat.model');


module.exports = {
    getChats: async (req, res, next) => {
       try {
        const result = await ChatModel.findById()
        return res.status(200).json({
            statusCode: 200,
            message: "successfully feched data",
            error: result,
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
