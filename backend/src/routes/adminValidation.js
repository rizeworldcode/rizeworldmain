const express = require("express");
const router = express.Router();


const {
    admin_login, admin_logout, sendOtpTOadmin, verifyOtp, admin_forgatePassword,
    getAllSubAdmins, createSubAdmin, updateSubAdmin, deleteSubAdmin, changeAdminPassword
} = require("../controllers/adminValidation");

const user_auth = require("../middleware/authMiddleware");
router.post("/admin_login", admin_login);
router.post("/admin_logout", user_auth.protect, admin_logout);
router.post("/sendOtpTOadmin", sendOtpTOadmin);
router.post("/verifyOtp", verifyOtp);
router.post("/admin_forgatePassword", admin_forgatePassword);

// Password change for authenticated admin (invalidates all other sessions)
router.post("/admin/change-password", user_auth.protect, changeAdminPassword);

// Sub-admin management routes (Super Admin)
router.get("/admin-users", user_auth.protect, getAllSubAdmins);
router.post("/admin-users", user_auth.protect, createSubAdmin);
router.put("/admin-users/:id", user_auth.protect, updateSubAdmin);
router.delete("/admin-users/:id", user_auth.protect, deleteSubAdmin);

module.exports = router;