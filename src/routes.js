const routes = require('express').Router();
const CompanyController = require('./app/controllers/CompanyController');
const authMiddleware = require('./app/middlewares/auth');

routes.post('/', CompanyController.store);

routes.use(authMiddleware);
// Authenticate's routes only
routes.post('/verify', CompanyController.verify);
routes.post('/resubmit', CompanyController.resubmit);
routes.post('/verify-email', CompanyController.verifyEmail);

module.exports = routes;
