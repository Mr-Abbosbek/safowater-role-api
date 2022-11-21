const dbConn = require("../../config/dbconfig");

const Products = function (product) {
  this.id = product.id;
  this.username = product.username;
  this.password = product.password;
  this.show_password = product.show_password;
  this.role = product.role;
};
Products.getProducts = (result) => {
  dbConn.query("SELECT * FROM employes", (err, res) => {
    if (err) {
      result(null, err);
    } else {
      result(null, res);
    }
  });
};
Products.getProductsId = (id, result) => {
  dbConn.query("SELECT * FROM employes WHERE id=$1", [id], (err, res) => {
    if (err) {
      result(null, err);
    } else {
      result(null, res);
    }
  });
};
Products.addProducts = (productData, result) => {
  dbConn.query(
    "INSERT INTO employes VALUES ($1, $2, $3, $4, $5)",
    [
      productData.id,
      productData.username,
      productData.password,
      productData.password,
      productData.role,
    ],
    (err, res) => {
      if (err) {
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};
Products.updateProducts = (id, productData, result) => {
  dbConn.query(
    "UPDATE employes SET id=$1, username=$2, password=$3, show_password=$4, role=$5 WHERE id=$6",
    [
      productData.id,
      productData.username,
      productData.password,
      productData.password,
      productData.role,
      id,
    ],
    (err, res) => {
      if (err) {
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};
Products.deleteProducts = (id, result) => {
  dbConn.query("delete from employes where id=$1", [id], (err, res) => {
    if (err) {
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

module.exports = Products;
