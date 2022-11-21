const productModel = require('./model');

exports.getAll = (req,res) => {
    productModel.getProducts((err,products)=>{
        if(err){
            res.send(err);
        } else {
            res.send(products);
        }
    });
}
exports.getId = (req,res) => {
    productModel.getProductsId(req.params.id,(err, product)=>{
        if(err){
            res.send(err);
        } else {
            res.send(product.rows);
        }
    });
}
exports.createProduct = (req,res) => {
    let productData = new productModel(req.body);
    if(req.body.contructor === Object && Object.keys(req.body).length === 0){
        res.send('Xatolik yuz berdi');
    } else {
        productModel.addProducts(productData,(err,max)=>{
            if(err){
                res.send(err);
            } else {
                res.send(max);
            }
        });
    }
}
exports.updateProduct = (req,res) =>{
    let productData = new productModel(req.body);
    if(req.body.contructor === Object && Object.keys(req.body).length === 0){
        res.send({
            success: false,
            message: 'Xatolik yuz berdi'
        });
    } else {
        productModel.updateProducts(req.params.id, productData, (err) => {
            if(err){
                res.send(err);
            } else {
                res.send({
                    success: true,
                    message: `${req.params.id}-id dagi ma'lumot yangilandi`
                });
            }
        });
    }
}
exports.deleteProduct = (req,res)=>{
    productModel.deleteProducts(req.params.id, (err)=>{
        if(err){
            res.send(err);
        } else {
            res.send({
                success: true,
                message: `${req.params.id}-id dagi ma'lumot o'chirildi`
            });
        }
    });
}