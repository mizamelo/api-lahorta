const routes = require("express").Router();
const SessionController = require("./app/controllers/SessionController");
const ProductController = require("./app/controllers/ProductController");
const authMiddleware = require("./app/middlewares/auth");

routes.post("/sessions", SessionController.store);
routes.get("/products", ProductController.index);

routes.use(authMiddleware);
// Daqui para baixo penas rotas authenticadas
routes.get("/payment", (req, res) => {
  return res.status(200).send();
});

module.exports = routes;
