const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://pinka:6O8JXYIIFctmQQHv@cluster0.u2jquc5.mongodb.net/bingo', {
//   useNewUrlParser: true,       
//   useUnifiedTopology: true,    
})
  .then(() => {
    console.log("Successfully connected to database ");
  })
  .catch((error) => {
    console.error("Error connecting to database :", error.message);
  });

module.exports = mongoose;
