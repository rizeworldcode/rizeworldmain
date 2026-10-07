const { addHearing, updateHearing, deleteHearing, getHearing, applyForHearing, updateApplicationStatus, deleteApplication } = require('../services/HR_hearing')


exports.addHearing = async (req, res) => {
    try {
        const data = await addHearing(req, res)
        if (data.success) {
            res.status(200).json(data)
        } else {
            res.status(403).json(data)
        }
    } catch (error) {
        console.log("error", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to add hearing",
            error: error.message
        })
    }
}

exports.updateHearing = async (req, res) => {
    try {
        const data = await updateHearing(req, res)
        if (data.success) {
            res.status(200).json(data)
        } else {
            res.status(403).json(data)
        }
    } catch (error) {
        console.log("error", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update hearing",
            error: error.message
        })
    }
}

exports.deleteHearing = async (req, res) => {
    try {
        const data = await deleteHearing(req, res)
        if (data.success) {
            res.status(200).json(data)
        } else {
            res.status(403).json(data)
        }
    } catch (error) {
        console.log("error", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to delete hearing",
            error: error.message
        })
    }
}

exports.getHearing = async (req, res) => {
    try {
        const data = await getHearing(req, res)
        if (data.success) {
            res.status(200).json(data)
        } else {
            res.status(403).json(data)
        }
    } catch (error) {
        console.log("error", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch hearing",
            error: error.message
        })
    }
}

// Public endpoint for candidate job applications
exports.applyForHearing = async (req, res) => {
    try {
        const data = await applyForHearing(req, res);
        if (data.success) {
            res.status(200).json(data);
        } else {
            res.status(400).json(data);
        }
    } catch (error) {
        console.log("error applying for hearing", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to apply for hearing",
            error: error.message
        });
    }
};

// Admin endpoint to update applicant status
exports.updateApplicationStatus = async (req, res) => {
    try {
        const data = await updateApplicationStatus(req, res);
        if (data.success) {
            res.status(200).json(data);
        } else {
            res.status(400).json(data);
        }
    } catch (error) {
        console.log("error updating application status", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update application status",
            error: error.message
        });
    }
};

// Admin endpoint to delete an application
exports.deleteApplication = async (req, res) => {
    try {
        const data = await deleteApplication(req, res);
        if (data.success) {
            res.status(200).json(data);
        } else {
            res.status(400).json(data);
        }
    } catch (error) {
        console.log("error deleting application", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to delete application",
            error: error.message
        });
    }
};