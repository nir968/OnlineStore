const validateType = (expectedTypes) => {
    return (req, res, next) => {
      try {
        const currentType = req.type; 
        if (!expectedTypes.includes(currentType)) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        next();
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    };
  };
  
  module.exports = validateType;
  