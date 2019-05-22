const sequelizePaginate = require("sequelize-paginate");
const uuid = require("uuid/v4");

("use strict");
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.DOUBLE,
      discount: DataTypes.DOUBLE
    },
    {
      hooks: {
        beforeSave: async product => {
          // product.id = await uuid();
        }
      }
    }
  );
  Product.associate = function(models) {
    // associations can be defined here
  };

  sequelizePaginate.paginate(Product);

  return Product;
};
