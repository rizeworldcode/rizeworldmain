const {
    admin_login, admin_logout, sendOtpTOadmin, verifyOtp, admin_forgatePassword,
    getAllSubAdmins, createSubAdmin, updateSubAdmin, deleteSubAdmin, changeAdminPassword
} = require("../services/adminValidation");
exports.admin_login = async (req, res) => {
    try {
        const data = await admin_login(req, res);
        if (data.success) {
            res.status(200).json(data);
        }
        else {
            res.status(401).json(data);
        }
    } catch (error) {
        console.log("Error:", error);
    }
};

exports.admin_logout = async (req, res) => {
    try {
        const data = await admin_logout(req, res);
        if (data.success) {
            res.status(200).json(data);
        }
        else {
            res.status(403).json(data);
        }
    } catch (error) {
        console.log("Error:", error);
    }
};

exports.sendOtpTOadmin = async (req, res) => {
    try {
        const data = await sendOtpTOadmin(req, res);
        if (data.success) {
            res.status(200).json(data);
        }
        else {
            res.status(403).json(data);
        }
    } catch (error) {
        console.log("Error:", error);
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const data = await verifyOtp(req, res);
        if (data.success) {
            res.status(200).json(data);
        }
        else {
            res.status(403).json(data);
        }
    } catch (error) {
        console.log("Error:", error);
    }
};

exports.admin_forgatePassword = async (req, res) => {
    try {
        const data = await admin_forgatePassword(req, res);
        if (data.success) {
            res.status(200).json(data);
        }
        else {
            res.status(403).json(data);
        }
    } catch (error) {
        console.log("Error:", error);
    }
};

exports.changeAdminPassword = async (req, res) => {
    try {
        const data = await changeAdminPassword(req, res);
        res.status(data.success ? 200 : 400).json(data);
    } catch (error) {
        console.log("Error in changeAdminPassword controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getAllSubAdmins = async (req, res) => {
    try {
        const data = await getAllSubAdmins(req, res);
        res.status(data.success ? 200 : 400).json(data);
    } catch (error) {
        console.log("Error in getAllSubAdmins controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.createSubAdmin = async (req, res) => {
    try {
        const data = await createSubAdmin(req, res);
        res.status(data.success ? 201 : 400).json(data);
    } catch (error) {
        console.log("Error in createSubAdmin controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateSubAdmin = async (req, res) => {
    try {
        const data = await updateSubAdmin(req, res);
        res.status(data.success ? 200 : 400).json(data);
    } catch (error) {
        console.log("Error in updateSubAdmin controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deleteSubAdmin = async (req, res) => {
    try {
        const data = await deleteSubAdmin(req, res);
        res.status(data.success ? 200 : 400).json(data);
    } catch (error) {
        console.log("Error in deleteSubAdmin controller:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};