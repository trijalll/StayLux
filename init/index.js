const mongoose = require("mongoose");
const initData = require("../init/demo.js");
const listing= require('../models/listing.js');

main().then(() => {
    console.log("Connected successfully to MongoDB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wondermark');
}

const initDB = async ()=>{
   await listing.deleteMany({});
   await listing.insertMany(initData.data);
   console.log("chala gaya data")
}
 
initDB();


