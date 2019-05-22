const { Product } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class ProductController {
  async index(req, res) {
    const { p, order, by, page } = req.query;
    const orderBy = by ? by : "asc";
    const options = {
      attributes: ["id", "name", "description", "price", "discount"],
      page: page ? page : 1, // Default 1
      paginate: p && p, // Default 25
      order: order && [[order, orderBy]]
    };

    try {
      return res.json(await Product.paginate(options));
    } catch (error) {
      return res.json({ error: error.parent.hint });
    }
  }
}

module.exports = new ProductController();
