// const jwt = require("jsonwebtoken");

module.exports = {
  validateRegister: (req, res, next) => {
    // username min length 3
    if (!req.body.username || req.body.username.length < 3) {
      return res.status(400).send({
        msg: "Login kamida 3 ta belgidan iborat bo'lishi kerak",
      });
    }

    // password min 6 chars
    if (!req.body.password || req.body.password.length < 5) {
      return res.status(400).send({
        msg: "Parol kamida 5 ta belgidan iborat bo'lishi kerak",
      });
    }

    next();
  },
};
