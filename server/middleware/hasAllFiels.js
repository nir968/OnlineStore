const hasAllFields = (req, res, fields) => {
    for (let field of fields) {
      if (!req.body[field]) {
        res.status(400).json({ message: `${field} is required` });
        return false;
      }
    }
    return true;
  };
  
  module.exports = hasAllFields;
  