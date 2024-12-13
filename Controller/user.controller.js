const userModel = require("../Model/user.Model");

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      if (!name || !email || !phone || !password) {
        return res.status(400).json({
          statusCode: 400,
          message: "All fields are required: name, email, phone, password",
        });
      }
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          statusCode: 409,
          message: "User with this email already exists",
        });
      }
      const result = await userModel.create(req.body);
      return res.status(201).json({
        statusCode: 201,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error during user registration:", error);
      return res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  getUser: async (req, res) => {
    try {
      const result = await userModel.find();
      return res.status(200).json({
        statusCode: 200,
        message: "successfully fetched data",
        data: result,
      });
    } catch (error) {
      console.error("Error during user registration:", error);
      return res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      if (req.body.email) {
        const result = await userModel.findOne({ email: req.body.email });
        if (result) {
          return res.status(200).json({
            statusCode: 200,
            message: "successfully login user",
            data: result,
          });
        }else{
          return res.status(200).json({
            statusCode: 400,
            message: "user not found",
            data: result,
        });
        }
      } else {
        return res.status(400).json({
          statusCode: 400,
          message: "Email id is required",
          data: [],
        });
      }
    } catch (error) {
      console.error("Error during user registration:", error);
      return res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
};
