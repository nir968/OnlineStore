const validEnum = (field, validValues) => {
    return (req, res) => {
        if (!validValues.includes(req.body[field])) {
            res.status(400).json({ message: `${field} must be one of the following: ${validValues.join(', ')}` });
            return false;
        }
        return true;
    };
};

module.exports = validEnum;
