const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    Title: {
        type: String,
        require: true
    },
    Description: String,
    Image: {
        type: String,
        default: "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    Price: Number,
    Location: String,
    Country: String
});

const Hotel_list = mongoose.model("Hotel_list", HotelSchema);
module.exports = Hotel_list;