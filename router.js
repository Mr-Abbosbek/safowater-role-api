const router = require("express").Router();
const productsRouter = require("./scr/products/router");
router.use("/product", productsRouter);

module.exports = router;
