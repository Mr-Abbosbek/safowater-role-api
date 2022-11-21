const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secretKey");
    const role = decodedToken.role;
    if (req.body.role && req.body.role !== role) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: error,
      message: "Token muddati tugadi!",
    });
  }
};