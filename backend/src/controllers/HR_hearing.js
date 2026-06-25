const { addHearing, updateHearing, deleteHearing, getHearing } = require('../services/HR_hearing')


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