const { updateClientPaidAmount } = require('../services/ClientAmountPaid');

exports.updateClientPaidAmount = async (req, res) => {
    try {
      const data = await updateClientPaidAmount(req, res);
      if (data.success) {
        res.status(200).json(data);
      }
      else{
          res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
