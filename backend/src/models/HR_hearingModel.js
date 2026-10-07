const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    linkedin: {
        type: String,
        trim: true
    },
    resume: {
        type: String,
        trim: true
    },
    experience: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewing', 'Shortlisted', 'Interviewed', 'Rejected', 'Hired'],
        default: 'Pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

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
    applications: [applicationSchema],
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

hearingSchema.index({ status: 1, created_at: -1 });

const hearing = mongoose.model("hearing", hearingSchema);
module.exports = hearing;