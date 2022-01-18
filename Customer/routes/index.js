const customerRouter = require('./customer.route')
const serviceRouter = require('./service.route')
const roomRouter = require('./room.route')
const orderRouter = require('./order.route')
const homeRouter = require('./home.route')
const apiRouter = require("./api.route");
const errorHandler = require('../middlewares/errorHandler')

const routes = app => {
    app.use('/account', customerRouter)
    app.use('/services', serviceRouter)
    app.use('/rooms', roomRouter)
    app.use('/orders', orderRouter)
    app.use("/api", apiRouter)
    app.use('/', homeRouter)
    errorHandler(app)
}

module.exports = routes