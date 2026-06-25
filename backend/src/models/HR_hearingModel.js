const mongoose = require("mongoose");

const hearingSchema = new mongoose.Schema({

    post: {
        type: String,
    },
    overview: {
        type: String,
    },
    description: {
        type: String,
    },
    keyResponsibilities: {
        type: [String],
    },
    qulification: {
        type: [String],
    },
    whatWeOffer: {
        type: [String],
    },
    lastDate: {
        type: Date
    },
    salary: {
        type: String,
    },
    vacancy: {
        type: String,
    },
    experience: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["male", "female", "both"],
        default: "both",
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

const hearing = mongoose.model("hearing", hearingSchema);
module.exports = hearing;