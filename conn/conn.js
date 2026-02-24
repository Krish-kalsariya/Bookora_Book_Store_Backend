const mongoose = require('mongoose');

// const conn = async () => {
//     try {
//         await mongoose.connect(`${process.env.URL}`);
//         console.log("Connected to Database");
//     }
//     catch (error) {
//         console.log(error);
//     }

// };

let isConnected = false;
async function connectToMongoDB() {
try {
await mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true
});
isConnected = true;
console.log('Connected to MongoDB');
} catch (error) {
console.error('Error connecting to MongoDB:', error);
}
}

conn();

