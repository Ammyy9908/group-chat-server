const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connected = await mongoose.connect(
      "mongodb+srv://Sumit:2146255sb8@cluster0.nqwso.mongodb.net/reactroom",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    return connected;
  } catch (e) {
    console.log(e);
    return false;
  }
};

module.exports = connectDb;
