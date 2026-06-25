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

        const hearing = await hearingModel.find()
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


