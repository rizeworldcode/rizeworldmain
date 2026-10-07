const hearingModel = require("../models/HR_hearingModel");


exports.addHearing = async (req, res) => {
    try {
        if (!req.body) {
            return {
                success: false,
                message: "Body is required",
                data: null
            }
        }
        const hearing = await hearingModel.create({ ...req.body })
        return {
            success: true,
            message: "Hearing created successfully",
            data: hearing
        }
    } catch (error) {
        console.log("error", error.message);
        return {
            success: false,
            message: "Failed to create hearing",
            error: error.message
        }
    }
}

exports.updateHearing = async (req, res) => {
    try {
        if (!req.body) {
            return {
                success: false,
                message: "Body is required",
                data: null
            }
        }
        const { id } = req.params
        const hearing = await hearingModel.findByIdAndUpdate(id, { ...req.body }, { new: true })
        return {
            success: true,
            message: "Hearing updated successfully",
            data: hearing
        }
    } catch (error) {
        console.log("error", error.message);
        return {
            success: false,
            message: "Failed to update hearing",
            error: error.message
        }
    }
}

exports.deleteHearing = async (req, res) => {
    try {
        const { id } = req.params
        const hearing = await hearingModel.findByIdAndDelete(id)
        return {
            success: true,
            message: "Hearing deleted successfully",
            data: hearing
        }
    } catch (error) {
        console.log("error", error.message);
        return {
            success: false,
            message: "Failed to delete hearing",
            error: error.message
        }
    }
}

exports.getHearing = async (req, res) => {
    try {
        const hearing = await hearingModel.find().sort({ created_at: -1 });
        return {
            success: true,
            message: "Hearing fetched successfully",
            data: hearing
        }
    } catch (error) {
        console.log("error", error.message);
        return {
            success: false,
            message: "Failed to fetch hearing",
            error: error.message
        }
    }
}

// Apply for a job posting
exports.applyForHearing = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, linkedin, resume, experience, notes } = req.body;

        if (!name || !email) {
            return {
                success: false,
                message: "Name and Email are required to apply",
                data: null
            };
        }

        const hearing = await hearingModel.findById(id);
        if (!hearing) {
            return {
                success: false,
                message: "Job posting not found or no longer available",
                data: null
            };
        }

        const newApplication = {
            name,
            email,
            phone: phone || '',
            linkedin: linkedin || '',
            resume: resume || '',
            experience: experience || '',
            notes: notes || '',
            status: 'Pending',
            appliedAt: new Date()
        };

        if (!hearing.applications) {
            hearing.applications = [];
        }

        hearing.applications.unshift(newApplication);
        await hearing.save();

        return {
            success: true,
            message: "Application submitted successfully",
            data: newApplication
        };
    } catch (error) {
        console.log("error applying for hearing", error.message);
        return {
            success: false,
            message: "Failed to submit application",
            error: error.message
        };
    }
};

// Update applicant status (admin)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { id, appId } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Reviewing', 'Shortlisted', 'Interviewed', 'Rejected', 'Hired'];
        if (!status || !validStatuses.includes(status)) {
            return {
                success: false,
                message: `Status must be one of: ${validStatuses.join(', ')}`,
                data: null
            };
        }

        const hearing = await hearingModel.findById(id);
        if (!hearing) {
            return {
                success: false,
                message: "Job posting not found",
                data: null
            };
        }

        const appIndex = (hearing.applications || []).findIndex(a => a._id.toString() === appId);
        if (appIndex === -1) {
            return {
                success: false,
                message: "Applicant not found",
                data: null
            };
        }

        hearing.applications[appIndex].status = status;
        await hearing.save();

        return {
            success: true,
            message: "Application status updated successfully",
            data: hearing.applications[appIndex]
        };
    } catch (error) {
        console.log("error updating application status", error.message);
        return {
            success: false,
            message: "Failed to update application status",
            error: error.message
        };
    }
};

// Delete applicant (admin)
exports.deleteApplication = async (req, res) => {
    try {
        const { id, appId } = req.params;

        const hearing = await hearingModel.findById(id);
        if (!hearing) {
            return {
                success: false,
                message: "Job posting not found",
                data: null
            };
        }

        hearing.applications = (hearing.applications || []).filter(a => a._id.toString() !== appId);
        await hearing.save();

        return {
            success: true,
            message: "Application deleted successfully",
            data: hearing
        };
    } catch (error) {
        console.log("error deleting application", error.message);
        return {
            success: false,
            message: "Failed to delete application",
            error: error.message
        };
    }
};



