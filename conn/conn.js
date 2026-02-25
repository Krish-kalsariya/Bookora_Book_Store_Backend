const mongoose = require("mongoose");

let isConnected = false;
// const conn = async () => {
//     try {
//         await mongoose.connect(`${process.env.URL}`);
//         console.log("Connected to Database");
//     }
//     catch (error) {
//         console.log(error);
//     }

// };
async function connectToMongoDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.URL);
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
}

module.exports = connectToMongoDB;