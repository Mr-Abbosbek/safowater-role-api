const router = require('express').Router();
const ProductConn = require('./controller');
const auth = require('./../../Auth/auth');

router.route('/')
    .get(auth, ProductConn.getAll)
    .post(auth, ProductConn.createProduct);
    
router.route('/:id')
    .get(auth, ProductConn.getId)
    .put(auth, ProductConn.updateProduct)
    .delete(auth, ProductConn.deleteProduct);

module.exports = router;