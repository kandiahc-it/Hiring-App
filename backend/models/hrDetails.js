const mongoose = require("mongoose");

const hrDetailsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    allowedEmail: { type: [String], default: [] },
    email: { type: String, required: true },
    password: { type: String, required: true },
    });

module.exports = mongoose.model("hrDetails", hrDetailsSchema);