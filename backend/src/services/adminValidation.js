const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const admin_model = require("../models/adminModel");

const axios = require("axios"); // already in most projects

const sendOTP = async (email, otp) => {
    const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: { email: "rizeworldcode@gmail.com", name: "RizeWorld" },
            to: [{ email: email }],
            subject: "Password Reset Verification Code",
            textContent: `Dear User,
Your verification code is: ${otp}
This code is valid for 10 minutes.
If you did not request a password reset, please ignore this email.
Thank you, RizeWorld Team`,
        },
        {
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};


exports.admin_login = async (req, res) => {
    try {
        const { frontend_password, frontend_email } = req.body;

        if (!frontend_email || !frontend_password) {
            return {
                success: false,
                message: "Email and password are required",
            };
        }

        const normalizedEmail = frontend_email.toLowerCase().trim();

        // First check if admin exists in DB
        let existingAdmin = await admin_model.findOne({ email: normalizedEmail });

        if (!existingAdmin) {
            return {
                success: false,
                message: "Invalid email or password",
            };
        }

        if (existingAdmin.isActive === false) {
            return {
                success: false,
                message: "This account has been deactivated. Please contact the administrator.",
            };
        }

        // Check password against DB
        const isPasswordValid = await bcrypt.compare(frontend_password, existingAdmin.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid email or password",
            };
        }

        const token = jwt.sign({ id: existingAdmin._id, role: "admin" }, process.env.SECRET_KEY || "default_secret", { expiresIn: "30d" });
        if (!token) {
            return { success: false, message: "Token generation failed" };
        }
        // Set the token to cookies
        res.cookie("token", token);
        const authKeyInsertion = await admin_model.findOneAndUpdate(
            { _id: existingAdmin._id },
            { auth_key: token },
            { new: true }
        );

        if (!authKeyInsertion) {
            return { success: false, message: "Token updation failed" };
        }

        const isSuperAdmin = existingAdmin.role === 'superadmin' || (!existingAdmin.role && (!existingAdmin.permissions || existingAdmin.permissions.length === 0));

        return {
            message: "User logged in successfully",
            success: true,
            token: token,
            userId: existingAdmin._id,
            user: {
                id: existingAdmin._id,
                _id: existingAdmin._id,
                email: existingAdmin.email,
                name: existingAdmin.name || 'Admin User',
                role: isSuperAdmin ? 'superadmin' : 'subadmin',
                permissions: isSuperAdmin ? ['all'] : (existingAdmin.permissions || [])
            }
        };
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "Internal server error",
            success: false,
        };
    }
};

exports.sendOtpTOadmin = async (req, res) => {
    const { email } = req.body;

    try {
        const AdminData = await admin_model.findOne({ email: email });

        if (!AdminData) {
            return {
                message: "Admin not found with this email",
                success: false,
            };
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiry = Date.now() + 3600000; // 1 hour

        // Update admin with OTP
        const update_admin = await admin_model.findOneAndUpdate({ email: email },
            {
                $set: {
                    otp: otp,
                    otpExpiry: otpExpiry
                }
            },
            { new: true }
        );

        if (!update_admin) {
            return {
                message: "admin not found",
                success: false,
            };
        }

        const otp_send = await sendOTP(email, otp);
        if (!otp_send) {
            return {
                message: "otp send faild",
                success: false,
            };
        }

        return {
            message: "OTP send successfully",
            success: true,
        };
    } catch (error) {
        console.log(error);
        return {
            message: error,
            success: false,
        };
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    console.log(typeof otp);
    try {
        const user = await admin_model.findOne({ email });
        if (!user) {
            return {
                message: "Invalid email",
                success: false,
            };
        }
        console.log(typeof user.otp);
        if (user.otp !== otp || otp == undefined || user.otpExpiry < Date.now()) {
            return {
                message: "Invalid or expired OTP",
                success: false,
            };
        }

        const token = jwt.sign({ id: user._id, role: "admin" }, process.env.SECRET_KEY);
        if (!token) {
            return {
                message: "Token generation failed",
                success: false,
            };
        }
        res.cookie("token", token);
        const update_admin = await admin_model.findOneAndUpdate({ email: email },
            {
                $set: {
                    auth_key: token,
                }
            },
            { new: true }
        );

        if (!update_admin) {
            return {
                message: "password updation failed",
                success: false,
            };
        }
        return {
            token,
            message: "OTP verified successfully",
            success: true,
        };
    } catch (error) {
        console.log(error);
        return {
            message: error.message || "An error occurred",
            success: false,
        };
    }
};

exports.admin_forgatePassword = async (req, res) => {
    const { newPassword, email } = req.body;
    console.log(newPassword, email);

    try {
        if (!newPassword || !email) {
            return {
                message: "email or password not define",
                success: false
            }
        }
        const existingAdmin = await admin_model.findOne({ email }).select('+auth_key');
        if (!existingAdmin) {
            return {
                success: false,
                message: "Admin not found",
            };
        }
        console.log(existingAdmin.auth_key);

        if (existingAdmin.auth_key) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const now = new Date();
            existingAdmin.password = hashedPassword;
            existingAdmin.passwordChangedAt = now;
            existingAdmin.updated_at = now;
            await existingAdmin.save();

            // Clear cache & emit force logout
            const cache = require("../utils/cache");
            if (cache && cache.del) {
                cache.del(`auth:user:${existingAdmin._id}`);
            }

            try {
                const socketUtil = require("../../socket");
                const io = socketUtil.getIO();
                io.emit("ADMIN_FORCE_LOGOUT", {
                    adminId: existingAdmin._id.toString(),
                    reason: "Password was reset. Please log in again."
                });
            } catch (sErr) {
                // socket not initialized or error
            }

            return {
                success: true,
                message: "Password updated successfully",
            };
        }
        return {
            success: false,
            message: "try again",
        };

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal server error",
        };
    }
};

exports.changeAdminPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const adminId = req.user?._id || req.user?.id;

        if (!adminId) {
            return {
                success: false,
                message: "Unauthorized request"
            };
        }

        if (!newPassword || newPassword.trim().length < 6) {
            return {
                success: false,
                message: "New password must be at least 6 characters long"
            };
        }

        const admin = await admin_model.findById(adminId);
        if (!admin) {
            return {
                success: false,
                message: "Admin account not found"
            };
        }

        // Verify current password if provided
        if (currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, admin.password);
            if (!isMatch) {
                return {
                    success: false,
                    message: "Current password is incorrect"
                };
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
        const now = new Date();
        admin.password = hashedPassword;
        admin.passwordChangedAt = now;
        admin.updated_at = now;

        // Issue a fresh new token for this active session
        const newToken = jwt.sign(
            { id: admin._id, role: "admin", iat: Math.floor(now.getTime() / 1000) },
            process.env.SECRET_KEY || "default_secret",
            { expiresIn: "30d" }
        );

        admin.auth_key = newToken;
        await admin.save();

        // Clear user cache so new password timestamp takes effect immediately
        const cache = require("../utils/cache");
        if (cache && cache.del) {
            cache.del(`auth:user:${admin._id}`);
        }

        // Emit real-time force logout to all other connected tabs / devices
        try {
            const socketUtil = require("../../socket");
            const io = socketUtil.getIO();
            io.emit("ADMIN_FORCE_LOGOUT", {
                adminId: admin._id.toString(),
                reason: "Password was changed by administrator. All other active sessions have been logged out."
            });
        } catch (sErr) {
            // Ignore socket emit error
        }

        return {
            success: true,
            message: "Password updated successfully. All other devices have been logged out.",
            token: newToken
        };
    } catch (error) {
        console.error("changeAdminPassword error:", error);
        return {
            success: false,
            message: error.message || "Failed to update password"
        };
    }
};

exports.admin_logout = async (req, res) => {
    try {

        if (!req.user) {
            return {
                success: false,
                message: "Unauthorized",
            };
        }
        // Remove auth_key from the admin record so the token can't be reused
        try {
            // prefer unsetting the field, but setting to null is also acceptable
            await admin_model.findByIdAndUpdate(req.user._id, { $unset: { auth_key: "" } });
        } catch (dbErr) {
            console.log('Failed to remove auth_key on logout:', dbErr);
            // don't block logout response if DB update fails
        }

        // Invalidate the token (token blacklist can be implemented here if needed)
        res.clearCookie("token");
        return {
            success: true,
            message: "Logged out successfully",
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal server error",
        };
    }
};

exports.getAllSubAdmins = async (req, res) => {
    try {
        const admins = await admin_model.find({}, '-password -otp -otpExpiry -auth_key').sort({ created_at: -1 });
        return {
            success: true,
            data: admins
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Failed to fetch admin users"
        };
    }
};

exports.createSubAdmin = async (req, res) => {
    try {
        const { email, password, name, permissions } = req.body;
        if (!email || !password) {
            return {
                success: false,
                message: "Email and password are required"
            };
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = await admin_model.findOne({ email: normalizedEmail });
        if (existing) {
            return {
                success: false,
                message: "An admin account with this email already exists"
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new admin_model({
            email: normalizedEmail,
            password: hashedPassword,
            name: name ? name.trim() : 'Admin User',
            role: 'subadmin',
            permissions: Array.isArray(permissions) ? permissions : [],
            isActive: true,
            passwordChangedAt: new Date()
        });

        await newAdmin.save();

        return {
            success: true,
            message: "Sub-admin account created successfully",
            data: {
                _id: newAdmin._id,
                email: newAdmin.email,
                name: newAdmin.name,
                role: newAdmin.role,
                permissions: newAdmin.permissions,
                isActive: newAdmin.isActive,
                created_at: newAdmin.created_at
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Failed to create sub-admin"
        };
    }
};

exports.updateSubAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, permissions, isActive } = req.body;

        const targetAdmin = await admin_model.findById(id);
        if (!targetAdmin) {
            return {
                success: false,
                message: "Admin account not found"
            };
        }

        if (name !== undefined) targetAdmin.name = name.trim();
        if (email !== undefined) {
            const normalizedEmail = email.toLowerCase().trim();
            const existing = await admin_model.findOne({ email: normalizedEmail, _id: { $ne: id } });
            if (existing) {
                return {
                    success: false,
                    message: "Another admin account is already using this email"
                };
            }
            targetAdmin.email = normalizedEmail;
        }
        if (permissions !== undefined) targetAdmin.permissions = Array.isArray(permissions) ? permissions : [];
        if (isActive !== undefined) targetAdmin.isActive = !!isActive;

        let passwordChanged = false;
        if (password && typeof password === 'string' && password.trim().length > 0) {
            targetAdmin.password = await bcrypt.hash(password.trim(), 10);
            targetAdmin.passwordChangedAt = new Date();
            passwordChanged = true;
        }

        targetAdmin.updated_at = new Date();
        await targetAdmin.save();

        // Clear cache and emit logout if password changed or account deactivated
        if (passwordChanged || isActive === false) {
            const cache = require("../utils/cache");
            if (cache && cache.del) {
                cache.del(`auth:user:${targetAdmin._id}`);
            }

            try {
                const socketUtil = require("../../socket");
                const io = socketUtil.getIO();
                io.emit("ADMIN_FORCE_LOGOUT", {
                    adminId: targetAdmin._id.toString(),
                    reason: isActive === false
                        ? "Account has been deactivated by Super Admin."
                        : "Your password was updated by the Super Admin. Please log in again."
                });
            } catch (sErr) {
                // socket not initialized
            }
        }

        return {
            success: true,
            message: "Admin account updated successfully",
            data: {
                _id: targetAdmin._id,
                email: targetAdmin.email,
                name: targetAdmin.name,
                role: targetAdmin.role,
                permissions: targetAdmin.permissions,
                isActive: targetAdmin.isActive,
                updated_at: targetAdmin.updated_at
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Failed to update sub-admin"
        };
    }
};

exports.deleteSubAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const targetAdmin = await admin_model.findById(id);
        if (!targetAdmin) {
            return {
                success: false,
                message: "Admin account not found"
            };
        }

        if (targetAdmin.role === 'superadmin') {
            return {
                success: false,
                message: "Cannot delete the Super Admin account"
            };
        }

        // Invalidate cache and emit logout
        const cache = require("../utils/cache");
        if (cache && cache.del) {
            cache.del(`auth:user:${id}`);
        }

        try {
            const socketUtil = require("../../socket");
            const io = socketUtil.getIO();
            io.emit("ADMIN_FORCE_LOGOUT", {
                adminId: id.toString(),
                reason: "Account has been deleted by Super Admin."
            });
        } catch (sErr) {
            // socket error
        }

        await admin_model.findByIdAndDelete(id);

        return {
            success: true,
            message: "Admin account removed successfully"
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Failed to remove admin account"
        };
    }
};
