const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
        default: 'Admin User',
    },
    role: {
        type: String,
        enum: ['superadmin', 'subadmin'],
        default: 'subadmin',
    },
    permissions: {
        type: [String],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Number,
    },
    auth_key: {
        type: String,
        default: null,
    },

    referrel_amount: {
        type: Number,
        default: 0,
    },

    notificationToken: {
        type: String,
        default: null,
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now,
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

const admin = mongoose.model("admin", adminSchema);
module.exports = admin;